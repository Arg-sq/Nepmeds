import {
  Button,
  Flex,
  Grid,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DataTable } from "@nepMeds/components/DataTable";
import ModalComponent from "@nepMeds/components/Form/ModalComponent";
import { colors } from "@nepMeds/theme/colors";
import { IoAdd, IoFunnelOutline } from "react-icons/io5";
import { svgs } from "@nepMeds/assets/svgs";
import { FormProvider, useForm } from "react-hook-form";
import {
  useCreateFaq,
  useDeleteFaq,
  useGetFaqById,
  useGetFaqList,
  useUpdateFaq,
} from "@nepMeds/service/nepmeds-faq";

import FloatinglabelTextArea from "@nepMeds/components/Form/FloatingLabeltextArea";
import { columns } from "./faqColumn";
import { toastFail } from "@nepMeds/components/Toast";
import { useEffect, useState } from "react";
import { useDebounce } from "@nepMeds/hooks/useDebounce";
import SkeletonControl from "@nepMeds/components/Loader";
import TableWrapper from "@nepMeds/components/TableWrapper";
import SearchInput from "@nepMeds/components/Search";

const defaultValues = {
  question: "",
  answer: "",
};

const FAQ = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [id, setId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();

  const formMethods = useForm({
    defaultValues,
  });
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = formMethods;

  const debouncedInputValue = useDebounce(searchValue, 500);

  // React Query
  const { mutateAsync: createFaq } = useCreateFaq();
  const { mutateAsync: updateFaq } = useUpdateFaq();
  const { data: tableData, isFetching } = useGetFaqList({
    ...pagination,
    search: debouncedInputValue,
  });
  const { mutateAsync: deleteFaq, isLoading: isDeleting } = useDeleteFaq();
  const { data: faqById, isFetching: isFetchingFaq } = useGetFaqById({ id });
  // React Query Ends

  const onModalClose = () => {
    reset(defaultValues);
    onClose();
    setIsEdit(false);
    setId("");
    onCloseDeleteModal();
  };

  const submitFaq = async (faq: typeof defaultValues) => {
    try {
      const isValid = formMethods.trigger();
      if (!isValid) return;
      if (isEdit) {
        await updateFaq({ id: +id, ...faq });
      } else {
        await createFaq(faq);
      }
      onModalClose();
    } catch (error) {
      toastFail("Failed to add FAQ!");
    }
  };

  useEffect(() => {
    if (isEdit && faqById) {
      reset({
        question: faqById.question,
        answer: faqById.answer,
      });
    }
  }, [id, faqById]);

  return (
    <TableWrapper>
      <>
        {/* Table Header */}
        <Flex justifyContent={"end"} mb={5}>
          <Button variant={"primary"} onClick={onOpen} leftIcon={<IoAdd />}>
            Add Question
          </Button>
        </Flex>

        <Grid display={"flex"} justifyContent={"space-between"}>
          <Text color={colors.blue_100} variant="tableHeading">
            Frequently Asked Questions
          </Text>
          <HStack>
            <SearchInput
              setSearchValue={setSearchValue}
              setPageParams={setPagination}
            />
            <Button
              color={colors.grey_dark}
              bg={colors.white}
              outlineColor={colors.grey_dark}
              h={8}
            >
              <IoFunnelOutline pointerEvents={"none"} />
              &nbsp; Filter
            </Button>
          </HStack>
        </Grid>

        {/* Table Header Ends */}

        <DataTable
          columns={columns({
            pagination,
            onOpenDeleteModal,
            setId,
            onOpen,
            setIsEdit,
          })}
          data={tableData?.results ?? []}
          isLoading={isFetching}
          pagination={{
            manual: true,
            pageParams: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
            pageCount: tableData?.page_count,
            onChangePagination: setPagination,
          }}
        />
        {/* Add or Edit Faq */}
        <ModalComponent
          isOpen={isOpen}
          onClose={onModalClose}
          size="md"
          heading={
            <HStack>
              <svgs.logo_small />
              <Text>{`${isEdit ? "Edit" : "Add"}`} FAQ</Text>
            </HStack>
          }
          footer={
            <HStack w="100%" gap={3}>
              <Button
                variant={"primaryOutline"}
                onClick={onModalClose}
                flex={1}
                border="1px solid"
                fontWeight={400}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                onClick={handleSubmit(submitFaq)}
                type="submit"
                isLoading={isSubmitting}
              >
                {`${isEdit ? "Edit" : "Add"}`}
              </Button>
            </HStack>
          }
        >
          {isFetchingFaq ? (
            <Flex gap={6} direction="column">
              <SkeletonControl variant="skeleton" height={"30px"} length={3} />
            </Flex>
          ) : (
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(submitFaq)}>
                <Flex direction={"column"} gap={2}>
                  <FloatinglabelTextArea
                    register={register}
                    label="Question"
                    name="question"
                    required
                    style={{ background: colors.forminput, border: "none" }}
                    error={errors.question?.message ?? ""}
                  />
                  <FloatinglabelTextArea
                    register={register}
                    label="Answer"
                    name="answer"
                    required
                    style={{ background: colors.forminput, border: "none" }}
                    error={errors?.answer?.message ?? ""}
                  />
                </Flex>
              </form>
            </FormProvider>
          )}
        </ModalComponent>

        <ModalComponent
          size="sm"
          isOpen={isDeleteModalOpen}
          onClose={onModalClose}
          heading={
            <HStack>
              <svgs.logo_small />
              <Text>Delete FAQ</Text>
            </HStack>
          }
          footer={
            <HStack w="100%" gap={3}>
              <Button
                variant={"primaryOutline"}
                onClick={onModalClose}
                flex={1}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                variant={"reset"}
                onClick={() => {
                  deleteFaq({ id });
                  onModalClose();
                }}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </HStack>
          }
        >
          <Text textAlign={"center"}>
            Are you sure you want to delete the FAQ?
          </Text>
        </ModalComponent>
      </>
    </TableWrapper>
  );
};

export default FAQ;

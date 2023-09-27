import { SearchIcon } from "@chakra-ui/icons";
import {
  // Badge,
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { svgs } from "@nepMeds/assets/svgs";
import { DataTable } from "@nepMeds/components/DataTable";
import { approvedColumns } from "@nepMeds/components/DataTable/Columns";
import FloatingLabelInput from "@nepMeds/components/Form/FloatingLabelInput";
import ModalComponent from "@nepMeds/components/Form/ModalComponent";

import Select from "@nepMeds/components/Form/Select";
import { STATUSTYPE } from "@nepMeds/config/enum";
import { useDebounce } from "@nepMeds/hooks/useDebounce";
import { useDoctorList } from "@nepMeds/service/nepmeds-doctorlist";
import { colors } from "@nepMeds/theme/colors";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoFunnelOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ISpecializationList } from "./DoctorsList";

interface Props {
  specializationList: ISpecializationList[];
}

const ApprovedDocList = ({ specializationList }: Props) => {
  const navigate = useNavigate();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterValue, setFilterValue] = useState<any>({
    status: STATUSTYPE.approved,
  });

  const formMethods = useForm();

  const [searchFilter, setSearchFilter] = useState("");

  const debouncedInputValue = useDebounce(searchFilter, 500);

  const { data, isFetching } = useDoctorList({
    ...filterValue,
    page_no: pageIndex + 1,
    page_size: pageSize,
    name: debouncedInputValue,
  });

  const handleFilter = async (isReset: boolean) => {
    if (!isReset) {
      setFilterValue({
        status: STATUSTYPE.approved,
        from_date: formMethods.getValues("fromDate"),
        to_date: formMethods.getValues("toDate"),
        specialization: formMethods.getValues("Specialization"),
      });
    } else {
      setFilterValue({
        status: STATUSTYPE.approved,
      });
      formMethods.reset({});
    }

    onModalClose();
  };

  return (
    <>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onModalClose}
        size={"xl"}
        heading={
          <HStack>
            <svgs.logo_small />
            <Text>Filter</Text>
          </HStack>
        }
        footer={
          <HStack w={"full"} justifyContent={"flex-end"}>
            <Button
              w={"150px"}
              variant={"reset"}
              onClick={() => handleFilter(true)}
            >
              Reset
            </Button>
            <Button
              variant={"primaryOutline"}
              w={"150px"}
              onClick={() => handleFilter(true)}
            >
              Cancel
            </Button>
            <Button w={"150px"} onClick={() => handleFilter(false)}>
              Done
            </Button>
          </HStack>
        }
      >
        <VStack h={"auto"}>
          <FormProvider {...formMethods}>
            <Select
              placeholder="select specialization"
              label="Specialization"
              name="Specialization"
              required
              register={formMethods.register}
              options={specializationList}
            />
            <Box display={"flex"} width={"100%"}>
              <FloatingLabelInput
                label="From"
                name="fromDate"
                register={formMethods.register}
                type="date"
              />
              <Box ml={1}>
                <FloatingLabelInput
                  label="To"
                  name="toDate"
                  register={formMethods.register}
                  type="date"
                />
              </Box>
            </Box>
          </FormProvider>
        </VStack>
      </ModalComponent>

      <HStack justifyContent="space-between">
        <Text fontWeight="medium">Approved Doctors</Text>
        <HStack>
          <InputGroup w="190px" borderColor={colors.grey_dark}>
            <InputLeftElement pointerEvents="none" h={8}>
              <SearchIcon color={colors.grey_dark} boxSize={4} />
            </InputLeftElement>
            <Input
              w={40}
              h={8}
              placeholder="Search"
              onChange={({ target: { value } }) => {
                setSearchFilter(value);
                setPagination({ pageIndex: 0, pageSize });
              }}
            />
          </InputGroup>
          <Button
            color={colors.grey_dark}
            bg={colors.white}
            outlineColor={colors.grey_dark}
            h={8}
            onClick={onModalOpen}
          >
            <IoFunnelOutline pointerEvents={"none"} />
            &nbsp; Filter
          </Button>
        </HStack>
      </HStack>
      <DataTable
        columns={approvedColumns(navigate, { pageIndex, pageSize })}
        data={data?.results ?? []}
        isLoading={isFetching}
        pagination={{
          manual: true,
          pageParams: { pageIndex, pageSize },
          pageCount: data?.page_count,
          onChangePagination: setPagination,
        }}
      />

      {data?.count === 0 && <Box>No Result Found!</Box>}
    </>
  );
};

export default ApprovedDocList;

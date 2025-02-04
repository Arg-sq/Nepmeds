import { Box, GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import FloatingLabelInput from "@nepMeds/components/Form/FloatingLabelInput";
import { IRegisterFields } from "@nepMeds/components/FormComponents/RegistrationForm/RegistrationForm";
import ImageUpload from "@nepMeds/components/ImageUpload";
import { normalURL } from "@nepMeds/service/service-axios";
import { colors } from "@nepMeds/theme/colors";
import { fileToString } from "@nepMeds/utils/fileToString";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type INmcProp = Omit<IRegisterFields["nmc"], "isSubmitted" | "nmc_file">;
interface IProp extends INmcProp {
  nmc_file: File | string | null;
}
export const NmcForm = ({ data }: { data?: IProp }) => {
  // hook form
  const {
    register,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext<IRegisterFields>();

  //  state
  const [nmcFile, setNmcFile] = useState<File | string | null>(null);
  //  hooks
  const { nmc: nmcData } = watch();

  //  set data if data exist
  useEffect(() => {
    if (data) {
      reset({
        ...getValues(),
        nmc: {
          nmc_number: data.nmc_number,
          nmc_issued_date: data.nmc_issued_date,
          nmc_expiry_date: data.nmc_expiry_date,
          nmc_file: data.nmc_file as string,
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setNmcFile(`${normalURL.replace("/backend", "")}/media/${data.nmc_file}`);
    } else {
      setNmcFile(nmcData?.nmc_file?.[0] ?? null);
    }
  }, [data]);

  // methods
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const imgData = await fileToString(e);
    setNmcFile(imgData);
  };

  //  validations
  const checkPictureSize = (image: File | null) => {
    if (image && (image as File)?.size / 1048576 > 1) {
      return "Image is greater than 1MB";
    }
  };

  return (
    <>
      <Box position="relative" m={2}>
        <GridItem colSpan={4}>
          <Text fontWeight={400} mb={"12px"} fontSize={"sm"}>
            Upload Certificate{" "}
            <span style={{ color: colors.error }}>&nbsp;*</span>
          </Text>
        </GridItem>
        <GridItem colSpan={2}>
          <ImageUpload
            SelectedImage={nmcFile}
            setSelectedImage={setNmcFile}
            handleImageChange={handleImageChange}
            name="nmc.nmc_file"
            helperText={true}
            upload_text="Upload a File "
            error={
              errors.nmc?.nmc_file?.message ||
              checkPictureSize(watch("nmc.nmc_file")?.[0] as File)
            }
            rules={{
              required: "Certificate is required",
            }}
            setValue={setValue}
          />
        </GridItem>
        <SimpleGrid columns={{ base: 1, lg: 3 }} mt={4} mb={8} gap={4}>
          <FloatingLabelInput
            label="NMC No."
            name="nmc.nmc_number"
            register={register}
            required
            style={{ background: colors.forminput, border: "none" }}
            rules={{
              required: "NMC No. is required.",
            }}
            error={errors.nmc?.nmc_number?.message?.toString()}
          />
          <FloatingLabelInput
            name="nmc.nmc_issued_date"
            label="Date of Issue"
            register={register}
            type="date"
            required
            _hover={{ cursor: "pointer" }}
            style={{
              background: colors.forminput,
              border: "none",
            }}
            rules={{
              required: "Date of Certificate Issue is required.",
            }}
            error={errors.nmc?.nmc_issued_date?.message}
          />
          <FloatingLabelInput
            name="nmc.nmc_expiry_date"
            label="Expire Date"
            register={register}
            type="date"
            _hover={{ cursor: "pointer" }}
            style={{
              background: colors.forminput,
              border: "none",
            }}
          />
        </SimpleGrid>
      </Box>
    </>
  );
};

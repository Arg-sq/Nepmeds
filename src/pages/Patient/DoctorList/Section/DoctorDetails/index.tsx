import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Divider, Flex, Text, VStack } from "@chakra-ui/layout";
import { FormLabel, HStack, Image, Tooltip } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import userAvatar from "@nepMeds/assets/images/userAvatar.png";
import {
  BackArrowIcon,
  ImageCancelIcon,
  NoDataIcon,
  UploadImageIcon,
} from "@nepMeds/assets/svgs";
import FormControl from "@nepMeds/components/Form/FormControl";
import Input from "@nepMeds/components/Form/Input";
import { IOptionItem } from "@nepMeds/components/Form/MultiSelect";
import WrapperBox from "@nepMeds/components/Patient/DoctorConsultation/WrapperBox";
import TransactionBox from "@nepMeds/components/Payment/TransactionBox";
import ReadMore from "@nepMeds/components/ReadMore";
import AvailabilitySection from "@nepMeds/pages/Patient/DoctorDetails/components/AvailabilitySection";
import {
  calcDiscountedAmount,
  DiscountDetailSkeleton,
  DiscountDetailsSection,
} from "@nepMeds/pages/Patient/DoctorDetails/components/DiscountDetails";
import {
  IDiscountDetails,
  useGetDiscountByCode,
} from "@nepMeds/service/nepmeds-discount";
import {
  IPatientAppointmentBasicDetails,
  useCreatePatientAppointment,
} from "@nepMeds/service/nepmeds-patient-appointment";
import {
  IAvailability,
  IDoctorListById,
} from "@nepMeds/service/nepmeds-patient-doctorList";
import { useGetSymptoms } from "@nepMeds/service/nepmeds-symptoms";
import TokenService from "@nepMeds/service/service-token";
import { colors } from "@nepMeds/theme/colors";
import { dateFormatter } from "@nepMeds/utils/index";
import { scrollToTop } from "@nepMeds/utils/scrollToTop";
import { HttpStatusCode } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@nepMeds/routes/routes.constant";

interface IPatientAppointment extends IPatientAppointmentBasicDetails {
  symptoms: IOptionItem[];
  availabilityDate?: string;
  availability: IOptionItem[];
  old_report_file?: FileList | null;
}

const today = new Date().toISOString().split("T")[0];
const defaultValues = {
  // availability: [{ label: "", value: "" }],
  availability: [],
  full_name: "",
  gender: "",
  symptoms: [],
  old_report_file: null,
  // symptoms: [{ label: "", value: "" }],
  description: "",
  // status: "",
  age: "",
  availabilityDate: new Date(Date.now()).toISOString().split("T")[0],
  coupon: "",
};

const schema = Yup.object({
  full_name: Yup.string().required("This field is required"),
  symptoms: Yup.array()
    .required("This field is required")
    .min(1, "This field is required"),
  description: Yup.string().required("This field is required"),
  age: Yup.number()
    .max(115, "age must be at most 115 years")
    .positive("age must be greater than zero")
    .typeError("age must be a number"),
});

const DoctorDetails: React.FC<{
  doctorInfo: IDoctorListById | undefined;
  isFetching: boolean;
  availability: IAvailability[] | undefined;
  setTargeDate: Dispatch<SetStateAction<string>>;
  next_availability: IAvailability | undefined;
}> = ({
  doctorInfo,
  availability,
  isFetching,
  setTargeDate,
  next_availability,
}) => {
  const isAuthenticated = TokenService.isAuthenticated();
  const [selectedAvailability, setSelectedAvailability] = useState<number[]>(
    []
  );
  const navigate = useNavigate();
  const [isAvailability, setIsAvailability] = useState<"0" | "1" | "2">("0");
  const [appointment, setAppointment] = useState(true);
  const [discountDetails, setDiscountDetails] =
    useState<IDiscountDetails | null>(null);

  // REACT QUERIES
  const { data: symptomData } = useGetSymptoms();
  const { mutateAsync: createPatientAppointment, isLoading } =
    useCreatePatientAppointment();

  const {
    mutateAsync: discountCode,
    isLoading: isDiscountLoading,
    isSuccess,
  } = useGetDiscountByCode();
  // REACT QUERIES END

  const symptomDataOptions =
    symptomData?.map(p => ({
      label: p.name,
      value: p.id,
    })) || [];

  useEffect(() => {
    setIsAvailability("0");
    setSelectedAvailability([]);
  }, [doctorInfo]);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
    reset,
    control,
    trigger,
    getValues,
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const oldReportFileWatch = watch("old_report_file");
  const availabilityDateWatch = watch("availabilityDate");
  const couponCode = watch("coupon");

  const onetimeCoupon = discountDetails?.onetime_coupon ? 1 : 0;
  const { bookingFee, discountAmount, discountedAmount } = calcDiscountedAmount(
    {
      doctorInfo,
      discountDetails,
      selectedAvailability,
    }
  );

  const onDiscountCouponApplied = async () => {
    try {
      const response = await discountCode({
        code: couponCode,
        doctor_id: doctorInfo?.id || 0,
      });
      setDiscountDetails(response.data.data);
    } catch (e) {
      setDiscountDetails(null);
      setValue("coupon", "");
    }
  };

  useEffect(() => {
    availabilityDateWatch && setTargeDate(availabilityDateWatch);
    setValue("availability", []);
  }, [availabilityDateWatch]);

  const onSubmitHandler = async (data: IPatientAppointment) => {
    try {
      const response = await createPatientAppointment({
        patientAppointmentDetails: {
          ...data,
          availabilities: selectedAvailability,
          symptoms: data.symptoms.map(({ value }) => +value),
          old_report_file: data.old_report_file?.[0] as File,
          doctor: doctorInfo?.id as number,
          total_amount_paid:
            (doctorInfo?.schedule_rate ? +doctorInfo?.schedule_rate : 0) *
            selectedAvailability.length,
        },
      });
      if (response.status === HttpStatusCode.Created) {
        setSelectedAvailability([]);
        reset(defaultValues);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      selectedAvailability?.length && setIsAvailability("1");
      setAppointment(false);
    } else {
      window.location.href = import.meta.env.VITE_APP_NEPMEDS_LOGIN_ROUTE;
    }
  };

  const bookedDates = availability?.filter(data => {
    return selectedAvailability.includes(data.id);
  });

  return (
    <Box>
      {doctorInfo ? (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          {isAvailability === "0" && (
            <>
              <WrapperBox
                backgroundColor={colors.white}
                border={`2px solid ${colors.gray_border}`}
                style={{
                  px: { base: "0", md: "2", xl: "4" },
                  minHeight: "647px",
                  borderTopRadius: 3,
                }}
              >
                <>
                  <Flex direction={"column"} gap={5}>
                    <Flex direction={"column"} alignItems={"center"} gap={2}>
                      <Text
                        fontWeight={600}
                        fontSize={"sm"}
                        color={colors.dark_blue}
                      >
                        Doctor’s Profile
                      </Text>
                      <Avatar
                        size={"lg"}
                        src={doctorInfo.profile_picture ?? userAvatar}
                      />
                      <Text
                        fontWeight={600}
                        fontSize={"md"}
                        textTransform="capitalize"
                        cursor={"pointer"}
                        onClick={() =>
                          navigate(
                            `${NAVIGATION_ROUTES.PATIENT.DOCTOR_DETAILS}/${doctorInfo.id}`
                          )
                        }
                      >
                        {doctorInfo?.name}
                      </Text>
                      <Box textAlign={"center"}>
                        <Text fontWeight={400} fontSize={"xs"}>
                          {doctorInfo?.specialization_names &&
                            doctorInfo?.specialization_names.map(
                              (specializaion_name, index) => {
                                return `${
                                  index ===
                                    doctorInfo.specialization_names.length -
                                      1 ||
                                  doctorInfo.specialization_names.length === 1
                                    ? specializaion_name.name
                                    : `${specializaion_name.name} - `
                                }`;
                              }
                            )}
                        </Text>
                        <Text fontWeight={400} fontSize={"xs"}>
                          NMC No: {doctorInfo?.doctor_nmc_info || "N/A"}
                        </Text>
                      </Box>
                      <Divider borderWidth={"0.5px"} />
                    </Flex>
                    <Flex
                      direction={"column"}
                      justifyContent={"flex-start"}
                      gap={1}
                      px={4}
                      wordBreak={"break-all"}
                    >
                      <Text fontWeight={700} fontSize={"13px"}>
                        About
                      </Text>
                      <ReadMore
                        bio_detail={doctorInfo?.bio_detail}
                        maxWords={20}
                      />
                    </Flex>
                    <Flex
                      bg={colors.sky_blue}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      p={2}
                      px={3.5}
                      borderRadius={"8px"}
                    >
                      <Text
                        fontWeight={590}
                        fontSize={"13px"}
                        color={colors.primary}
                      >
                        Consultation Fee
                      </Text>
                      <Text
                        fontWeight={500}
                        fontSize={"md"}
                        color={colors.forest_green}
                      >
                        NRs. {doctorInfo.schedule_rate}
                      </Text>
                    </Flex>
                    <Divider borderWidth={"0.5px"} />
                    <Flex alignItems={"center"}>
                      <Flex flex={0.5}>
                        <Text variant={"md600"}>Available time</Text>
                      </Flex>
                      <Flex flex={0.5}>
                        <FormControl
                          control={"input"}
                          label={""}
                          type={"date"}
                          name={"availabilityDate"}
                          placeholder={""}
                          error={errors?.availabilityDate?.message ?? ""}
                          register={register}
                          variant={"outline"}
                          style={{
                            minHeight: "35px",
                            borderRadius: "9px",
                          }}
                          // Restricts selection of past date in Datepicker
                          min={today}
                          required
                        />
                      </Flex>
                    </Flex>

                    {!!availability?.length && (
                      <>
                        <AvailabilitySection
                          title="Morning"
                          availability={availability}
                          selectedAvailabilities={selectedAvailability}
                          setSelectedAvailabilities={setSelectedAvailability}
                        />
                        <AvailabilitySection
                          title="Evening"
                          availability={availability}
                          selectedAvailabilities={selectedAvailability}
                          setSelectedAvailabilities={setSelectedAvailability}
                        />
                      </>
                    )}
                    {!isFetching &&
                      (next_availability && !availability?.length ? (
                        <Text fontSize={"xs"} textAlign={"center"}>
                          This doctor is available on{" "}
                          {format(
                            new Date(next_availability.date),
                            "do 'of' MMMM yyyy"
                          )}
                        </Text>
                      ) : (
                        <FormLabel
                          color={colors.error}
                          fontSize={"xs"}
                          textAlign={"center"}
                        >
                          {!availability?.length
                            ? "This doctor is not available on this date."
                            : selectedAvailability?.length === 0 &&
                              !appointment &&
                              "Please Choose the availability*"}
                        </FormLabel>
                      ))}
                  </Flex>
                </>
              </WrapperBox>
              <Button
                width="full"
                borderRadius="none"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
            </>
          )}
          {isAvailability === "1" && (
            <>
              <WrapperBox
                backgroundColor={colors.white}
                border={`2px solid ${colors.gray_border}`}
                style={{
                  px: { base: "0", md: "2", xl: "4" },
                  py: 4,
                  height: "auto",
                  borderTopRadius: 3,
                }}
              >
                <>
                  <Flex direction={"column"} gap={5}>
                    <Flex direction={"column"} gap={4} px={4}>
                      <Flex gap={4} alignItems={"center"}>
                        <BackArrowIcon
                          cursor={"pointer"}
                          onClick={() => setIsAvailability("0")}
                        />
                        <Text
                          fontWeight={600}
                          fontSize={"md"}
                          color={colors.dark_blue}
                        >
                          Appointment Detail
                        </Text>
                      </Flex>
                      <Flex direction={"column"} gap={2}>
                        <Text
                          fontWeight={600}
                          fontSize={"md"}
                          textTransform="capitalize"
                        >
                          {doctorInfo?.title} {doctorInfo?.name}
                        </Text>
                        <Text fontWeight={400} fontSize={"xs"}>
                          {doctorInfo?.specialization_names &&
                            doctorInfo?.specialization_names.map(
                              (specializaion_name, index) => {
                                return `${
                                  index ===
                                    doctorInfo.specialization_names.length -
                                      1 ||
                                  doctorInfo.specialization_names.length === 1
                                    ? specializaion_name.name
                                    : `${specializaion_name.name} - `
                                }`;
                              }
                            )}
                        </Text>
                        <Text fontWeight={400} fontSize={"xs"}>
                          NMC No: {doctorInfo?.doctor_nmc_info || "N/A"}
                        </Text>
                        <Box>
                          {bookedDates?.map(bookedDate => (
                            <Text
                              key={bookedDate.id}
                              color={colors.primary}
                              fontSize={"sm"}
                              fontWeight={500}
                            >
                              {dateFormatter({
                                date: bookedDate?.date,
                                time: bookedDate?.from_time,
                              })}
                            </Text>
                          ))}
                        </Box>
                      </Flex>
                      <Divider borderWidth={"0.5px"} />
                    </Flex>
                    <Flex gap={5} direction={"column"} px={4}>
                      <Text fontWeight={600} fontSize={"md"}>
                        Please enter patient information
                      </Text>
                      <FormControl
                        control={"input"}
                        label={"Full Name"}
                        name={"full_name"}
                        placeholder={"Enter patient name"}
                        error={errors?.full_name?.message ?? ""}
                        register={register}
                        variant={"outline"}
                        style={{
                          minHeight: "35px",
                        }}
                        required
                      />
                      <FormControl
                        control={"radio"}
                        label={"Choose Gender"}
                        name={"gender"}
                        register={register}
                        options={[
                          { label: "Male", value: "1" },
                          { label: "Female", value: "2" },
                          { label: "Others", value: "3" },
                        ]}
                      />
                      <FormControl
                        control={"input"}
                        label={"Enter age:"}
                        name={"age"}
                        register={register}
                        error={errors?.age?.message ?? ""}
                        required
                      />
                      <FormControl
                        control={"multiSelect"}
                        label={"Select Health Issue"}
                        name={"symptoms"}
                        placeholder={"Select health issue"}
                        variant={"outline"}
                        size={"sm"}
                        selectControl={control}
                        register={register}
                        options={symptomDataOptions ?? []}
                        style={{
                          background: colors.white,
                          minHeight: "35px",
                        }}
                        required
                      />
                      <FormControl
                        control={"textArea"}
                        label={"Tell us about your symptoms"}
                        name={"description"}
                        placeholder={"Type your symptoms here"}
                        sx={{
                          borderRadius: "8px",
                          p: "3",
                          minHeight: "200px",
                        }}
                        error={errors?.description?.message ?? ""}
                        register={register}
                      />
                      <Box>
                        <FormLabel
                          fontWeight={"500"}
                          fontSize={"13px"}
                          fontFamily={"Quicksand"}
                        >
                          Upload Older Reports or Prescription (if any)
                        </FormLabel>
                        <FormControl
                          register={register}
                          control={"input"}
                          type={"file"}
                          id={"image"}
                          name={"old_report_file"}
                          display={"none"}
                          accept={"image/png, image/jpeg"}
                        />
                        <Flex>
                          <FormLabel
                            htmlFor="image"
                            cursor={"pointer"}
                            border={`1px dashed ${colors.gray}`}
                            width={"76px"}
                          >
                            <UploadImageIcon />
                          </FormLabel>

                          {oldReportFileWatch && (
                            <HStack>
                              <Image
                                src={URL.createObjectURL(
                                  oldReportFileWatch[0] as unknown as Blob
                                )}
                                width={"76px"}
                                objectFit={"cover"}
                              />
                              <Box
                                onClick={() =>
                                  setValue("old_report_file", null)
                                }
                              >
                                <ImageCancelIcon
                                  style={{ cursor: "pointer" }}
                                />
                              </Box>
                            </HStack>
                          )}
                        </Flex>
                      </Box>
                    </Flex>
                  </Flex>
                </>
              </WrapperBox>
              <Button
                width="full"
                borderRadius="none"
                onClick={async () => {
                  const isValid = await trigger();
                  if (!isValid) {
                    return;
                  } else {
                    scrollToTop();
                    setIsAvailability("2");
                  }
                }}
                isLoading={isLoading}
              >
                Proceed
              </Button>
            </>
          )}

          {isAvailability === "2" && (
            <>
              <WrapperBox
                backgroundColor={colors.white}
                border={`2px solid ${colors.gray_border}`}
                style={{
                  px: { base: "0", md: "2", xl: "4" },
                  py: 4,
                  height: "auto",
                  borderTopRadius: 3,
                }}
              >
                <>
                  <Flex gap={4} alignItems={"center"}>
                    <BackArrowIcon
                      cursor={"pointer"}
                      onClick={() => setIsAvailability("1")}
                    />
                    <Text
                      fontWeight={600}
                      fontSize={"md"}
                      color={colors.dark_blue}
                    >
                      Please choose your payment method
                    </Text>
                  </Flex>

                  {/* Discount Code*/}
                  <Flex direction={"column"} gap={3} my={4}>
                    <Text variant={"small600"}>Promo Codes</Text>
                    <Flex alignItems={"center"} gap={2}>
                      <Input
                        name={"coupon"}
                        register={register}
                        placeholder={"Enter Promo Code"}
                      />
                      <Tooltip
                        hasArrow
                        label={"Please click Apply to claim the discount"}
                        placement="bottom-start"
                      >
                        <Button
                          height={"40px"}
                          borderRadius={"5px"}
                          isDisabled={!couponCode}
                          bgColor={couponCode ? colors.reset : colors.primary}
                          onClick={onDiscountCouponApplied}
                        >
                          Apply
                        </Button>
                      </Tooltip>
                    </Flex>
                    {isDiscountLoading ? (
                      <DiscountDetailSkeleton />
                    ) : (
                      isSuccess &&
                      discountDetails && (
                        <DiscountDetailsSection
                          discountApplicableNumber={
                            onetimeCoupon ||
                            discountDetails?.remaining_applicable_coupon
                          }
                          bookingFee={bookingFee}
                          discountAmount={discountAmount}
                          discountedAmount={discountedAmount}
                          clearDiscount={() => {
                            setValue("coupon", "");
                            setDiscountDetails(null);
                          }}
                        />
                      )
                    )}
                  </Flex>
                  {/* Discount Code Ends */}

                  <>
                    {discountedAmount !== 0 && (
                      <Text variant={"small600"} mt={8} mb={4}>
                        Select Payment Method
                      </Text>
                    )}

                    <TransactionBox
                      appointmentData={{
                        ...getValues(),
                        coupon: discountDetails ? getValues("coupon") : "",
                        discounted_amount: discountAmount ?? "",
                        availabilities: selectedAvailability,
                        total_amount_paid: discountedAmount,
                        //  ||
                        // (doctorInfo?.schedule_rate
                        //   ? +doctorInfo?.schedule_rate
                        //   : 0) * selectedAvailability.length,
                        symptoms: getValues()?.symptoms.map(
                          ({ value }) => +value
                        ),
                        old_report_file: getValues()?.old_report_file?.[0],
                        doctor: doctorInfo?.id as number,
                      }}
                      discountAmount={discountedAmount}
                      doctorInfo={doctorInfo as IDoctorListById}
                    />
                  </>
                </>
              </WrapperBox>
            </>
          )}
        </form>
      ) : (
        // INITIAL STATE WHEN NO DOCTOR IS SELECTED
        <WrapperBox
          backgroundColor={colors.white}
          border={`2px solid ${colors.gray_border}`}
          style={{
            px: 4,
            py: 48,
            minHeight: "647px",
            width: { base: "auto" },
          }}
          borderRadius={"3px"}
        >
          <VStack
            justifyContent={"center"}
            alignContent={"center"}
            // width={"544px"}
            // height={"700px"}
            // mt={30}
          >
            {isFetching ? (
              <Spinner />
            ) : (
              <>
                <NoDataIcon width={"full"} />
                <Text fontWeight={700} fontSize={"md"} color={colors.red_700}>
                  There are no details here.
                </Text>
                <Text fontWeight={400} fontSize={"xs"} textAlign="center">
                  Please Click on the doctor list to view detail doctor &apos;s
                  profile.
                </Text>
              </>
            )}
          </VStack>
        </WrapperBox>
      )}
    </Box>
  );
};

export default DoctorDetails;

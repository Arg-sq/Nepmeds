import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import SectionHeading from "@nepMeds/components/Patient/DoctorConsultation/SectionHeading";
import WrapperBox from "@nepMeds/components/Patient/DoctorConsultation/WrapperBox";
import DoctorListCard, {
  Size,
} from "@nepMeds/components/Patient/DoctorList/DoctorListCard";
import { colors } from "@nepMeds/theme/colors";
import DoctorListFilter from "@nepMeds/pages/Patient/DoctorList/Section/Filter";
import PatientFooter from "@nepMeds/pages/Patient/Section/Footer";
import Header from "@nepMeds/pages/Patient/Section/Header";
import {
  useGetDoctorList,
  useGetDoctorListById,
} from "@nepMeds/service/nepmeds-patient-doctorList";
import Pagination from "@nepMeds/components/Pagination";
import { useState, useRef } from "react";
import { BreadCrumb } from "@nepMeds/components/Breadcrumb";
import { NAVIGATION_ROUTES } from "@nepMeds/routes/routes.constant";
import DoctorDetailsSection from "@nepMeds/pages/Patient/DoctorList/Section/DoctorDetails";
import { useDebounce } from "@nepMeds/hooks/useDebounce";
import { useGetAvailability } from "@nepMeds/service/nepmeds-patient-doctor-availability";
import { useLocation } from "react-router-dom";
import DoctorCardSkeleton from "@nepMeds/components/Patient/DoctorList/Skeleton";
import { formatDateToString } from "@nepMeds/utils/TimeConverter/timeConverter";
import NoData from "@nepMeds/components/NoData";
import { scrollToTop } from "@nepMeds/utils/scrollToTop";
const currentDate = formatDateToString(new Date());

const DoctorList = () => {
  const { state }: { state: any } = useLocation();

  const [doctorId, setDoctorId] = useState(0);
  const [targetDate, setTargeDate] = useState(currentDate);
  const [gender, setGender] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState<string[]>(
    state?.specialization ? [state.specialization] : []
  );
  const [symptom, setSymptom] = useState<string[]>(
    state?.symptom ? [state.symptom] : []
  );
  const [search, setSearchValue] = useState("");
  const [dateParams, setDateParams] = useState({
    from_date: "",
    to_date: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  // PAGINATION
  const [pageParams, setPageParams] = useState({
    page: 1,
    limit: 5,
  });
  // PAGINATION ENDS

  const pageChange = (page: number) => {
    scrollToTop();
    setPageParams({ ...pageParams, page });
  };

  const debouncedInputValue = useDebounce(search, 500);

  // REACT QUERIES
  const {
    data: doctorData,
    isLoading,
    error: DoctorListError,
  } = useGetDoctorList({
    page_size: pageParams.limit,
    page: pageParams.page,
    gender: gender?.join(","),
    specialization: specialization?.join(","),
    symptom: symptom?.join(","),
    search: debouncedInputValue,
    from_date: dateParams.from_date,
    to_date: dateParams.to_date,
  });

  const { data: doctorInfo, isFetching } = useGetDoctorListById({
    id: doctorId,
    target_date: targetDate || currentDate,
  });
  const { data: availability, isFetching: isAvailabilityFetching } =
    useGetAvailability({
      id: doctorId,
      target_date: targetDate || currentDate,
    });
  // REACT QUERIES END

  return (
    <>
      <Header onClick={onOpen} btnRef={btnRef} />
      <WrapperBox backgroundColor={colors.background_blue}>
        <>
          {/* TODO: design discussion with UI for breadcrumb in mobile */}
          <Box display={{ base: "block" }}>
            <BreadCrumb
              items={[
                {
                  name: "Doctor Consultation",
                  route: `${NAVIGATION_ROUTES.DOCTOR_CONSULTATION}`,
                },
                {
                  name: "Doctor Lists",
                  route: `${NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE}`,
                },
              ]}
              title={{
                name: "Home",
                route: `${NAVIGATION_ROUTES.DOCTOR_CONSULTATION}`,
              }}
            />
          </Box>
          <SectionHeading
            heading="Doctors List"
            description="Book Appointment with top doctors across various specialty"
          />

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(5, 1fr)",
              lg: "repeat(12, 1fr)",
              "2xl": "repeat(11, 1fr)",
            }}
            columnGap={{ base: 2, md: 8, lg: 4, xl: 10, "2xl": "85px" }}
          >
            {/* FILTER */}
            <GridItem
              colSpan={{ base: 3, md: 2, lg: 3, "2xl": 3 }}
              display={{ base: "none", md: "grid" }}
            >
              <DoctorListFilter
                setGender={setGender}
                setSpecialization={setSpecialization}
                setSymptom={setSymptom}
                setSearchValue={setSearchValue}
                setDateParams={setDateParams}
                dateParams={dateParams}
                setPageParams={setPageParams}
                pageParams={pageParams}
              />
            </GridItem>

            {/* Doctor card */}
            <GridItem colSpan={{ base: 1, md: 3, lg: 5, "2xl": 4 }}>
              <Box>
                <>
                  {isLoading &&
                    Array.from({ length: 5 }, (_, index) => (
                      <DoctorCardSkeleton key={index} />
                    ))}

                  {doctorData && !doctorData?.results.length && (
                    <Flex width="673px" height="215px" alignItems={"center"}>
                      <NoData />
                    </Flex>
                  )}
                  {DoctorListError && (
                    <Box width="673px" height="215px">
                      Oops something went wrong!!
                    </Box>
                  )}
                  {doctorData &&
                    doctorData?.results.map(doctorData => {
                      return (
                        <Box key={doctorData.id} mb={6}>
                          <DoctorListCard
                            data={doctorData}
                            size={Size.lg}
                            setDoctorId={setDoctorId}
                            doctorId={doctorId}
                          />
                        </Box>
                      );
                    })}
                  {doctorData && doctorData.count > 5 && (
                    // TODO: discuss with UI for pagination in mobile view
                    <Box display={{ base: "block" }}>
                      <Pagination
                        enabled={true}
                        queryPageSize={pageParams.limit}
                        queryPageIndex={pageParams.page}
                        pageChange={pageChange}
                        totalCount={doctorData?.count ?? 0}
                      />
                    </Box>
                  )}
                </>
              </Box>
            </GridItem>
            {/* Doctor card ends */}

            {/* Doctor details section */}
            <GridItem
              colSpan={{ base: 1, lg: 4 }}
              display={{ base: "none", lg: "grid" }}
            >
              <DoctorDetailsSection
                doctorInfo={doctorInfo}
                availability={availability}
                isAvailabilityFetching={isAvailabilityFetching}
                isFetching={isFetching}
                setTargeDate={setTargeDate}
              />
            </GridItem>
            {/* Doctor detail section ends */}
          </Grid>
        </>
      </WrapperBox>
      <PatientFooter />

      {/* TODO: check if drawer can be made a different component */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter</DrawerHeader>
          <DrawerBody overflowY={"auto"}>
            <DoctorListFilter
              setGender={setGender}
              setSpecialization={setSpecialization}
              setSymptom={setSymptom}
              setSearchValue={setSearchValue}
              setDateParams={setDateParams}
              dateParams={dateParams}
              setPageParams={setPageParams}
              pageParams={pageParams}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DoctorList;

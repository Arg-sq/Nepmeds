import Card from "@nepMeds/components/Patient/DoctorConsultation/Card";
import SectionHeading from "@nepMeds/components/Patient/DoctorConsultation/SectionHeading";
import HeroSection from "@nepMeds/components/Patient/DoctorConsultation/HeroSection";
import WrapperBox from "@nepMeds/components/Patient/DoctorConsultation/WrapperBox";
import {
  Symptom,
  useSpecializationRegisterData,
} from "@nepMeds/service/nepmeds-specialization";
import heroSectionBg from "@nepMeds/assets/images/heroSectionBg.png";
import advertisement1 from "@nepMeds/assets/images/advertisement1.png";
import { Box, Flex, Image } from "@chakra-ui/react";
import PatientFooter from "../Section/Footer";
import { useGetSymptoms } from "@nepMeds/service/nepmeds-symptoms";
import Header from "@nepMeds/pages/Patient/Section/Header";
import DoctorListCard, {
  Size,
} from "@nepMeds/components/Patient/DoctorList/DoctorListCard";
import { useGetDoctorListUnpaginated } from "@nepMeds/service/nepmeds-patient-doctorList";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@nepMeds/routes/routes.constant";
import { AxiosError } from "axios";
import { colors } from "@nepMeds/theme/colors";
import ChooseUsSection from "./Section/ChooseUs";
import ConsultationStepSection from "./Section/CosultationStep";
import Carousel from "react-multi-carousel";
import { useAuthenticatePatient } from "@nepMeds/service/nepmeds-patient-login";
import { useEffect } from "react";
import TokenService from "@nepMeds/service/service-token";
import AdvertisementBanner from "@nepMeds/pages/Patient/DoctorConsultation/Section/Advertisement";
import {
  responsive,
  responsiveDoctorCard,
} from "@nepMeds/pages/Patient/DoctorConsultation/carouselBreakpoint";
import { scrollToTop } from "@nepMeds/utils/scrollToTop";

export enum Type {
  SPECIALIST,
  SYMPTOM,
  DOCTOR,
}

const DoctorConsultation = () => {
  // REACT QUERIES
  const {
    data: specializationData = [],
    isLoading: SpecializationDataLoading,
    error: specializationDataError,
  } = useSpecializationRegisterData();

  const {
    data: symptomData = [],
    isLoading: symptomDataLoading,
    error: symptomDataError,
  } = useGetSymptoms();

  const { data: doctorList, error: doctorListError } =
    useGetDoctorListUnpaginated();

  const { mutateAsync: authenticatePatient } = useAuthenticatePatient();
  // REACT QUERIES END

  const location = useLocation();
  const authenticate = async () => {
    try {
      if (location.search) {
        const response = await authenticatePatient({
          patientToken: location.search.replace("?key=", ""),
        });
        TokenService.setToken({
          access: response?.data?.data?.[0]?.access,
          refresh: TokenService?.getToken()?.refresh || "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const navigate = useNavigate();

  const handleViewSpecialists = (specialization: string) => {
    navigate(NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE, {
      state: {
        specialization,
      },
    });
    scrollToTop();
  };

  const handleViewSymptom = (symptom: string) => {
    navigate(NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE, {
      state: {
        symptom,
      },
    });
    scrollToTop();
  };

  return (
    <>
      <Header />
      <WrapperBox backgroundImage={`url(${heroSectionBg})`}>
        <HeroSection />
      </WrapperBox>
      <WrapperBox backgroundColor={colors.background_blue}>
        <>
          {/* Specialist Doctors SECTION*/}
          <SectionHeading
            heading={"Our Specialist Doctors"}
            description={"Consult with top doctors across specialties"}
            btnText={"View All Specialists"}
            onClick={() =>
              navigate(NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE)
            }
          />

          <Box my={7.5}>
            <Carousel responsive={responsive}>
              {specializationData?.map(specialization => {
                return (
                  <Box
                    key={specialization.id}
                    onClick={() => handleViewSpecialists(specialization.name)}
                  >
                    <Card
                      name={specialization.name}
                      image={specialization.image}
                      description={
                        specialization?.symptom_list?.slice(0, 5) as Symptom[]
                      }
                      isLoading={SpecializationDataLoading}
                      error={specializationDataError as AxiosError}
                    />
                  </Box>
                );
              })}
            </Carousel>
          </Box>
          {/* Specialist Doctors SECTION ENDS*/}

          {/* Health Concern / Symptoms SECTION */}
          <SectionHeading
            heading={"Common Health Concern"}
            description="Consult a doctor online for any health issue"
            btnText={"View All Symptoms"}
            onClick={() =>
              navigate(NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE)
            }
          />

          <Box my={7.5}>
            <Carousel responsive={responsive}>
              {symptomData?.map(symptom => {
                return (
                  <Box
                    key={symptom.id}
                    onClick={() => handleViewSymptom(symptom.name)}
                  >
                    <Card
                      name={symptom.name}
                      image={symptom.image}
                      description={symptom.description
                        .split(",")
                        .slice(0, 4)
                        .join()}
                      isLoading={symptomDataLoading}
                      error={symptomDataError as AxiosError}
                    />
                  </Box>
                );
              })}
            </Carousel>
          </Box>
          {/* Health Concern / Symptoms SECTION ENDS */}

          {/* ADVERTISEMENT SECTION */}
          <Box my={{ base: 5, md: 10 }}>
            <Image
              width="100%"
              src={advertisement1}
              alt="advertisement"
              objectFit="contain"
            />
          </Box>
          {/* ADVERTISEMENT SECTION ENDS*/}

          {/* Doctors SECTION */}

          <SectionHeading
            heading={"Our Doctors"}
            description="We hire best specialists to deliver top-notch services for you"
            btnText="View All Doctors"
            onClick={() =>
              navigate(NAVIGATION_ROUTES.DOCTOR_LIST_PATIENT_MODULE)
            }
          />

          {(doctorListError as AxiosError)?.response?.status === 500 ? (
            <Flex width={"255px"} height={"282px"} alignItems={"center"}>
              Oops something went wrong!!
            </Flex>
          ) : (
            doctorList && (
              <Carousel responsive={responsiveDoctorCard}>
                {doctorList.map(doctor => {
                  return (
                    <Box
                      key={doctor.id}
                      mr={4}
                      onClick={() =>
                        navigate(
                          `${NAVIGATION_ROUTES.DOCTOR_DETAILS}/${doctor.id}`
                        )
                      }
                    >
                      <DoctorListCard
                        data={doctor}
                        error={doctorListError as AxiosError}
                        size={Size.sm}
                      />
                    </Box>
                  );
                })}
              </Carousel>
            )
          )}

          {/* DOCTOR CONSULTATION WORKING STEPS */}
          <Box mt={10}>
            <ConsultationStepSection />
          </Box>
          {/* DOCTOR CONSULTATION WORKING STEPS ENDS */}
        </>
      </WrapperBox>

      {/* ADVERTISEMENT SECTION */}
      <AdvertisementBanner />
      {/* ADVERTISEMENT SECTION ENDS*/}

      {/* WHY CHOOSE US SECTION */}
      <WrapperBox backgroundColor={colors.background_blue}>
        <ChooseUsSection />
      </WrapperBox>
      {/* WHY CHOOSE US SECTION ENDS*/}

      {/* FOOTER SECTION */}
      <Box bg={colors.background_blue}>
        <PatientFooter />
      </Box>
      {/* FOOTER SECTION ENDS*/}
    </>
  );
};

export default DoctorConsultation;

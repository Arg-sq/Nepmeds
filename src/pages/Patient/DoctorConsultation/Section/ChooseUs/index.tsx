import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";
import Header from "@nepMeds/components/Patient/DoctorConsultation/Header";
import WrapperBox from "@nepMeds/components/Patient/DoctorConsultation/WrapperBox";
import { colors } from "@nepMeds/theme/colors";
import { WhyChooseUs } from "@nepMeds/utils/Patient/DummyData";

const ChooseUsSection = () => {
  return (
    <WrapperBox>
      <>
        <Header heading="Why Choose Us?" />
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {WhyChooseUs.map(WhyChooseUsStep => {
            return (
              <GridItem width={"372px"} key={WhyChooseUsStep.id}>
                <Flex gap={8}>
                  {WhyChooseUsStep.image}
                  <Flex direction={"column"}>
                    <Text
                      fontWeight={700}
                      fontSize={"22px"}
                      color={colors.dark_blue}
                    >
                      {WhyChooseUsStep.title}
                    </Text>
                    <Text fontWeight={400} fontSize={"18px"}>
                      {WhyChooseUsStep.description}
                    </Text>
                  </Flex>
                </Flex>
              </GridItem>
            );
          })}
        </Grid>
      </>
    </WrapperBox>
  );
};

export default ChooseUsSection;

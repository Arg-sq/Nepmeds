import { Text, Heading, Image, Flex } from "@chakra-ui/react";
import { colors } from "@nepMeds/theme/colors";

const Wrapper = ({ children, title, subtitle }: IWrapper) => {
  return (
    <Flex
      background={colors.white}
      borderRadius="12px"
      alignItems="center"
      justifyContent="center"
      direction="column"
      w="30%"
      margin="0 auto"
      p={8}
      gap={8}
    >
      <Image src="../src/assets/images/logo1.png" width="60px" />
      <Heading as="h6" fontSize="1.4em" fontFamily="Poppins" fontWeight={500}>
        {title}
      </Heading>
      <Text fontSize="sm" color={colors.black_30}>
        {subtitle}
      </Text>
      {children}
    </Flex>
  );
};

interface IWrapper {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
export default Wrapper;

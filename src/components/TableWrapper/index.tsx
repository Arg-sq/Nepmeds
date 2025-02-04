import { Box } from "@chakra-ui/react";
import { colors } from "@nepMeds/theme/colors";
import { ReactNode } from "react";

const TableWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      margin="5"
      borderRadius="12px"
      py="4"
      px={{ base: "2", md: "3", lg: "9" }}
      bgColor={colors.white}
    >
      {children}
    </Box>
  );
};

export default TableWrapper;

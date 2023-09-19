import { Box } from "@chakra-ui/layout";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { colors } from "@nepMeds/theme/colors";

interface IWrapperBox {
  children?: ReactJSXElement;
  backgroundColor?: string;
  backgroundImage?: string;
  height?: string;
  padding?: string;
  width?: string;
  borderColor?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  px?: string;
  style?: Record<string, any>;
}
const WrapperBox: React.FC<IWrapperBox> = ({
  children,
  backgroundColor = colors.white,
  backgroundImage = "none",
  height = "auto",
  padding = "4",
  width = "auto",
  border = "none",
  boxShadow = "none",
  style,
}) => {
  return (
    <Box
      height={height}
      bg={backgroundColor}
      fontFamily={"Quicksand"}
      backgroundImage={backgroundImage}
      p={padding}
      px={{ base: "10px", md: "15", xl: "15", "2xl": "30" }}
      width={width}
      border={border}
      boxShadow={boxShadow}
      sx={style}
    >
      {children}
    </Box>
  );
};

export default WrapperBox;

import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { colors } from "@nepMeds/theme/colors";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

const FloatingLabelInput = ({
  label,
  helperText,
  name,
  error = "",
  rules,
  register,
  isDisabled,
  labelDisabled,
  isRequired,
  type,
  startIcon,
  endIcons,
  onIconClick,
  required,
  variant = "floating",
  ...rest
}: IInput) => {
  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      variant="floating"
    >
      {startIcon ? (
        <InputLeftElement top="12%" pointerEvents="none" onClick={onIconClick}>
          {startIcon}
        </InputLeftElement>
      ) : (
        ""
      )}
      {endIcons ? (
        <InputRightElement onClick={onIconClick} top="8%">
          {endIcons}
        </InputRightElement>
      ) : (
        ""
      )}
      <ChakraInput
        id={name}
        type={type}
        {...register(name, rules)}
        {...rest}
        placeholder=""
        h={14}
        pt={4}
        pr={8}
        pb={2}
        variant="floating"
      />

      {label && (
        <FormLabel htmlFor={name} fontWeight={400} fontSize={"14px"}>
          {label}
          {required && <span style={{ color: colors.error }}>&nbsp;*</span>}
        </FormLabel>
      )}
      {labelDisabled && (
        <FormLabel
          htmlFor={name}
          fontWeight={400}
          fontSize={"14px"}
          opacity={"1 !important"}
        >
          {labelDisabled}
        </FormLabel>
      )}

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
export interface IInput extends InputProps {
  label?: string;
  helperText?: string;
  error?: string;
  name: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  isRequired?: boolean;
  isDisabled?: boolean;
  startIcon?: React.ReactNode;
  endIcons?: React.ReactNode;
  onIconClick?: () => void;
  required?: boolean;
  labelDisabled?: string;
  variant?: string;
}
export default FloatingLabelInput;

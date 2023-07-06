import { Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@nepMeds/components/Form/Input";
import { toastFail, toastSuccess } from "@nepMeds/components/Toast";
import OtpSignUp from "@nepMeds/pages/SignUp/OtpSignup";
import { useSignUpUser } from "@nepMeds/service/nepmeds-register";
import { colors } from "@nepMeds/theme/colors";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Call } from "react-iconly";
import { Link } from "react-router-dom";
import * as yup from "yup";
const phoneRegExp = /^(?:\+977[-\s]?)?9[78]\d{8}$/;

const emailRegExp = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

const schema = yup.object().shape({
  email_or_mobile_number: yup
    .string()
    .required("Mobile number or email is required!")
    .test(
      "is-email-or-phone",
      "Please enter a valid email or phone number",
      value => {
        const emailRegex = emailRegExp;
        const phoneRegex = phoneRegExp;
        return (
          value !== undefined &&
          (emailRegex.test(value) || phoneRegex.test(value))
        );
      }
    ),
});

const SignupForm = () => {
  const [, setOTP] = useState("");
  const [enableOTP, setEnableOTP] = useState(false);
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email_or_mobile_number: "",
    },
    resolver: yupResolver(schema),
  });

  const singUpAction = useSignUpUser();

  const onSubmit = async ({
    email_or_mobile_number,
  }: {
    email_or_mobile_number: string;
  }) => {
    try {
      const { data: otpInfo } = await singUpAction.mutateAsync({
        email_or_mobile_number: email_or_mobile_number,
      });
      setEnableOTP(true);
      setOTP(typeof otpInfo.data === "string" ? otpInfo.data : "");
      toastSuccess("OTP code has been sent to your mobile!");
    } catch (error) {
      const err = error as AxiosError<{ errors: [0] }>;

      const errorObject = err?.response?.data?.errors?.[0];
      const firstErrorMessage = errorObject
        ? Object.values(errorObject)[0]
        : null;
      toastFail(firstErrorMessage?.toString() || "Failed to send OTP!");
    }
  };

  if (enableOTP) {
    return <OtpSignUp mobile={getValues("email_or_mobile_number")} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack gap={7.5} mb={12}>
        <Input
          name="email_or_mobile_number"
          register={register}
          startIcon={<Icon as={Call} fontSize={20} color={colors.black_40} />}
          border="none"
          backgroundColor={colors.forminput}
          placeholder="Email Address/ Mobile No."
          _placeholder={{ color: colors.light_gray }}
          error={errors.email_or_mobile_number?.message}
        />
      </VStack>

      <Text textAlign="center" fontSize={14} color={colors.black_30}>
        Already have an account?
        <Link
          to="/"
          style={{
            color: colors.blue_100,
            marginLeft: "5px",
          }}
        >
          Login
        </Link>
      </Text>

      <HStack mt={12} justifyContent="center">
        <Button
          backgroundColor={colors.primary}
          textColor={colors.white}
          type="submit"
          variant="register"
          isLoading={singUpAction.isLoading}
        >
          Sign Up
        </Button>
      </HStack>
    </form>
  );
};

export default SignupForm;

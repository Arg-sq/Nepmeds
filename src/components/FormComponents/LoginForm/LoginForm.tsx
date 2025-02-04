import { Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@nepMeds/components/Form/Input";
import { useLoginMutation } from "@nepMeds/service/nepmeds-auth";
import { colors } from "@nepMeds/theme/colors";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Hide, Lock, Message, Show } from "react-iconly";
import { Link } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().required("Email Address/ Mobile No. is required!"),
  password: yup.string().required("Password is required!"),
});

const LoginForm = () => {
  const loginAction = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const togglepasswordView = () => {
    setShowPassword(!showPassword);
  };

  const pattern = /^(?:\+977[-\s]?)?9[78]\d{8}$/;

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async ({
    email,
    password,
  }) => {
    if (pattern.test(email)) {
      loginAction.mutate({ mobile_number: email, password: password });
    } else loginAction.mutate({ email: email, password: password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={7} mb={3}>
        <Input
          alignItems={"center"}
          name="email"
          register={register}
          startIcon={
            <Icon as={Message} fontSize={20} color={colors.black_40} />
          }
          border="none"
          backgroundColor={colors.forminput}
          placeholder="Email Address/ Mobile No."
          _placeholder={{ color: colors.light_gray }}
          error={errors.email?.message}
        />
        <Input
          name="password"
          register={register}
          type={showPassword ? "text" : "password"}
          startIcon={<Icon as={Lock} fontSize={20} color={colors.black_40} />}
          endIcons={
            <Icon
              as={showPassword ? Show : Hide}
              fontSize={20}
              onClick={togglepasswordView}
              cursor="pointer"
            />
          }
          backgroundColor={colors.forminput}
          border="none"
          placeholder="Password"
          _placeholder={{ color: colors.light_gray }}
          error={errors.password?.message}
        />
      </VStack>

      <Link
        to="/forgot-password"
        style={{
          color: colors.blue_100,
          display: "block",
          textAlign: "right",
          marginBottom: "48px",
          fontSize: "14px",
        }}
      >
        Forgot Password
      </Link>

      <HStack mt={10} justifyContent="center">
        <Button
          type="submit"
          isLoading={loginAction.isLoading}
          width="180px"
          fontSize={"xl"}
        >
          Login
        </Button>
      </HStack>
      <Text textAlign="center" mt={10} fontSize={14} color={colors.black_30}>
        Don’t have an account?
        <Link
          to="/signup"
          style={{
            color: colors.blue_100,
            marginLeft: "5px",
          }}
        >
          Sign Up
        </Link>
      </Text>
    </form>
  );
};

export default LoginForm;

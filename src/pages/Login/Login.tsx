import LayoutContainer from "@nepMeds/components/Container";
import LoginForm from "@nepMeds/components/FormComponents/LoginForm/LoginForm";
import Header from "@nepMeds/components/Header/Header";
import Wrapper from "@nepMeds/components/Wrapper/Wrapper";

const Login = () => {
  return (
    <LayoutContainer>
      <Header />
      <Wrapper title="Welcome back!" subtitle="Login to your account">
        <LoginForm />
      </Wrapper>
    </LayoutContainer>
  );
};

export default Login;

import { BasicInfoForm } from "@nepMeds/components/FormComponents";
import Wrapper from "./Wrapper";

const BasicInfo = () => {
  return (
    <Wrapper
      title="Registration"
      subtitle="Please enter your details for registration."
    >
      <BasicInfoForm hidePasswordField={false} />
    </Wrapper>
  );
};

export default BasicInfo;

import styled from "@emotion/styled";
import React from "react";
import AuthForm from "../Common/AuthForm";

const RegisterSection = () => {
  const handleRegister = (login: string, password: string) => {
    console.log({
      name: login,
      password,
    });
  };
  return (
    <StyledContainer>
      <h1>Register account</h1>
      <AuthForm onClick={handleRegister} text="Register" />
    </StyledContainer>
  );
};

const StyledContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default RegisterSection;

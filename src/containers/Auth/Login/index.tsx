import styled from "@emotion/styled";
import React from "react";
import AuthForm from "../Common/AuthForm";
import { signIn } from "next-auth/react";

const LoginSection = () => {
  const handleLogin = (login: string, password: string) => {
    signIn("credentials", {
      username: login,
      password,
    });
  };
  return (
    <StyledContainer>
      <h1>Log in</h1>
      <AuthForm onClick={handleLogin} />
    </StyledContainer>
  );
};

const StyledContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default LoginSection;

import styled from "@emotion/styled";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import AuthForm from "../Common/AuthForm";

const RegisterSection = () => {
  const router = useRouter();
  const handleRegister = (login: string, password: string) => {
    axios.post("/api/users/register", { username: login, password }).then(() => {
      router.push("/");
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

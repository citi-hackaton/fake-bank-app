import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import IntroductionSection from "./IntroductionSection";
import UserBankAccount from "./UserBankAccount";

const Home = () => {
  const { data: user } = useSession();
  return (
    <StyledContainer>
      <StyledWrapper>
        <Typography variant="h4" fontWeight={700}>
          {user ? "Your bank account details" : "Welcome to the bank"}
        </Typography>
        {user ? <UserBankAccount /> : <IntroductionSection />}
      </StyledWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled("main")`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const StyledWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px,
    rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  background-color: #fff;
  padding: 20px;
`;

export default Home;

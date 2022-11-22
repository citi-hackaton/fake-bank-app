import React from "react";
import useGetUserBankDetails from "@/hooks/useGetUserBankDetails";
import styled from "@emotion/styled";
import UserProfile from "./UserProfile";
import TransactionHistory from "./TransactionHistory";

const UserBankAccount = () => {
  const data = useGetUserBankDetails();
  if (!data) return null;
  return (
    <StyledWrapper>
      <UserProfile />
      <TransactionHistory />
    </StyledWrapper>
  );
};

const StyledWrapper = styled("div")`
  width: 100%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

export default UserBankAccount;

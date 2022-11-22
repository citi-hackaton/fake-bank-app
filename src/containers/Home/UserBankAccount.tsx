import React from "react";
import useGetUserBankDetails from "@/hooks/useGetUserBankDetails";

const UserBankAccount = () => {
  const data = useGetUserBankDetails();
  if (!data) return null;
  return <main></main>;
};

export default UserBankAccount;

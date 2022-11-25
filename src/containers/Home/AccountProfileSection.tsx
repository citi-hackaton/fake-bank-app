import styled from "@emotion/styled";
import { Avatar, Typography } from "@mui/material";
import { avatarName } from "@/utils/avatarName";
import { useSession } from "next-auth/react";
import useGetUserBankDetails from "@/hooks/useGetUserBankDetails";
import { deepOrange } from "@mui/material/colors";

const AccountProfileSection = () => {
  const { data: user } = useSession();
  const userData = useGetUserBankDetails();
  if (!user?.user || !userData) return null;

  return (
    <AccountProfile>
      <AccountHeader>
        <Avatar alt="avatar" sx={{ bgcolor: deepOrange[500], height: "30px", width: "30px" }}>
          {avatarName(userData.name ?? "")}
        </Avatar>
        <Typography variant="h6">{user.user.name}</Typography>
      </AccountHeader>
      <AccountBalance>
        <Typography variant="h6" component="span">
          Your balance:
        </Typography>
        <Typography
          variant="h6"
          fontWeight={700}
          color="#4caf50
              ">
          {userData.balance} $
        </Typography>
      </AccountBalance>
    </AccountProfile>
  );
};

const AccountProfile = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AccountHeader = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const AccountBalance = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 6px;
`;

export default AccountProfileSection;

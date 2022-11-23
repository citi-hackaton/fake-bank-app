import styled from "@emotion/styled";
import { Avatar, Button, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useSession } from "next-auth/react";
import useGetUserBankDetails from "@/hooks/useGetUserBankDetails";
import { avatarName } from "@/utils/avatarName";
import { deepOrange } from "@mui/material/colors";
import { useState } from "react";
import QRScannerModal from "./QRScannerModal";

const UserProfile = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isScanError, setIsScanError] = useState(false);

  const { data: user } = useSession();
  const userData = useGetUserBankDetails();

  const handleModalOpen = () => {
    setIsModalOpened(true);
  };

  if (!user?.user || !userData) return null;

  return (
    <StyledWrapper>
      <QRScannerModal
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
        setIsScanError={setIsScanError}
        isScanError={isScanError}
      />
      <StyledTitle>
        <Typography variant="h5" fontWeight={700} color="text.secondary">
          User actions
        </Typography>
        <PersonIcon />
      </StyledTitle>
      <StyledContainer>
        <AccountCard>
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
          <AccountActions>
            <Button variant="contained" color="primary" size="small" onClick={handleModalOpen}>
              Scan QR code
            </Button>
          </AccountActions>
        </AccountCard>
      </StyledContainer>
    </StyledWrapper>
  );
};

const StyledWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const StyledTitle = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledContainer = styled("div")`
  width: 100%;
  height: 100%;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const AccountProfile = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AccountCard = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
  padding: 20px;
  box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px,
    rgb(0 0 0 / 12%) 0px 1px 3px 0px;
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

const AccountActions = styled("div")`
  display: flex;
  justify-content: center;
`;

export default UserProfile;

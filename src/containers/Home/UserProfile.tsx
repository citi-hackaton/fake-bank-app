import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import QRScannerModal from "./QRScannerModal";
import AccountProfileSection from "./AccountProfileSection";

const UserProfile = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpened(true);
  };

  return (
    <StyledWrapper>
      <QRScannerModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} />
      <StyledTitle>
        <Typography variant="h5" fontWeight={700} color="text.secondary">
          User actions
        </Typography>
        <PersonIcon />
      </StyledTitle>
      <StyledContainer>
        <AccountCard>
          <AccountProfileSection />
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

const AccountCard = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
  padding: 20px;
  box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px,
    rgb(0 0 0 / 12%) 0px 1px 3px 0px;
`;

const AccountActions = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export default UserProfile;

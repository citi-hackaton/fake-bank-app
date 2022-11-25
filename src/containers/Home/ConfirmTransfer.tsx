import InternalInitializationRequestResponse from "@/types/InternalInitializationRequestResponse";
import QRPPStatus from "@/types/QRRPStatus";
import styled from "@emotion/styled";
import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

const ConfirmTransfer = ({
  qrResult,
  transactionId,
  setIsModalOpened,
  setQrResult,
}: ConfirmTransferProps) => {
  const { amount, bankAccount, clientName, description } = qrResult.paymentDetails;
  const [progress, setProgress] = useState(120);

  const handleUpdateTransaction = useCallback(
    (status: QRPPStatus.ACCEPTED | QRPPStatus.REJECTED) => {
      axios
        .post("/api/payments/qrUpdate", {
          transactionId,
          newStatus: status,
        })
        .then(() => {
          setProgress(0);
          setIsModalOpened(false);
          setQrResult();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const timer = setInterval(async () => {
      setProgress((oldProgress) => {
        if (oldProgress === 0) {
          handleUpdateTransaction(QRPPStatus.REJECTED);
          clearInterval(timer);
          return 0;
        }
        return oldProgress - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h5">QR Payment transfer</Typography>
      <StyledWireInformation>
        <TextField label="Receiver name" variant="filled" value={clientName} disabled={true} />
        <TextField
          label="Receiver bank account"
          variant="filled"
          value={bankAccount}
          disabled={true}
        />
        <TextField
          label="Payment description"
          variant="filled"
          value={description}
          disabled={true}
        />
        <TextField label="Payment amount" variant="filled" value={amount} disabled={true} />
        <StyledActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpdateTransaction(QRPPStatus.REJECTED)}>
            Cancel QR Transfer
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateTransaction(QRPPStatus.ACCEPTED)}>
            Confirm QR Transfer
          </Button>
        </StyledActions>
        <Typography variant="h6">Time left: {progress} seconds</Typography>
        <StyledProgress variant="determinate" value={Math.round((100 / 120) * progress)} />
      </StyledWireInformation>
    </StyledContainer>
  );
};

const StyledContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
`;

const StyledWireInformation = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const StyledActions = styled("div")`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const StyledProgress = styled(LinearProgress)`
  width: 100%;
  height: 10px;
`;

interface ConfirmTransferProps {
  qrResult: InternalInitializationRequestResponse;
  transactionId: string;
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setQrResult: () => void;
}

export default ConfirmTransfer;

import InternalInitializationRequestResponse from "@/types/InternalInitializationRequestResponse";
import styled from "@emotion/styled";
import { Button, TextField, Typography } from "@mui/material";

const ConfirmTransfer = ({ qrResult }: ConfirmTransferProps) => {
  const { amount, bankAccount, clientName, description } = qrResult.paymentDetails;
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
          <Button variant="contained" color="secondary">
            Cancel QR Transfer
          </Button>
          <Button variant="contained" color="primary">
            Confirm QR Transfer
          </Button>
        </StyledActions>
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

interface ConfirmTransferProps {
  qrResult: InternalInitializationRequestResponse;
}

export default ConfirmTransfer;

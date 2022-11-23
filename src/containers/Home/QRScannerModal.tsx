import styled from "@emotion/styled";
import { Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import QRPPTransactionStatus from "@/types/QRPPTransactionStatus";

interface TransactionBody {
  transactionId: string;
}

const QRScannerModal = ({
  isModalOpened,
  setIsModalOpened,
  setIsScanError,
  isScanError,
}: QRScannerModalProps) => {
  const [result, setResult] = useState<string | null>(null);
  const alreadyScanned = useRef<boolean>(false);

  const handleParseQrResult = (data: string) => {
    try {
      const parsedData: TransactionBody = JSON.parse(data);
      if (!parsedData?.transactionId) {
        throw new Error("Invalid QR code");
      }
      if (alreadyScanned.current) {
        return;
      }
      axios
        .post<QRPPTransactionStatus>("/api/transactions/validate", parsedData)
        .then(({ data }) => {
          if (data.status === "correct") {
            setIsScanError(false);
            setResult("Transaction completed successfully");
            alreadyScanned.current = true;
          }
        });
    } catch (error) {
      setIsScanError(true);
      alreadyScanned.current = false;
    }
  };

  return (
    <Modal open={isModalOpened} onClose={() => setIsModalOpened(false)}>
      <StyledModalContainer>
        <StyledWrapper>
          <Typography id="modal-modal-title" variant="h5">
            Scan QR code
          </Typography>
          <StyledQrReader>
            <QrReader
              onResult={(result) => {
                if (!!result) {
                  handleParseQrResult(result.getText());
                }
              }}
              constraints={{ facingMode: "environment" }}
            />
          </StyledQrReader>
          {isScanError && (
            <Typography color="error" variant="h5">
              Invalid QR code
            </Typography>
          )}
          {result && <Typography variant="h6">Result: {result}</Typography>}
        </StyledWrapper>
      </StyledModalContainer>
    </Modal>
  );
};

const StyledModalContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  background-color: #e7ebf0;
  border-radius: 5px;
  boxshadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px,
    rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  padding: 16px;
`;

const StyledWrapper = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledQrReader = styled("div")`
  width: 70%;
  height: 70%;
`;

interface QRScannerModalProps {
  isModalOpened: boolean;
  isScanError: boolean;
  setIsModalOpened: Dispatch<SetStateAction<boolean>>;
  setIsScanError: Dispatch<SetStateAction<boolean>>;
}

export default QRScannerModal;

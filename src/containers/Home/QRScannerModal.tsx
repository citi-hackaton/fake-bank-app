import styled from "@emotion/styled";
import { Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import { QrReader } from "react-qr-reader";
import InternalInitializationRequestResponse from "@/types/InternalInitializationRequestResponse";
import ConfirmTransfer from "./ConfirmTransfer";

interface TransactionBody {
  transactionId: string;
}

const QRScannerModal = React.memo(({ isModalOpened, setIsModalOpened }: QRScannerModalProps) => {
  const [isScanError, setIsScanError] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<InternalInitializationRequestResponse | null>(null);
  const [alreadyScanned, setAlreadyScanned] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleModalClose = () => {
    setIsModalOpened(false);
    setQrResult(null);
    setAlreadyScanned(false);
    setIsScanError(null);
  };

  const handleParseQrResult = (data: string) => {
    try {
      const parsedData: TransactionBody = JSON.parse(data);
      if (alreadyScanned) {
        return;
      }
      if (!parsedData?.transactionId) {
        throw new Error("Invalid QR code");
      }
      axios
        .post<InternalInitializationRequestResponse>("/api/payments/qrCode", {
          transactionId: parsedData.transactionId,
        })
        .then(({ data }) => {
          setIsScanError(null);
          setQrResult(data);
          setAlreadyScanned(true);
          setTransactionId(parsedData.transactionId);
        })
        .catch(() => {
          setIsScanError("Invalid QR code");
          setQrResult(null);
          setTransactionId(null);
          setAlreadyScanned(false);
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsScanError("Invalid QR code");
      setQrResult(null);
      setTransactionId(null);
      setAlreadyScanned(false);
    }
  };

  return (
    <Modal open={isModalOpened} onClose={handleModalClose}>
      <StyledModalContainer>
        <StyledWrapper>
          {qrResult && transactionId ? (
            <ConfirmTransfer
              qrResult={qrResult}
              transactionId={transactionId}
              setIsModalOpened={setIsModalOpened}
              setQrResult={() => setQrResult(null)}
              setAlreadyScanned={() => setAlreadyScanned(false)}
            />
          ) : (
            <>
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
            </>
          )}
        </StyledWrapper>
      </StyledModalContainer>
    </Modal>
  );
});

QRScannerModal.displayName = "QRScannerModal";

const StyledModalContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  background-color: #e7ebf0;
  border-radius: 5px;
  boxshadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px,
    rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  padding: 16px;
  @media (max-width: 800px) {
    width: 90vw;
  }
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
  setIsModalOpened: Dispatch<SetStateAction<boolean>>;
}

export default QRScannerModal;

import InternalTransactionStatus from "./InternalTransactionStatus";

interface InternalInitializationResponse {
  status: keyof typeof InternalTransactionStatus;
  message?: string;
  internalTransactionId?: string;
}

export default InternalInitializationResponse;

import InternalTransactionStatus from "./InternalTransactionStatus";
import QRTransactionBody from "./QRTransactionBody";

interface ExtendedInternalInitializationBody extends QRTransactionBody {
  internalTransactionId?: string;
}

interface InternalInitializationRequestResponse {
  status: InternalTransactionStatus;
  paymentDetails: ExtendedInternalInitializationBody;
}

export default InternalInitializationRequestResponse;

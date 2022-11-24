import QRPPStatus from "./QRRPStatus";

interface QRTransactionBody {
  amount: number;
  description: string;
  clientId: number;
  clientName: string;
  bankAccount: string;
  address: string;
  status: keyof typeof QRPPStatus;
}

export default QRTransactionBody;

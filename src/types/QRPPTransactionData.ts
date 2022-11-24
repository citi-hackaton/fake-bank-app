import QRPPStatus from "./QRRPStatus";

interface QRPPTransactionData {
  transactionData: {
    amount: number;
    description: string;
    clientId: string;
    clientName: string;
    bankAccount: string;
    address: string;
    status: keyof typeof QRPPStatus;
  };
}

export default QRPPTransactionData;

import styled from "@emotion/styled";
import UserProfile from "./UserProfile";
import TransactionHistory from "./TransactionHistory";

const UserBankAccount = () => (
  <StyledWrapper>
    <UserProfile />
    <TransactionHistory />
  </StyledWrapper>
);

const StyledWrapper = styled("div")`
  width: 100%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 2fr 3fr;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export default UserBankAccount;

import styled from "@emotion/styled";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const AuthForm = ({ onClick, text }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <StyledContainer>
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" onClick={() => onClick(username, password)}>
        {text}
      </Button>
    </StyledContainer>
  );
};

const StyledContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

interface AuthFormProps {
  onClick: (username: string, password: string) => void;
  text: string;
}

export default AuthForm;

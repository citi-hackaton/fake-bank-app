import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const IntroductionSection = () => (
  <div>
    <Link href="/login" passHref>
      <Button variant="outlined">Log in</Button>
    </Link>
  </div>
);

export default IntroductionSection;

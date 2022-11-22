import { GetStaticProps } from "next";
import { signOut } from "next-auth/react";

const LogoutPage = ({ callbackUrl }: LogoutPageProps) => {
  signOut({ callbackUrl });
  <div></div>;
};

interface LogoutPageProps {
  callbackUrl: string;
}

export const getStaticProps = async (_ctx: GetStaticProps) => ({
  props: { callbackUrl: process.env.NEXTAUTH_URL },
});

export default LogoutPage;

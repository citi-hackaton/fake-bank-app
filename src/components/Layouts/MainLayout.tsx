import Head from "next/head";
import React from "react";
import MainNavbar from "../Navbars/MainNavbar";

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Head>
      <title>Citi Bank</title>
      <meta name="description" content="Citi Bank" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <MainNavbar />
    {children}
  </>
);

type MainLayoutProps = {
  children: React.ReactNode;
};

export default MainLayout;

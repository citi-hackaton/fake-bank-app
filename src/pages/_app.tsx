import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@/utils/materialUiTheme";
import createEmotionCache from "@/utils/createEmotionCache";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const clientSideEmotionCache = createEmotionCache();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MyAppProps<T = any> = AppProps<T> & {
  emotionCache?: EmotionCache;
};

export default function MyApp(props: MyAppProps<{ session: Session }>) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

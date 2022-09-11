import React from "react";
import type { NextPage } from "next";
import Head from "next/head";

const MainPage: NextPage<Record<string, unknown>> = ({}) => {
  return (
    <>
      <Head>
        <title>API</title>
      </Head>
      <h1>Server side</h1>
    </>
  );
};

export default MainPage;

import "../styles/bulma.scss";
import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRouter, useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { Navbar } from "../components/General/Navbar";
import {
  ClearUniversalOrganization,
  GetUniversalOrganization,
  SetUniversalOrganization,
} from "../functions/UniversalOrganization";
import { definitions } from "../types/supabase";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

const unsecureRoutes = ["/login", "/signup"];

const checkForRedirect = (router: NextRouter, supabase: SupabaseClient) => {
  if (supabase.auth.user()) {
    // the user is logged in
    if (unsecureRoutes.includes(router.asPath)) {
      router.push("/dash");
    }
  } else if (router.asPath.startsWith("/dash")) {
    ClearUniversalOrganization();
    router.push(`/login?redirect=${window.location.pathname}`);
  }
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_CLIENT_KEY ?? ""
);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();


  supabase.auth.onAuthStateChange(() => {
    checkForRedirect(router, supabase);
  });

  useEffect(() => {
    checkForRedirect(router, supabase);
  }, []);

  if (typeof window === "undefined") return <div>Loading...</div>;
  if (supabase.auth.user()?.id && GetUniversalOrganization() === "") {
    supabase
      .from<definitions["profiles"]>("profiles")
      .select("default_org_id")
      .then(({ data }) => {
        if (data) {
          SetUniversalOrganization(data[0].default_org_id);
          window.location.reload();
        }
      });
  }

  return supabase.auth.user()?.id && !router.asPath.includes("/dash/print") ? (
    <>
      <Head>
        <title>Music Organizer</title>
      </Head>
      <ToastContainer />
      <main style={{ minHeight: "calc(100vh - 150px)" }}>
        <Navbar supabase={supabase} />
        <Component {...pageProps} supabase={supabase} />
      </main>
      <footer className="footer" style={{ height: "50px" }}>
        <div className="content has-text-centered">
          <p>
            <strong>Music Organizer</strong> made with love by{" "}
            <a href="https://dannyzolp.com">Danny Zolp</a> | <a href="https://github.com/DannyZolp/MusicOrganizer">View Source Code</a>
          </p>
        </div>
      </footer>
    </>
  ) : (
    <>
      <Head>
        <title>Music Organizer</title>
      </Head>
      <Component {...pageProps} supabase={supabase} />
    </>
  );
}

export default MyApp;

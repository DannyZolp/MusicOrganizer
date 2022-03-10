import { SupabaseClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import {
  GetUniversalOrganization,
  SetUniversalOrganization,
} from "../../functions/UniversalOrganization";
import { definitions } from "../../types/supabase";
import { PrintModal } from "./Print";
import Link from "next/link";

interface INavbarProps {
  supabase: SupabaseClient;
}

export const Navbar = ({ supabase }: INavbarProps) => {
  const [showPrint, setShowPrint] = useState(false);
  const [organizations, setOrganizations] = useState<
    definitions["organizations"][]
  >([]);

  useEffect(() => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .select("id, name")
      .then(({ data }) => {
        if (data) {
          setOrganizations(data);
        }
      });
  }, []);

  return (
    <>
      {showPrint ? <PrintModal close={() => setShowPrint(false)} /> : null}

      <nav
        className="navbar is-primary"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item title-logo" >
              MusicOrganizer
            </a>
          </Link>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link href="/dash">
              <a className="navbar-item">
                Dashboard
              </a>
            </Link>

            <Link href="/dash/score">
              <a className="navbar-item">
                Scores
              </a>
            </Link>

            <Link href="/dash/group">
              <a className="navbar-item">
                Groups
              </a>
            </Link>

            <Link href="/dash/settings">
              <a className="navbar-item">
                Settings
              </a>
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                {organizations
                  ? organizations.find(
                    (o) => o.id === GetUniversalOrganization()
                  )?.name
                  : "Loading..."}
              </a>
              <div className="navbar-dropdown">
                <Link href="/dash/organization">
                  <a className="navbar-item">
                    Manage
                  </a>
                </Link>
                <hr className="navbar-divider" />
                {organizations ? (
                  organizations.map((o, idx) => (
                    <a
                      className="navbar-item"
                      onClick={() => {
                        SetUniversalOrganization(o.id);
                        window.location.reload();
                      }}
                      key={idx}
                    >
                      {o.name}
                    </a>
                  ))
                ) : (
                  <a className="navbar-item">Loading...</a>
                )}
              </div>
            </div>
            <div className="navbar-item">
              <div className="buttons">
                <a className="button" onClick={() => supabase.auth.signOut()}>
                  Logout
                </a>
                <a
                  className="button is-link"
                  onClick={() => setShowPrint(true)}
                >
                  Print
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

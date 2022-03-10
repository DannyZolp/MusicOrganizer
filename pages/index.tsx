import type { NextPage } from "next";
import Image from "next/image";
import React from "react";
import { IPageProps } from "../types/interface/IPageProps";
import Link from "next/link";

const Home = ({ supabase }: IPageProps) => {
  return (
    <>
      <header className="hero is-medium is-primary has-text-centered">
        <div className="hero-body">
          <h1 className="title title-logo is-size-1">Music Organizer</h1>
          <h2 className="subtitle">
            A simple and secure way to manage your music library
          </h2>
          {supabase.auth.user() ? (
            <div className="buttons is-centered">
              <Link href="/dash">
                <a href="button">Go to Dashboard</a>
              </Link>
            </div>
          ) : (
            <div className="buttons is-centered">
              <Link href="/login">
                <a className="button">
                  Login
                </a>
              </Link>
              <Link href="/signup">
                <a className="button is-link">
                  Sign Up for Free
                </a>
              </Link>
            </div>
          )}
        </div>
      </header>
      <section className="section columns">
        <div className="column">
          <h2 className="title is-size-4">Why Music Organizer?</h2>
          <p>
            Compared to some of the other electronic categorization options,
            Music Organizer is a much more usable and secure option to
            traditional methods. Other music management software only stores
            information on one computer, leading to a single point of failure.
          </p>
          <br />
          <p>
            This fact, combined with the problem of the pre-existing options
            being quite outdated, is just asking for trouble. The same issues
            exist with spreadsheets, even without the unmaintainable nature of
            most spreadsheets.{" "}
          </p>
          <br />
          <p>
            <strong>
              Music Organizer on the other hand is all stored in the cloud, with
              built-in redundencies to ensure that your data stays secure. Music
              Organizer also brings more features to the table with an
              incredibly easy to use sharing feature, an easy way to keep track
              of what groups have what music, and a constant log of who had a
              score when.
            </strong>
          </p>
        </div>
        <div className="column">
          <Image src="/scores-page.png" width="1365" height="614" alt="Example scores page" />
        </div>
      </section>
      <section className="section columns">
        <div className="column">
          <Image src="/home-page.png" width="1365" height="614" alt="Example home page" />
        </div>
        <div className="column">
          <h1 className="title is-size-4">Features</h1>
          <h1 className="title is-size-5">
            <ul style={{ listStyleType: "disc" }}>
              <li>Reliable and secure data storage</li>
              <li>Easy to use sharing system for library maintainers</li>
              <li>Simple leasing system for scores</li>
              <li>Structured data (no incomplete scores)</li>
            </ul>
          </h1>
        </div>
      </section>
      <section className="section has-text-centered">
        <h1 className="title">Get started today!</h1>
        <Link href="/signup">
          <a className="button is-primary">
            Sign Up for Free
          </a>
        </Link>
      </section>
    </>
  );
};

export default Home;

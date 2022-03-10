import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { IPageProps } from "../types/interface/IPageProps";

const Signup = ({ supabase }: IPageProps) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(`https://${process.env.NEXT_PUBLIC_URL}/dash/finish-setup`);

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    window.localStorage.setItem(
      "redirectAfterSignup",
      router.asPath.split("?redirect=")[1]
    );
    await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        redirectTo: `https://${process.env.NEXT_PUBLIC_URL}/dash/finish-setup`,
      }
    );
    setSignedUp(true);
    setLoading(false);
  };

  return (
    <main
      className="is-flex is-align-content-center is-justify-content-center"
      style={{ height: "100vh" }}
    >
      <form
        onSubmit={signup}
        className="box is-align-self-center is-justify-self-center"
        style={{ width: "50vw" }}
      >
        {signedUp ? (
          <div className="notification is-success">
            <button
              className="delete"
              onClick={() => setSignedUp(false)}
            ></button>
            Success! Please confirm your email address to complete the signup
            process.
          </div>
        ) : null}
        <h1 className="title">Sign Up</h1>
        <div className="field">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <div className="control">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input"
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              type="submit"
              className={`button is-primary ${loading ? "is-loading" : ""}`}
            >
              Signup
            </button>
          </div>
        </div>
        <a href={`/login?${router.asPath.split("?")[1]}`} className="link">
          Login?
        </a>
      </form>
    </main>
  );
};

export default Signup;

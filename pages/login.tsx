import { useRouter } from "next/dist/client/router";
import { FormEvent, useState } from "react";
import { IPageProps } from "../types/interface/IPageProps";

const Login = ({ supabase }: IPageProps) => {
  const router = useRouter();

  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoggingIn(true);
    supabase.auth
      .signIn({
        email,
        password,
      })
      .then(() => {
        if (router.query.redirect) {
          router.push(router.query.redirect as string);
        }
      });
  };

  return (
    <main
      className="is-flex is-align-content-center is-justify-content-center"
      style={{ height: "100vh" }}
    >
      <form
        onSubmit={login}
        className="box is-align-self-center is-justify-self-center"
        style={{ width: "50vw" }}
      >
        <h1 className="title">Login</h1>
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
              className={`button is-primary ${loggingIn ? "is-loading" : ""}`}
            >
              Login
            </button>
          </div>
        </div>
        <a href={`/signup?${router.asPath.split("?")[1]}`} className="link">Signup?</a>
      </form>
    </main>
  );
};

export default Login;

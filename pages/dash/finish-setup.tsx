import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { FormEvent, useState, useEffect } from "react";
import { IPageProps } from "../../types/interface/IPageProps";
import { definitions } from "../../types/supabase";

const FinishSetup = ({ supabase }: IPageProps) => {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [orgLoc, setOrgLoc] = useState<string>("");
  const [orgDesc, setOrgDesc] = useState<string>("");

  const [joinId, setJoinId] = useState<string>("");
  const [joinName, setJoinName] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleJoin = () => {
    setSubmitting(true);
    axios.post("/api/accept_invite", {
      id: joinId
    }).then(() => {
      supabase
        .from<definitions["profiles"]>("profiles")
        .insert({
          id: supabase.auth.user()?.id,
          name: userName,
          default_org_id: joinId,
          email: supabase.auth.user()?.email,
        })
        .then(() => {
          router.push("/dash");
        });
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    supabase
      .from<definitions["organizations"]>("organizations")
      .insert({
        name: orgName,
        location: orgLoc,
        description: orgDesc,
        owner_id: supabase.auth.user()?.id,
      })
      .then(({ data }) => {
        if (data) {
          supabase
            .from<definitions["memberships"]>("memberships")
            .insert({
              issuer_id: supabase.auth.user()?.id,
              user_id: supabase.auth.user()?.id,
              organization_id: data[0].id,
            })
            .then(() => {
              supabase
                .from<definitions["profiles"]>("profiles")
                .insert({
                  id: supabase.auth.user()?.id,
                  name: userName,
                  default_org_id: data[0].id,
                  email: supabase.auth.user()?.email,
                })
                .then(() => {
                  if ((window.localStorage.getItem("redirectAfterSignup")?.length ?? 0) > 0) {
                    const redirect = window.localStorage.getItem(
                      "redirectAfterSignup"
                    );
                    window.localStorage.removeItem("redirectAfterSignup");
                    router.push(redirect ?? "/dash");
                  } else {
                    router.push("/dash");
                  }
                });
            });
        }
      });
  };

  useEffect(() => {
    if (window.localStorage.getItem("redirectAfterSignup")?.includes("/dash/join")) {
      const id = window.localStorage.getItem("redirectAfterSignup")?.split("/")[3];
      console.log(id);

      supabase.from<definitions["invites"]>("invites").select("*").eq("email", supabase.auth.user()?.email).then(({ data }) => {
        if (data) {
          setJoinId(data[0].id);
          setJoinName(data[0].org_name);
        }
      })
    }
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="title">Complete Signup</h1>
      <h2 className="subtitle">
        A few more details we have to get straight before you can start using
        your account
      </h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <h2 className="subtitle">About You</h2>

        <div className="field">
          <label className="label">
            Display Name <span className="has-text-danger">*</span>
          </label>
          <div className="control">
            <input
              type="input"
              placeholder="This will be your publicly-viewable display name"
              className="input"
              required
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
          </div>
        </div>

        <hr />

        <h2 className="subtitle">About Your Organization</h2>

        {window.localStorage.getItem("redirectAfterSignup")?.includes("/dash/join") ? (
          <>
            <div className="field mb-6">
              <label className="label">Join {joinName}</label>
              <div className="control buttons">
                <button className="button is-primary" type="button" onClick={handleJoin}>Join</button>
                <button className="button" type="button" onClick={() => {
                  window.localStorage.removeItem("redirectAfterSignup")
                  window.location.reload()
                }}>Create my own Organization</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label className="label">
                Name <span className="has-text-danger">*</span>
              </label>
              <div className="control">
                <input
                  type="input"
                  placeholder="Anytown High School - Band Dept."
                  className="input"
                  required
                  onChange={(e) => setOrgName(e.target.value)}
                  value={orgName}
                />
              </div>
            </div >

            <div className="field">
              <label className="label">
                Location <span className="has-text-danger">*</span>
              </label>
              <div className="control">
                <input
                  type="input"
                  placeholder="Anytown, USA"
                  className="input"
                  required
                  onChange={(e) => setOrgLoc(e.target.value)}
                  value={orgLoc}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  placeholder="A small school with a fairly large collection of music"
                  className="textarea"
                  onChange={(e) => setOrgDesc(e.target.value)}
                  value={orgDesc}
                />
              </div>
            </div>

          </>
        )}

        <div className="field">
          <div className="control">
            <button
              className={`button is-primary ${submitting ? "is-loading" : ""}`}
              type="submit"
            >
              Finish Setup
            </button>
          </div>
        </div>
      </form >
    </div >
  );
};

export default FinishSetup;

import { useRouter } from "next/dist/client/router";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../components/General/Loading";
import { IPageProps } from "../../types/interface/IPageProps";
import { definitions } from "../../types/supabase";

const Settings = ({ supabase }: IPageProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<
    definitions["organizations"][]
  >([]);
  const [saving, setSaving] = useState(false);

  const [defaultOrganization, setDefaultOrganization] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .select("id, name")
      .then(({ data }) => {
        if (data) {
          setOrganizations(data);

          supabase
            .from<definitions["profiles"]>("profiles")
            .select("*")
            .then(({ data }) => {
              if (data) {
                setDefaultOrganization(data[0].default_org_id);
                setName(data[0].name);
                setLoading(false);
              }
            });
        }
      });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    if (defaultOrganization !== "null" && name.length > 1) {
      supabase
        .from<definitions["profiles"]>("profiles")
        .update({
          name,
          default_org_id: defaultOrganization,
        })
        .then(() => {
          router.push("/dash");
        });
    } else {
      toast("Please ensure you have correctly filled out all of the fields!", {
        type: "error",
      });
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="container mt-4">
      <h1 className="title">Settings</h1>
      <h2 className="subtitle">
        Basic items that give you control over the app.
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Display Name</label>
          <div className="control">
            <input
              className="input"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Default Organization</label>
          <div className="control">
            <div className="select" style={{ width: "100%" }}>
              <select
                value={defaultOrganization}
                onChange={(e) => setDefaultOrganization(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="null">Select a group</option>
                {organizations?.map((organization, idx) => (
                  <option value={organization.id} key={idx}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button
              className={`button is-primary ${saving ? "is-loading" : ""}`}
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;

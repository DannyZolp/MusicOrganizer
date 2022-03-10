import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../components/General/Loading";
import { AboutOrganization } from "../../components/Organization/About";
import {
  CreateOrganization,
  IOrganizationPartial,
} from "../../components/Organization/Create";
import { ShareOrganization } from "../../components/Organization/Share";
import { UpdateOrganization } from "../../components/Organization/Update";
import { IPageProps } from "../../types/interface/IPageProps";
import { definitions } from "../../types/supabase";

const Organizations = ({ supabase }: IPageProps) => {
  const router = useRouter();
  const { create: createOrganization } = router.query;

  const [organizations, setOrganizations] = useState<
    definitions["organizations"][]
  >([]);

  const [showCreate, setShowCreate] = useState<boolean>(
    createOrganization === "true"
  );
  const [showUpdate, setShowUpdate] = useState<string>("");
  const [showAbout, setShowAbout] = useState<string>("");
  const [showShare, setShowShare] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrganizations = () => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setOrganizations(data);
          setLoading(false);
        }
      });
  };

  const create = (organization: IOrganizationPartial) => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .insert({
        ...organization,
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
            .then(fetchOrganizations);
        }
      });
  };

  const update = (organization: definitions["organizations"]) => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .update(organization)
      .eq("id", organization.id)
      .then(fetchOrganizations);
  };

  const del = (id: string) => {
    supabase
      .from<definitions["organizations"]>("organizations")
      .delete()
      .eq("id", id)
      .then(fetchOrganizations);
  };

  const share = (org_id: string, email: string) => {
    supabase
      .from<definitions["invites"]>("invites")
      .insert({
        organization_id: org_id,
        email,
        issuer_id: supabase.auth.user()?.id,
        org_name: organizations.find((o) => o.id === org_id)?.name,
      })
      .then(({ data }) => {
        if (data) {
          axios
            .post("/api/send_invite_email", {
              id: data[0].id,
            })
            .then(({ data }) => {
              if (data.status === "error") {
                toast(`Error sending invite to ${email}.`, {
                  type: "error",
                });
              } else {
                toast(`Successfully sent invite to ${email}!`, {
                  type: "success",
                });
              }
            });
        }
      });
  };

  useEffect(fetchOrganizations, []);

  return (
    <div className="container mt-4">
      {showCreate ? (
        <CreateOrganization
          create={create}
          close={() => setShowCreate(false)}
        />
      ) : null}
      {showUpdate ? (
        <UpdateOrganization
          update={update}
          organization={organizations.find((o) => o.id === showUpdate)}
          close={() => setShowUpdate("")}
        />
      ) : null}
      {showAbout ? (
        <AboutOrganization
          organization={organizations.find((o) => o.id === showAbout)}
          close={() => setShowAbout("")}
          edit={() => {
            setShowAbout("");
            setShowUpdate(showAbout);
          }}
          delete={() => {
            setShowAbout("");
            del(showAbout);
          }}
        />
      ) : null}
      {showShare ? (
        <ShareOrganization
          organization={organizations.find((o) => o.id === showShare)}
          close={() => setShowShare("")}
          share={(id, e) => {
            share(id, e);
            setShowShare("");
          }}
        />
      ) : null}
      <h1 className="title">Organizations</h1>
      <button onClick={() => setShowCreate(true)} className="button is-primary">
        Create Organization
      </button>
      {loading ? (
        <Loading />
      ) : (
        <div className="columns is-multiline mt-2">
          {organizations.map((o, idx) => (
            <div className="column is-one-third" key={idx}>
              <div className="card">
                <header className="card-header">
                  <h1
                    className="card-header-title"
                    onClick={() => setShowAbout(o.id)}
                  >
                    {o.name}
                  </h1>
                </header>
                <div className="card-content">
                  <p>{o.description ? o.description : "No description"}</p>
                  <div className="buttons">
                    <button
                      className="button is-primary mt-2"
                      onClick={() => setShowShare(o.id)}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organizations;

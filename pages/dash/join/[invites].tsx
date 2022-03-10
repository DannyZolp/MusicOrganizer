import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IPageProps } from "../../../types/interface/IPageProps";
import { definitions } from "../../../types/supabase";

const JoinOrganization = ({ supabase }: IPageProps) => {
  const router = useRouter();
  const { invites } = router.query;

  const [invite, setInvite] = useState<definitions["invites"]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(typeof invites);
    supabase
      .from<definitions["invites"]>("invites")
      .select("*")
      .eq("id", invites as string)
      .then(({ data }) => {
        if (data) {
          setInvite(data[0]);
          setLoading(false);
        }
      });
  }, [invites]);

  const accept = () => {
    axios
      .post("/api/accept_invite", {
        id: invites as string,
      })
      .then(({ data }) => {
        if (data.status === "error") {
          toast(data.message, { type: "error" });
        } else {
          router.push("/dash/organization");
        }
      });
  };

  const reject = () => {
    axios
      .post("/api/reject_invite", {
        id: invites as string,
      })
      .then(() => {
        router.push("/dash/organization");
      });
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div
      className="is-flex is-justify-content-center is-align-content-center"
      style={{ height: "100vh" }}
    >
      <div className="box is-justify-self-center is-align-self-center">
        <h1 className="title">Join {invite?.org_name}</h1>
        <p>
          Joining this organization will give you access to the score library
          and groups of this organization.
        </p>
        <hr />
        <button className="button is-primary" onClick={accept}>
          Join
        </button>
        <button className="button is-danger" onClick={reject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default JoinOrganization;

import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { definitions } from "../../types/supabase";

interface IGetUsernameProps {
  id: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IGetUsernameProps;

  if (body.id) {
    // insure the invite exists
    const { data: invites, error: inviteError } = await supabase
      .from<definitions["invites"]>("invites")
      .select("id, organization_id, issuer_id, email")
      .eq("id", body.id);

    if (inviteError) {
      res.status(500).json({
        status: "error",
        message: "Error getting invite.",
      });
    }

    if (invites) {
      const { data: profiles } = await supabase
        .from<definitions["profiles"]>("profiles")
        .select("id, email")
        .eq("email", invites[0].email);
      if (profiles) {
        await supabase
          .from<definitions["invites"]>("invites")
          .delete()
          .eq("id", invites[0].id);

        await supabase.from<definitions["memberships"]>("memberships").insert({
          user_id: profiles[0].id,
          issuer_id: invites[0].issuer_id,
          organization_id: invites[0].organization_id,
        });

        res.status(200).json({
          status: "success",
          message: "Invite successfully accepted!",
        });
      } else {
        res.status(401).json({
          status: "error",
          message:
            "The user this invite was sent to does not have an account or hasn't finished setting up their account.",
        });
      }
    } else {
      res.status(401).json({
        status: "error",
        message: "No invite found with that ID.",
      });
    }
  } else {
    res.status(401).send({
      status: "error",
      message: "Please provide an ID in the body of this request.",
    });
  }
};

export default handler;

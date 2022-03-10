import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { definitions } from "../../types/supabase";

interface IRejectInviteProps {
  id: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IRejectInviteProps;

  if (body.id) {
    const { error } = await supabase
      .from<definitions["invites"]>("invites")
      .delete()
      .eq("id", body.id);

    if (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to reject invite",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Successfully rejected invite!",
      });
    }
  } else {
    res.status(401).send("ID not provided in body");
  }
};

export default handler;

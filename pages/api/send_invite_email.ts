import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { definitions } from "../../types/supabase";
import sgMail from "@sendgrid/mail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

interface ISendInviteEmailProps {
  id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as ISendInviteEmailProps;

  const { data: logs } = await supabase
    .from<definitions["email_logs"]>("email_logs")
    .select("id, invite_id")
    .eq("invite_id", body.id);

  if (logs && logs.length > 0) {
    // an email has already been sent
    res.status(401).json({
      message: "Email has already been sent",
      state: "error",
    });
  } else {
    const { data: invite } = await supabase
      .from<definitions["invites"]>("invites")
      .select("id, email, organizations ( name )")
      .eq("id", body.id);

    if (invite) {
      // mark that the email has been sent first
      await supabase.from<definitions["email_logs"]>("email_logs").insert({
        invite_id: invite[0].id,
      });

      // send the email
      await sgMail.send({
        to: invite[0].email,
        from: {
          name: "Music Organizer",
          email: "noreply@zolp.dev"
        },
        // @ts-expect-error
        subject: `You have been invited to ${invite[0].organizations.name}`,
        text: `https://${process.env.NEXT_PUBLIC_URL}/dash/join/${invite[0].id}`,
        // @ts-expect-error // https://codepen.io/danny-zolp/pen/gOxyOjm
        html: `<body style="text-align: center; background-color: #893dc3; padding: 20px;"> <h1 style="color: white; font-size: 48px">You've been invited to ${invite[0].organizations.name}!</h1> <h2 style="color: white; font-size: 14px; margin-bottom: 30px;">To accept or deny this invite, you have to create an account using this email address. Or, you may just ignore this email.</h2> <a style="text-decoration: none; color: white; padding: 12px 14px; background-color: #e23dbe; border-radius: 12px" href="https://${process.env.NEXT_PUBLIC_URL}/dash/join/${invite[0].id}">View Invite</a></body>`,
      });

      res.status(200).json({
        message: "Email sent!",
        state: "success",
      });
    } else {
      res.status(401).json({
        message: "Invite not found",
        state: "error",
      });
    }
  }
};

export default handler;

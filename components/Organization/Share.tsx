import { FormEvent, useState } from "react";
import { definitions } from "../../types/supabase";

interface IShareOrganizationProps {
  organization: definitions["organizations"] | undefined;
  share: (organization_id: string, user_email: string) => void;
  close: () => void;
}

export const ShareOrganization = ({
  organization,
  share,
  close,
}: IShareOrganizationProps) => {
  const [email, setEmail] = useState<string>("");

  if (!organization) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    share(organization.id, email);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Share {organization.name}</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email shared to</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="control buttons">
                <button className="button is-primary" type="submit">
                  Invite
                </button>
                <button className="button" type="button" onClick={close}>
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  );
};

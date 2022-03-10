import { FormEvent, useEffect, useState } from "react";
import { definitions } from "../../types/supabase";

interface IUpdateOrganizationProps {
  organization: definitions["organizations"] | undefined;
  update: (organization: definitions["organizations"]) => void;
  close: () => void;
}

export const UpdateOrganization = ({
  organization,
  update,
  close,
}: IUpdateOrganizationProps) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setLocation(organization.location);
      setDescription(organization?.description ?? "");
    }
  }, [organization]);

  //   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     supabase
  //       .from<definitions["organizations"]>("organizations")
  //       .insert({
  //         name,
  //         location,
  //         description,
  //         owner_id: supabase.auth.user()?.id,
  //       })
  //       .then(({ data }) => {
  //         if (data) {
  //           SetUniversalOrganization(data[0].id);

  //           supabase
  //             .from<definitions["memberships"]>("memberships")
  //             .insert({
  //               issuer_id: supabase.auth.user()?.id,
  //               user_id: supabase.auth.user()?.id,
  //               organization_id: data[0].id,
  //             })
  //             .then(() => {
  //               router.push("/dash");
  //             });
  //         }
  //       });
  //   };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (organization) {
      e.preventDefault();
      update({
        ...organization,
        name,
        location,
        description,
      });
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="box">
          <h1 className="title">Update Organization</h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                placeholder="High School"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Location</label>
            <div className="control">
              <input
                className="input"
                placeholder="Anytown, USA"
                required
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder=""
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
          </div>

          <div className="field">
            <div className="control buttons">
              <button className="button is-primary" type="submit">
                Save
              </button>
              <button className="button" type="button" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  );
};

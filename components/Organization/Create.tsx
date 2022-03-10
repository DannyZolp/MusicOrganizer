import { FormEvent, useState } from "react";

export interface IOrganizationPartial {
  name: string;
  location: string;
  description: string;
}

interface ICreateOrganizationProps {
  create: (organization: IOrganizationPartial) => void;
  close: () => void;
}

export const CreateOrganization = ({
  create,
  close,
}: ICreateOrganizationProps) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [creating, setCreating] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    create({
      name,
      location,
      description,
    });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="box">
          <h1 className="title">Create Organization</h1>
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
              <button className={`button is-primary ${creating ? "is-loading" : ""}`} type="submit">
                Create
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

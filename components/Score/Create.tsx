import { useState } from "react";
import { IScoreInput } from "../../types/interface/IScoreInput";

interface ICreateScoreProps {
  create: (score: IScoreInput) => void;
  close: () => void;
}

export const CreateScore = ({ create, close }: ICreateScoreProps) => {
  const [customId, setCustomId] = useState("");
  const [level, setLevel] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    create({
      custom_id: customId,
      name,
      description,
      author,
      level,
    });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <form className="box" onSubmit={handleSubmit}>
          <h1 className="title">Create a Score</h1>
          <div className="columns">
            <div className="column">
              <label className="label">
                ID <span className="has-text-danger">*</span>
              </label>
              <div className="control">
                <input
                  className="input "
                  type="text"
                  placeholder="Cabinet 1 - #242"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="column">
              <label className="label">
                Level <span className="has-text-danger">*</span>
              </label>
              <div className="control">
                <input
                  className="input "
                  type="text"
                  placeholder="Easy"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">
              Name <span className="has-text-danger">*</span>
            </label>
            <div className="control">
              <input
                className="input "
                type="text"
                placeholder="Air for Band"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">
              Author <span className="has-text-danger">*</span>
            </label>
            <div className="control">
              <input
                className="input "
                type="text"
                placeholder="Frank Erickson"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea "
                placeholder="A masterful example of a slow, elegant work at the easy level. Featuring the trademark harmonic language of Frank Erickson, this composition is one of the top choices for that perfect contrast to a bold, spirited work on your contest or festival program."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                className={`button is-primary ${saving ? "is-loading" : ""}`}
                type="submit"
              >
                Submit
              </button>
            </div>
            <div className="control">
              <button className="button" onClick={close} type="button">
                Cancel
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

import React, { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import { definitions } from "../../types/supabase";

interface IUpdateGroupProps {
  group: definitions["groups"];
  update: (group: definitions["groups"]) => void;
  close: () => void;
}

export const UpdateGroup = ({ group, update, close }: IUpdateGroupProps) => {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    update({
      ...group,
      name,
      color,
      description,
    });
  };

  useEffect(() => {
    setName(group.name);
    setColor(group.color);
    setDescription(group.description ?? "");
  }, [group]);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <form className="box" onSubmit={handleSubmit}>
          <h1 className="title">Edit a Group</h1>
          <div className="field">
            <label className="label">
              Name <span className="has-text-danger">*</span>
            </label>
            <div className="control">
              <input
                className="input "
                type="text"
                placeholder="Jazz Band"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">
              Color <span className="has-text-danger">*</span>
            </label>
            <div className="control">
              <CirclePicker
                color={color}
                onChange={({ hex }) => setColor(hex)}
                width="100%"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea "
                placeholder="A small, extracurricular, jazz-style band with 23 people."
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
                Save
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

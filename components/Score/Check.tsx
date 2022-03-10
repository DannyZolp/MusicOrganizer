import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { definitions } from "../../types/supabase";

interface ICheckScoreProps {
  /**
   * Ensure to fetch with relation
   * ```group( id, name )```
   */
  score: definitions["scores"] | undefined;
  lease: definitions["leases"] | undefined | null;
  groups: definitions["groups"][] | null;
  /**
   * This function should take in a scoreId always
   * If a groupId is not passed, then the score should be checked in
   * If a groupId is passed, the score should be checked to that group
   */
  check: (scoreId: string, groupId?: string) => void;
  close: () => void;
}

export const CheckScore = ({
  score,
  lease,
  groups,
  check,
  close,
}: ICheckScoreProps) => {
  const [groupCheckedTo, setGroupCheckedTo] = useState("null");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (score) {
      if (groupCheckedTo !== "null") {
        setSaving(true);
        check(score.id, groupCheckedTo);
      } else {
        toast("Please ensure you have selected a group to check this out to!", {
          type: "error",
        });
      }
    }
  };
  if (!score) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <span>
            <code>ID {score.custom_id}</code>
          </span>
          <h1 className="title mt-4">{score.name}</h1>
          <h2 className="subtitle">by {score.author}</h2>
          <hr />
          <h2 className={lease ? "subtitle" : "subtitle has-text-success"}>
            {/** @ts-expect-error */}
            This score is {lease ? `checked to ${lease.groups.name}` : "in"}.
          </h2>

          {lease ? (
            <button
              onClick={() => {
                setSaving(true);
                check(score.id);
              }}
              className={`button ${saving ? "is-loading" : ""}`}
            >
              Check In
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Select Band to Assign Piece</label>
                <div className="control">
                  <div className="select" style={{ width: "100%" }}>
                    <select
                      value={groupCheckedTo}
                      onChange={(e) => setGroupCheckedTo(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="null">Select a group</option>
                      {groups?.map((group, idx) => (
                        <option value={group.id} key={idx}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button
                    type="submit"
                    className={`button ${saving ? "is-loading" : ""}`}
                  >
                    Check out to group
                  </button>
                </div>
              </div>
            </form>
          )}
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

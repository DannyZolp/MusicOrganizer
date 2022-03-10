import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { definitions } from "../../types/supabase";
import { Loading } from "../General/Loading";

interface IAboutGroupProps {
  group: definitions["groups"] | undefined;
  scores: PromiseLike<definitions["leases"][] | null>;
  del: () => void;
  edit: () => void;
  close: () => void;
}

export const AboutGroup = ({
  group,
  scores: scoresFunction,
  del,
  edit,
  close,
}: IAboutGroupProps) => {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [scores, setScores] = useState<definitions["scores"][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scoresFunction.then((data) => {
      if (data) {
        // @ts-expect-error
        setScores(data.map((i) => i.scores));
        setLoading(false);
      }
    });
  }, []);

  return group ? (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <div className="buttons is-pulled-right">
            <button className="button" onClick={edit}>
              <span className="icon is-small">
                <FontAwesomeIcon icon={faEdit} />
              </span>
            </button>
            <button
              className={`button ${confirmDelete ? "is-danger" : ""}`}
              onClick={() => {
                if (confirmDelete) {
                  del();
                } else {
                  setConfirmDelete(true);
                }
              }}
            >
              <span className="icon is-small">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </div>
          <h1 className="title mt-4">{group.name}</h1>
          <p>{group.description ? group.description : "No description"}</p>
          <hr />
          {loading ? (
            <Loading />
          ) : scores.length < 1 ? (
            <span>No pieces checked out!</span>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <abbr title="Identification Code">ID</abbr>
                  </th>
                  <th>
                    <abbr title="Level">Lvl</abbr>
                  </th>
                  <th>Name</th>
                  <th>Author</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, idx) => (
                  <tr key={idx}>
                    <td>{score.custom_id}</td>
                    <td>{score?.level ?? "(None)"}</td>
                    <td>{score.name}</td>
                    <td>{score.author}</td>
                    <td>
                      {(score?.description?.length ?? 0) < 1
                        ? "(None)"
                        : score?.description?.substring(0, 50) + "..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  ) : null;
};

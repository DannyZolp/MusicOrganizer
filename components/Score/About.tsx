import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatRelative } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  AddToQRQueue,
  IsInQRQueue,
  RemoveFromQRQueue,
} from "../../functions/QRPrintQueue";
import { definitions } from "../../types/supabase";
import { Loading } from "../General/Loading";

interface IAboutScoreProps {
  score: definitions["scores"] | undefined;
  edit: () => void;
  del: () => void;
  close: () => void;
  fetchLeases: PromiseLike<definitions["leases"][] | null>;
}

export const AboutScore = ({
  score,
  close,
  edit,
  del,
  fetchLeases,
}: IAboutScoreProps) => {
  const [isInQrQueue, setIsInQrQueue] = useState(IsInQRQueue(score?.id ?? ""));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [leases, setLeases] = useState<definitions["leases"][]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLeases.then((data) => {
      if (data) {
        setLeases(data);
        setLoading(false);
      }
    });
  }, [fetchLeases]);

  return score ? (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <span>
            <code>ID {score.custom_id}</code>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <a
                href={`/dash/score?check=${score.id}`}
                className={
                  leases.find((l) => l.returned_at === null)
                    ? "ml-1"
                    : "ml-1 has-text-success"
                }
              >
                {leases.find((l) => l.returned_at === null)
                  ? // @ts-expect-error
                    leases.find((l) => l.returned_at === null).groups.name
                  : "[ IN ]"}
              </a>
            )}
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
          </span>
          <h1 className="title mt-4">{score.name}</h1>
          <h2 className="subtitle">by {score.author}</h2>
          <p>{score.description}</p>
          <hr />
          <h2 className="subtitle">
            Label
            {isInQrQueue ? (
              <button
                className="button is-danger is-pulled-right"
                onClick={() => {
                  RemoveFromQRQueue(score.id);
                  setIsInQrQueue(false);
                }}
              >
                Remove from Print Queue
              </button>
            ) : (
              <button
                className="button is-pulled-right"
                onClick={() => {
                  AddToQRQueue(score.id);
                  setIsInQrQueue(true);
                }}
              >
                Add to Print Queue
              </button>
            )}
          </h2>
          <hr />
          <h2 className="subtitle">Previous Borrowers</h2>
          {loading ? (
            <Loading />
          ) : leases.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>
                    <abbr title="Time when first leased">Given</abbr>
                  </th>
                  <th>
                    <abbr title="Time when score returned">Returned</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                {leases.map((lease, idx) => (
                  <tr key={idx}>
                    <td>
                      {/** @ts-expect-error */}
                      {lease.groups.name}
                    </td>
                    <td>
                      {formatRelative(
                        new Date(lease.created_at ?? ""),
                        new Date()
                      )}
                    </td>
                    <td>
                      {lease.returned_at
                        ? formatRelative(
                            new Date(lease.returned_at ?? ""),
                            new Date()
                          )
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span>No leases on record.</span>
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

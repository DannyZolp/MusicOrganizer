import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { definitions } from "../../types/supabase";
import { Loading } from "../General/Loading";

interface IAboutOrganizationProps {
  organization: definitions["organizations"] | undefined;
  close: () => void;
  edit: () => void;
  delete: () => void;
}

export const AboutOrganization = ({
  organization,
  edit,
  delete: del,
  close,
}: IAboutOrganizationProps) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  if (!organization) {
    return <Loading />;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <span>
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
          <h1 className="title mt-4">{organization.name}</h1>
          <h2 className="subtitle">{organization.location}</h2>
          <p>{organization.description}</p>
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

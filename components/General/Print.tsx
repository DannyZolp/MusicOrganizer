import { useEffect, useState } from "react";

interface IPrintModalProps {
  close: () => void;
}

export const PrintModal = ({ close }: IPrintModalProps) => {
  const [numberOfQRCodes, setNumberOfQRCodes] = useState<number>(0);

  useEffect(() => {
    const qrCodes = JSON.parse(
      window.localStorage.getItem("print_qrcodes") ?? "[]"
    ) as string[];
    setNumberOfQRCodes(qrCodes.length);
  }, []);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Print Queue</h1>
          <hr />
          <h2 className="subtitle">QR Codes (Avery 8160 Compatible Labels)</h2>
          <div className="buttons">
            <button
              className="button"
              onClick={() => window.open("/dash/print/qr", "_blank")}
              disabled={numberOfQRCodes <= 0}
            >
              Print {numberOfQRCodes} {numberOfQRCodes === 1 ? "tag" : "tags"}
            </button>
            <button
              className="button is-danger"
              onClick={() => {
                window.localStorage.removeItem("print_qrcodes");
                close();
              }}
              disabled={numberOfQRCodes <= 0}
            >
              Clear
            </button>
          </div>
          <hr />
          <h2 className="subtitle">
            Scores{" "}
            <button
              className="button is-pulled-right"
              title="Coming Soon!"
              disabled
            >
              Print All
            </button>
          </h2>
          <h1 className="title mt-1">Coming Soon!</h1>
          {/* <table className="table"></table> */}
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

import Loader from "react-loader-spinner";

export const Loading = () => (
  <div className="is-flex is-justify-content-center" style={{ width: "100%" }}>
    <Loader
      type="Rings"
      color={
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "white"
          : "black"
      }
    />
  </div>
);

import { MouseEvent } from "react";

function SaveChanges({ onClick }: {onClick: () => void}) {
  return (
    <button type="button" className="btn save-changes" onClick={onClick}>
      {" "}
      Save Changes{" "}
    </button>
  );
}

export default SaveChanges;
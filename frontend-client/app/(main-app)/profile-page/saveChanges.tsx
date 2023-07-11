function SaveChanges({ onClick }: {onClick: () => void}) {
  return (
    <button type="button" className="btn save-changes" onClick={onClick} data-testid = "save-button">
      {" "}
      Save Changes{" "}
    </button>
  );
}

export default SaveChanges;
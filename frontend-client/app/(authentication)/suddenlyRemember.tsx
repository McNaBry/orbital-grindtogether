import Link from "next/link";

function SuddenlyRemember() {
  return (
    <p className = "suddenly-remember">
      {" "}
      Suddenly remember your password?{" "}
      <Link className="suddenly-remember-link" href="sign-in">
        {" "}
        Login{" "}
      </Link>
    </p>
  );
}

export default SuddenlyRemember;
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const logoutIcon = "/images/logout.png";

function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/sign-out", {
        method: "GET",
      });

      if (res.ok) {
        console.log("successfully logged out");
        router.push("/");
      } else {
        console.log("welp");
      }
    } catch (error) {
      console.log("idk what to write here at this point");
    }
  };

  return (
    <div>
      <button type="submit" className="btn mb-3" id="logout" onClick = {handleSignOut}>
        <Image
          width={20}
          height={20}
          src={logoutIcon}
          style={{ marginRight: "5px" }}
          alt="Log out"
        />
        Logout
      </button>
    </div>
  );
}

export default SignOutButton;

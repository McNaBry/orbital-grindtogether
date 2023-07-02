import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../authProvider"

const logoutIcon = "/images/logout.png";

function SignOutButton() {
  const router = useRouter();
  const auth = useAuth()

  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:5000/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: auth.user.uid })
      });

      if (res.ok) {
        console.log("Successfully logged out.");
        await auth.signOut()
        router.push("/");
      } else {
        console.log("Unfortunately logging out was unsuccessful.");
      }
    } catch (error) {
      console.log("Some unknown error appeared.");
    }
  };

  return (
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
  );
}

export default SignOutButton;

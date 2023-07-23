import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "../../authProvider"
import profileStyles from "./profile-page.module.css"

const logoutIcon = "/images/logout.png"

function SignOutButton() {
  const router = useRouter();
  const auth = useAuth()

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-out`, {
        method: "POST",
        credentials: "include"
      });

      if (res.ok) {
        const clearCookieRes = await fetch(`${window.origin}/api/sign-out`, {
          method: "POST",
          credentials: "include"
        });
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
    <button type="submit" className="btn mb-3" id={profileStyles["logout"]} onClick = {handleSignOut}>
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

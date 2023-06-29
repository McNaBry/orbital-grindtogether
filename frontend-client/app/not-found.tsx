"use client"

import React from "react";
import {useRouter} from "next/navigation"
import styles from "./404.module.css"

function Return() {
  const router = useRouter();

  const handleReturn = () => {
    router.push("/dashboard");
  }

  return (
    <button
      className="btn mb-3"
      id={styles["return"]}
      onClick={handleReturn}
    > Return to dashboard </button>
  );
}

function NotFound() {
  return (
    <div id={styles["page404"]}>
      <div id={styles["wrapper"]}>
      <h2> 404 </h2>
      <p> Page Not Found </p>
      <Return />
      </div>   
    </div>
  )
}

export default NotFound;
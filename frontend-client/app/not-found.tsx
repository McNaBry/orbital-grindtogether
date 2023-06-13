"use client"

import React from "react";
import {useRouter} from "next/navigation"
import "./404.css"

function Return() {
    const router = useRouter();

    const handleReturn = () => {
        router.push("/dashboard");
    }

    return (
          <button
            className="btn mb-3"
            id= "return"
            onClick = {handleReturn}
          > Return to dashboard </button>
        );
}

function NotFound() {
    return (
        <div className = "page404">
            <div className = "wrapper">
            <h2> 404 </h2>
            <p> Page Not Found </p>
            <Return />
            </div>   
        </div>
    )
}

export default NotFound;
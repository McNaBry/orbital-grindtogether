"use client"

import React from "react";
import LocationButton from "../locationButton";
import "../locations.css"

const layout = "/images/com3-level2.png";

function COM3L2() {
    return (
        <div className = "com3-layout">
            <LocationButton />
            <div className = "layout-container">
                <img src = {layout} alt = "COM3 Level 2 Layout" />
            </div>
        </div>
    )
}

export default COM3L2;
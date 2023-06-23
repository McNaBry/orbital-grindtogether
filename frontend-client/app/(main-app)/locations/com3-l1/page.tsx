"use client"

import React from "react";
import LocationButton from "../locationButton";
import "../locations.css"

const layout = "/images/com3-level1.png";

function COM3L1() {
    return (
        <div className = "com3-layout">
            <LocationButton />
            <div className = "layout-container">
                <img src = {layout} alt = "COM3 Level 1 Layout" />
            </div>
        </div>
    )
}

export default COM3L1;
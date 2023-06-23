"use client"

import React from "react";
import LocationButton from "../locationButton";
import "../locations.css"

const layout = "/images/com3-basement1.png";

function COM3B1() {
    return (
        <div className = "com3-layout">
            <LocationButton />
            <div className = "layout-container">
                <img src = {layout} alt = "COM3 Basement 1 Layout" />
            </div>
        </div>
    )
}

export default COM3B1;
"use client"
import { useState } from "react";
import { SearchBar } from "./input";
import { AvatarMenu } from "./avatar-menu";

const TopBar = () => {
    return(
        <div className="flex items-center justify-between h-23 bg-blue-100 rounded-lg shadow-md w-full mb-4 p-4">
            <div className="flex-1 flex justify-start">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-wide">WeatherWise</h1>
            </div>
            <div className= "flex-1 flex justify-center">
                <SearchBar/>
            </div>
            <div className="flex-1 flex justify-end">
                <AvatarMenu/>
            </div>
            
            
        </div>
    )
}

export default TopBar;
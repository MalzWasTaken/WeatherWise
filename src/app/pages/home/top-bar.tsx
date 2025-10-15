"use client"
import { useState } from "react";
import { SearchBar } from "./input";
import { AvatarMenu } from "./avatar-menu";


const TopBar = () => {
    return(
        <div className="flex flex-col w-full mb-4 p-4">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex-1 flex justify-start">
                    <h1 className="lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 text-shadow-2xs bg-clip-text z-[1] text-transparent tracking-wide sm:text-2xl text-xl">WeatherWise</h1>
                </div>
                <div className="flex-1 sm:flex justify-center hidden ">
                    <SearchBar/>
                </div>
                <div className="flex-1 flex justify-end">
                    <AvatarMenu/>
                </div>
            </div>
            <div className="w-full flex justify-center mt-4 sm:hidden ">
                <SearchBar/>
            </div>
        </div>
    )
}

export default TopBar;
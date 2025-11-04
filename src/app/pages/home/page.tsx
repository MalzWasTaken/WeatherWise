"use client";

import TopBar from "./top-bar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { auth0 } from "../../../lib/auth0";
import { useGeolocation } from "@uidotdev/usehooks";
import Toast from "typescript-toastify";
import { ForecastCard } from "./ForecastCard";

const RainAnimation = dynamic(() => import("./rainAnimation"), { ssr: false });
const GoodRainAnimation = dynamic(() => import("./GoodRainAnimation"), {
  ssr: false,
});

const backendUrl = "http://localhost:5005";

const HomePageWrapper = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      //If user is not authenticated, redirect to back to main
      try {
        if (
          window.location.search.includes("code=") ||
          window.location.search.includes("error=")
        ) {
          await auth0.handleRedirectCallback();
        }

        const isAuthenticated = await auth0.isAuthenticated();
        if (!isAuthenticated) {
          await auth0.logout({
            logoutParams: { returnTo: window.location.origin },
          })
        }

        //Check if user exists in backend
        const userProfile = await auth0.getUser();
        setUser(userProfile);

        if (userProfile?.email) {
          const response = await fetch(
            `${backendUrl}/api/users/email/${encodeURIComponent(
              userProfile.email
            )}`
          );

          let existingUser = null;

          // Check if https response is within range
          if (response.ok) {
            const text = await response.text();
            existingUser = text ? JSON.parse(text) : null;
          }

          // If user exists, update user details and redirect to dashboard
          if (existingUser) {
            console.log("Existing user found:", existingUser);
            const updateResponse = await fetch(
              `${backendUrl}/api/users/update/${encodeURIComponent(
                existingUser.id
              )}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: existingUser.id,
                  email: userProfile.email,
                  first_name: userProfile.given_name,
                  last_name: userProfile.family_name,
                  nickname: userProfile.nickname,
                  email_verified: userProfile.email_verified,
                  updated_at: new Date(),
                }),
              }
            );
            if (updateResponse.ok) {
              await updateResponse.json();
              router.replace("/pages/home");

              //Toast popup - Existing User
              const toast = new Toast({
                toastMsg: "Welcome back, " + userProfile.nickname,
                autoCloseTime: 3000,
                theme: "dark",
                type: "success",
              });
            }
            return;
          }

          //If user does not exist, create new user in backend
          console.log("No existing user, creating new user.");

          const createResponse = await fetch(`${backendUrl}/api/users/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userProfile.email,
              first_name: userProfile.given_name,
              last_name: userProfile.family_name,
              nickname: userProfile.nickname,
              email_verified: userProfile.email_verified,
            }),
          });

          //Then redirect to dashboard
          if (createResponse.ok) {
            await createResponse.json();
            router.replace("/pages/home");
            console.log("New user created successfully.");

            //Toast popup - new user
            const toast = new Toast({
              toastMsg: "Welcome, " + userProfile.nickname,
              autoCloseTime: 3000,
              theme: "dark",
              type: "success",
            });

            //Send a welcome message to user via backend email
            const email = await fetch(`${backendUrl}/api/email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: userProfile.email,
                subject: "Welcome to WeatherWise!",
                html: `<p>Hi ${userProfile.nickname}, welcome to WeatherWise!</p> 
                <img src="cid:welcome_image"/>
                <a href="http://localhost:3000" style=color:blue>Get Your Weather Now!</a>`,
                image: "../images/image.png",
              }),
            });
            if (email.ok) {
              const data = await email.json();
              console.log(data);
            } else {
              const data = await email.json();
              console.log(data);
            }
          }
        }
        //catch any errors and redirect to main
      } catch (err) {
        console.log("Error in Authenticaton", err);

        router.replace("/");

        //Toast popup - Error
        setTimeout(() => {
          const toast = new Toast({
            toastMsg: "Error Occurred - Please Try Again",
            autoCloseTime: 3000,
            theme: "dark",
            type: "error",
          });
        }, 500);
      }
    };

    checkAuth();
  }, [router]);

  if (!user) return null;
  return <HomePage user={user} />;
};


const HomePage = ({ user }: { user: any }) => {
  const [weather, setWeather] = useState("thunderstorm");
  const router = useRouter();

  const handleBack = () => router.push("/");

  const handleRain = () => setWeather("rain");
  const handleThunder = () => setWeather("thunderstorm");
  const handleSnow = () => setWeather("snow");

  const getBackground = (weather: string) => {
    switch (weather?.toLowerCase()) {
      case "clear":
        return "from-sky-300 to-yellow-200";
      case "rain":
        return "from-gray-700 to-gray-800";
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "snow":
        return "from-gray-400 to-gray-400";
      case "thunderstorm":
        return "from-gray-800 to-gray-900";
      case "mist":
      case "fog":
        return "from-gray-300 to-gray-500";
      default:
        return "from-blue-200 to-blue-400";
    }
  };

  return (
    <div
      className={`min-h-screen z-[1] flex flex-col items-center text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(
        weather
      )}`}
    >
      <div className="fixed inset-0 z-[0] pointer-events-none w-screen h-screen flex items-center justify-center">
        {weather === "rain" && <GoodRainAnimation type="rain" />}
        {weather === "thunderstorm" && (
          <GoodRainAnimation type="thunderstorm" />
        )}
        {weather === "snow" && <RainAnimation type="drizzle" />}
      </div>

      <TopBar />

      <button
        className={`${
          weather === "snow" ? "bg-green-400 hover:bg-green-300" : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={() => setWeather("snow")}
      >
        Snowy snow
      </button>
      <button
        className={`${
          weather === "rain" ? "bg-green-400 hover:bg-green-300" : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={() => setWeather("rain")}
      >
        Rainy Weather
      </button>
      <button
        className={`${
          weather === "thunderstorm"
            ? "bg-green-400 hover:bg-green-300"
            : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={() => setWeather("thunderstorm")}
      >
        Thundery Weather
      </button>

      <button
        className="bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]"
        onClick={() => router.push("/")}
      >
        Back to main page
      </button>
    </div>
  );
};

export default HomePageWrapper;

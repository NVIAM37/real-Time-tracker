import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ContextTheme";
import { FaLocationDot } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineSpeed } from "react-icons/md";
import { gsap } from "gsap";

import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

import map from "../../assets/map4.png";
import map2 from "../../assets/map3.png";
import RealTimeClock from "./RealTimeClock";
import useUserDistances from "../../hooks/useUserDistances";

const Home = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { getDisplayDistance, totalUsers, isLoading, error, hasConnections } =
    useUserDistances();

  // Add debugging and ensure proper initialization
  useEffect(() => {
    console.log(`[Home Component ${Date.now()}] Component mounted`);
    console.log(`[Home Component ${Date.now()}] Current state:`, {
      totalUsers,
      isLoading,
      error,
      hasConnections,
      displayDistance: getDisplayDistance(),
    });

    // Force a re-render if the component seems stuck
    const forceRenderTimer = setTimeout(() => {
      if (isLoading && totalUsers === 0) {
        console.log(`[Home Component ${Date.now()}] Force re-render triggered`);
        // This will trigger a re-render
        window.dispatchEvent(new Event("resize"));
      }
    }, 3000);

    return () => clearTimeout(forceRenderTimer);
  }, [totalUsers, isLoading, error, hasConnections]);

  // Refs
  const mapRef = useRef(null);
  const map2Ref = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // ✅ Maps animation (small → big zoom-in)
    tl.from([map2Ref.current, mapRef.current], {
      scale: 0.5, // start chhota
      opacity: 0,
      duration: 1,
      stagger: 0.3, // ek ek karke
      ease: "back.out(1.7)", // thoda bounce effect
    });

    // ✅ Cards animation (staggered pop-in)
    tl.from(cardsRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <>
      <div
        className={`${
          isDark
            ? "bg-[#0A131F] text-white border-gray-300"
            : "bg-white text-[#0A131F] border-[#0A131F]"
        }  min-h-screen pt-12 overflow-x-hidden`}
      >
        {/* Debug Info - Only show in development */}
        <div className="fixed top-22 left-1 -z-0 bg-gray-300 text-black p-2 rounded text-xs">
          <p>Tab ID: {Date.now()}</p>
          <p>Loading: {isLoading ? "Yes" : "No"}</p>
          <p>Users: {totalUsers}</p>
          <p>Error: {error || "None"}</p>
          <p>Connections: {hasConnections ? "Yes" : "No"}</p>
          <button
            onClick={() => {
              console.log("Manual refresh from debug panel");
              window.location.reload();
            }}
            className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
          >
            Force Refresh
          </button>
        </div>

        {/* Fallback content - always show at least the basic structure */}
        <div className="flex sm:p-0 pt-12 sm:flex-row flex-col relative justify-center">
          {/* left part */}
          <div className="w-full sm:w-[60%] py-10 items-center">
            {/* Content */}
            <div className="text-center py-5">
              <h1
                ref={headingRef}
                className="text-[2.5rem] sm:text-[2rem] md:text-[2.8rem] xl:text-[4.5rem] sm:text-nowrap font-extrabold py-2 "
              >
                Real-Time Tracker
              </h1>

              <p
                className={`text-[1rem] sm:text-lg ${
                  isDark ? "text-gray-400" : "text-black"
                }`}
              >
                Monitor your location in real-time with our advanced tracking
                system.
              </p>
            </div>

            {/* Cards */}

            <div className="p-1 flex flex-col  justify-between -z-20 ">
              <h1 className=" text-[1.6rem] sm:text-[2rem] md:text-[2.8rem] text-gray-700 font-extrabold   px-10 py-2">
                TODAY
              </h1>

              <RealTimeClock useBackend={true} />
            </div>

            {/* Show loading state if still loading */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading user data...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Checking for existing connections...
                </p>
                <p className="text-xs text-blue-500 mt-2">
                  This may take a few seconds for new tabs
                </p>

                {/* Show basic UI structure even while loading */}
                <div className="mt-8 w-full sm:w-[300px] flex flex-col p-5 gap-5 mx-auto">
                  <div className="bg-gray-100 h-[150px] rounded-2xl flex items-center justify-center">
                    <p className="text-gray-500">Loading cards...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show error state if there's an error */}
            {error && !isLoading && (
              <div className="text-center py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md">
                  <p className="font-bold">Error Loading Data</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            )}

            {/* Show main content only when not loading and no errors */}
            {!isLoading && !error && (
              <>
                <div
                  className={`p-2 flex  lg:flex-row   flex-col gap-2 lg:absolute lg:left-[220px] lg:top-[300px] ${
                    isDark ? "bg-[#0A131F]" : "bg-white"
                  } rounded-3xl z-50`}
                >
                  {/* card 1 */}
                  <div
                    ref={(el) => (cardsRef.current[0] = el)}
                    className={` w-auto lg:w-[200px]  ${
                      isDark ? "bg-[#0a0a0a]" : "bg-white"
                    } 
                  border border-gray-700 h-auto sm:h-[150px] rounded-2xl flex flex-row items-center lg:items-start  lg:flex-col gap-2 py-4 px-2 `}
                  >
                    <FaLocationDot className=" text-[1.5rem] sm:text-4xl lg:text-3xl" />
                    <div className="p-2 flex flex-col justify-evenly ">
                      <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.2rem] font-bold">
                        142 min
                      </h2>
                      <p className="text-[1rem] sm:text-[1rem] text-gray-400">
                        Duration
                      </p>
                    </div>
                  </div>

                  {/* card 2 */}
                  <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className={`w-auto lg:w-[200px]  ${
                      isDark ? "bg-[#0a0a0a]" : "bg-white"
                    } 
                  border border-gray-700 h-auto sm:h-[150px] rounded-2xl flex  flex-row lg:flex-col items-center lg:items-start   gap-1 py-4 px-2`}
                  >
                    <GiPathDistance className="text-[1.5rem] sm:text-4xl lg:text-3xl" />
                    <div className="p-2 flex flex-col justify-evenly gap-1 ">
                      <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.2rem] font-bold">
                        {getDisplayDistance()}
                      </h2>
                      <p className="text-[1rem] sm:text-[1rem] text-gray-400">
                        Distance ({totalUsers} users)
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        {totalUsers === 0
                          ? "No users connected"
                          : totalUsers === 1
                          ? "Single user connected"
                          : `${totalUsers} users connected`}
                      </p>
                    </div>
                  </div>

                  {/* card 3 */}
                  <div
                    ref={(el) => (cardsRef.current[2] = el)}
                    className={`w-auto lg:w-[200px]  ${
                      isDark ? "bg-[#0a0a0a]" : "bg-white"
                    } 
                  border border-gray-700 h-auto sm:h-[150px] rounded-2xl  flex  flex-row lg:flex-col items-center lg:items-start   gap-2 py-4 px-2`}
                  >
                    <MdOutlineSpeed className="text-[1.5rem] sm:text-4xl lg:text-3xl" />
                    <div className="p-2 flex flex-col justify-evenly ">
                      <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.2rem] font-bold">
                       32km/h
                      </h2>
                      <p className="text-[1rem] sm:text-[1rem] text-gray-400">
                        velocity
                      </p>
                    </div>
                    
                  </div>
                </div>

                <div className="mt-2 w-full sm:w-[250px] flex flex-col p-5 gap-5">
                  <button
                    className="p-2 rounded-xl font-bold bg-blue-500 text-white"
                    onClick={() => alert("added soon....")}
                  >
                    History
                  </button>
                </div>
              </>
            )}

            <div className="sm:flex-row flex-col lg:flex hidden  items-center justify-center gap-6">
              {/* Show fallback UI if no users and not loading */}
              {!isLoading && !error && totalUsers === 0 && (
                <div className="text-center py-4 ">
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mx-auto max-w-md">
                    <p className="font-bold">No Users Connected</p>
                    <p className="text-sm">
                      Open this app in another tab to see real-time tracking
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Tip: Go to PathFinder first to establish a connection
                    </p>
                    <div className="flex gap-2 justify-center mt-3">
                      <button
                        onClick={() => navigate("/pathfinder")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Go to PathFinder
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Refresh Page
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        console.log("Manual refresh triggered");
                        window.location.reload();
                      }}
                      className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Force Refresh
                    </button>
                  </div>
                </div>
              )}

              {/* Show fallback UI if everything fails - emergency fallback */}
              {!isLoading && !error && totalUsers === 0 && (
                <div className="text-center py-8 ">
                  <div className="bg-gray-100 border min-h-[180px] border-gray-400 text-gray-700 px-4 py-3 rounded mx-auto max-w-md flex flex-col items-center justify-between">
                    <p className="font-bold">Welcome to Real-Time Tracker</p>
                    <div>
                      <p className="text-sm">
                        The app is ready but no users are currently connected
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        This is normal for new installations
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center mt-3">
                      <button
                        onClick={() => navigate("/pathfinder")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Start Tracking
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right part */}
          <div className="w-full sm:w-[40%]  py-2 px-3 flex items-center justify-center h-full">
            <div className="sm:hidden block">
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={map2}
                  alt="Map View 1"
                  className={`w-full max-w-md ${
                    isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
                  } h-[300px] border border-gray-700 rounded-lg cursor-pointer`}
                  onClick={() => navigate("/pathfinder")}
                />
                <img
                  src={map}
                  alt="Map View 2"
                  className={`w-full max-w-md ${
                    isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
                  } h-[300px] border border-gray-700 rounded-lg cursor-pointer`}
                  onClick={() => navigate("/pathfinder")}
                />
              </div>
            </div>

            <div className="sm:flex hidden flex-col  items-center justify-center ">
              <img
                ref={map2Ref}
                src={map2}
                alt="Desktop Map View 1"
                className={`w-full ${
                  isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
                } h-[400px] border-b border-gray-700 cursor-pointer`}
                onClick={() => navigate("/pathfinder")}
              />
              <img
                ref={mapRef}
                src={map}
                alt="Desktop Map View 2"
                className={`w-[800px] ${
                  isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
                } h-[400px] cursor-pointer`}
                onClick={() => navigate("/pathfinder")}
              />
            </div>
          </div>
        </div>
      </div>




      <div className= {`${
                      isDark ? "bg-[#0A131F]" : "bg-white"
                    } lg:hidden block`}>
        <div className=" flex sm:flex-row flex-col items-center justify-center gap-1">
          {/* Show fallback UI if no users and not loading */}
          {!isLoading && !error && totalUsers === 0 && (
            <div className="text-center py-4 ">
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mx-auto max-w-md">
                <p className="font-bold">No Users Connected</p>
                <p className="text-sm">
                  Open this app in another tab to see real-time tracking
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Tip: Go to PathFinder first to establish a connection
                </p>
                <div className="flex gap-2 justify-center mt-3">
                  <button
                    onClick={() => navigate("/pathfinder")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Go to PathFinder
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Refresh Page
                  </button>
                </div>
                <button
                  onClick={() => {
                    console.log("Manual refresh triggered");
                    window.location.reload();
                  }}
                  className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Force Refresh
                </button>
              </div>
            </div>
          )}

          {/* Show fallback UI if everything fails - emergency fallback */}
          {!isLoading && !error && totalUsers === 0 && (
            <div className="text-center py-6 ">
              <div className="bg-gray-100 border min-h-[180px] border-gray-400 text-gray-700 px-4 py-3 rounded mx-auto max-w-md flex flex-col items-center justify-between">
                <p className="font-bold">Welcome to Real-Time Tracker</p>
                <div>
                  <p className="text-sm">
                    The app is ready but no users are currently connected
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This is normal for new installations
                  </p>
                </div>

                <div className="flex gap-2 justify-center mt-3">
                  <button
                    onClick={() => navigate("/pathfinder")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Start Tracking
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

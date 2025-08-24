import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "./ContextTheme";
import { FaLocationDot } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineSpeed } from "react-icons/md";
import { gsap } from "gsap";

import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

import map from "../../assets/map4.png";
import map2 from "../../assets/map3.png";
import Typewriter from "./Typewriter";
import App from "../../App";

const Home = () => {
  const { isDark } = useContext(ThemeContext);
  // const [inputShow, setInputShow] = useState(false);
  const [password, setPassword] = useState("");
  const [openPasswordDiv, setOpenPasswordDiv] = useState(false);

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
    <div
      className={`${
        isDark
          ? "bg-[#0A131F] text-white border-gray-300"
          : "bg-white text-[#0A131F] border-[#0A131F]"
      }  min-h-screen pt-12 overflow-x-hidden`}
    >
      <div className="  flex sm:flex-row flex-col relative  justify-center  ">
        {/* left part */}
        <div className=" w-full sm:w-[50%] py-10 items-center">
          {/* Content */}
          <div className="text-center py-5">
            <h1
              ref={headingRef}
              className="text-5xl sm:text-[2rem] md:text-[2.8rem] xl:text-[4.5rem]  sm:text-nowrap font-extrabold py-2"
            >
              Real-Time Tracker
            </h1>

            {/* <Typewriter /> */}

            <p
              className={`text-xl sm:text-lg ${
                isDark ? "text-gray-400" : "text-black"
              }`}
            >
              Monitor your location in real-time with our advanced tracking
              system.
            </p>
          </div>

          {/* Cards */}
          <h1 className="text-4xl text-gray-700  font-extrabold mt-5 px-10 py-4">
            TODAY
          </h1>

          <div
            className="w-[200px] border-3 border-dashed border-[#3554af] h-[80px] lg:h-[180px] z-30 flex items-center justify-center text-3xl font-bold ml-10"
            // style={{
            //   border: "4px solid",
            //    borderImage: "linear-gradient(90deg, rgba(168,56,242,1) 0%, rgba(222,20,20,1) 43%, rgba(240,142,22,1) 97%) 1",

            // }}
          >
            12:45
          </div>

          <div
            className={`p-4 flex  lg:flex-row   flex-col gap-2 lg:absolute lg:left-[220px] lg:top-[300px] ${
              isDark ? "bg-[#0A131F]" : "bg-white"
            } rounded-3xl z-50`}
          >
            {/* card 1 */}
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              className={` w-auto lg:w-[200px]  ${
                isDark ? "bg-[#0a0a0a]" : "bg-white"
              } 
              border border-gray-700 h-[150px] rounded-2xl flex flex-row items-center lg:items-start  lg:flex-col gap-2 py-2 px-4`}
            >
              <FaLocationDot className="text-4xl lg:text-3xl" />
              <div className="p-2 flex flex-col justify-evenly gap-1">
                <h2 className="text-4xl font-bold">142 min</h2>
                <p className="text-[1.5rem] sm:text-[1rem] text-gray-400">
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
              border border-gray-700 h-[150px] rounded-2xl flex  flex-row lg:flex-col items-center lg:items-start   gap-2 py-2 px-4`}
            >
              <GiPathDistance className="text-4xl lg:text-3xl" />
              <div className="p-2 flex flex-col justify-evenly gap-1 ">
                <h2 className="text-4xl font-bold">12.5 km</h2>
                <p className="text-[1.5rem] sm:text-[1rem] text-gray-400">
                  Distance
                </p>
              </div>
            </div>

            {/* card 3 */}
            <div
              ref={(el) => (cardsRef.current[2] = el)}
              className={`w-auto lg:w-[200px]  ${
                isDark ? "bg-[#0a0a0a]" : "bg-white"
              } 
              border border-gray-700 h-[150px] rounded-2xl  flex  flex-row lg:flex-col items-center lg:items-start   gap-2 py-2 px-4`}
            >
              <MdOutlineSpeed className="text-4xl lg:text-3xl" />
              <div className="p-2 flex flex-col justify-evenly gap-1 ">
                <h2 className="text-4xl font-bold">32 km/h</h2>
                <p className="text-[1.5rem] sm:text-[1rem] text-gray-400">
                  Velocity
                </p>
              </div>
            </div>
          </div>

          <div className=" mt-8 w-full sm:w-[300px] flex flex-col p-5 gap-5 ">
            <button
              className=" p-2 rounded-xl font-bold bg-gray-300 text-black "
              onClick={()=>alert("added soon....")}
            //  style={{
            //     background: "#28367d",
            //     background:
            //       " radial-gradient(circle,rgba(40, 54, 125, 0.8) 0%, rgba(23, 17, 69, 1) 100%)",
            //   }}
            >
              History
            </button>


            <button className=" p-2 rounded-xl font-bold bg-gray-300 text-black"
            onClick={()=>alert("added soon....")}
            // style={{
            //     background: "#28367d",
            //     background:
            //       " radial-gradient(circle,rgba(40, 54, 125, 0.8) 0%, rgba(23, 17, 69, 1) 100%)",
            //   }}
            >Backend</button>
          </div>
        </div>

        {openPasswordDiv && (
          <div className=" bg-gray-200 h mt-10 mx-2 p-8 absolute -top-5 place-self-center z-50  gap-15">
            <div className="flex justify-between gap-30">
              <h1 className="text-3xl font-bold  text-gray-950 ">
                Create Your Password Now ...
              </h1>
              {/* <button
                onClick={() => setInputShow((prev) => !prev)}
                className="bg-[#0f3bc1] hover:bg-[#537aef] transition duration-500 ease-in-out rounded-2xl font-bold px-8 py-2 cursor-pointer"
              >
                Password
              </button> */}
            </div>

            <div className=" mt-5 flex">
              <input
                type="text"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                placeholder="Enter your Password here..."
                required
                name="password"
                className="bg-white rounded-l-xl outline-none  text-black p-2 w-full"
              />
              <button
                onClick={() => {
                  if (password === "") {
                    alert("Please enter your password first !");
                    return;
                  }
                  alert(`Your Password is ${password}`);
                  console.log(password);
                  setPassword("");
                }}
                className="py-2 cursor-pointer px-8 rounded-r-xl text-gray-900 font-bold bg-[#537aef]"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Right part */}
        <div className="w-full sm:w-[50%] py-2 px-3 flex items-center justify-center  h-full  ">
          {/* <App/> */}
          <div className="sm:hidden block">
            <App wd="100vw" ht="50vh"/>
          </div>

          <div
            onClick={() => {
              setOpenPasswordDiv((prev) => !prev);
            }}
            className="sm:flex hidden flex-col  items-center justify-center "
          >
            <img
              ref={map2Ref}
              src={map2}
              alt=""
              className={`w-full  ${
                isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
              }   h-[400px] border-b border-gray-700`}
            />
            <img
              ref={mapRef}
              src={map}
              alt=""
              className={`w-[800px]  ${
                isDark ? "bg-[#0a0a0a67]" : "bg-[#0a0a0ae9]"
              } h-[400px]`}
            />

            {/* <App/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

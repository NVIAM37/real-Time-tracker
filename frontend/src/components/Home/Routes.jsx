import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Home from "./Home";
import Chat from "./Chat";
import PathFinder from "./PathFinder";
import Velocity from "./Velocity";



const AppRoutes = () => {
  return (
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/pathfinder" element={<PathFinder />} />
      <Route path="/velocity" element={<Velocity />} />
    </Routes>
  );
};

export default AppRoutes;

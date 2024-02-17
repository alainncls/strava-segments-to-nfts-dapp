import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import StravaLogin from "./screens/StravaLogin/StravaLogin";
import About from "./screens/About/About";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth" element={<StravaLogin />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;

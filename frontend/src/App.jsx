import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vision from "./pages/Vision";
import Trends from "./pages/Trends";
import Studio from "./pages/Studio";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vision" element={<Vision />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
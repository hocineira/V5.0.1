import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import SkillsPage from "./components/SkillsPage";
import ProjectsPage from "./components/ProjectsPage";
import ExperiencePage from "./components/ExperiencePage";
import ContactPage from "./components/ContactPage";
import TCSPage from "./components/TCSPage";
import BTSSIOPage from "./components/BTSSIOPage";
import ProjetScolairePage from "./components/ProjetScolairePage";
import VeillePage from "./components/VeillePage";
import Navigation from "./components/Navigation";
import { Toaster } from "./components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/tcs" element={<TCSPage />} />
          <Route path="/bts-sio" element={<BTSSIOPage />} />
          <Route path="/projets-scolaires" element={<ProjetScolairePage />} />
          <Route path="/veille" element={<VeillePage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { getSettings, updateSettings } from "@/lib/voice-settings";

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY || '';

if (ELEVENLABS_API_KEY && !getSettings().elevenlabsApiKey) {
  updateSettings({ elevenlabsApiKey: ELEVENLABS_API_KEY });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

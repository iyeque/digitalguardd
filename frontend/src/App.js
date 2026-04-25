import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Alphabet from "@/pages/Alphabet";
import Numbers from "@/pages/Numbers";
import Colors from "@/pages/Colors";
import Shapes from "@/pages/Shapes";
import Animals from "@/pages/Animals";
import Rhymes from "@/pages/Rhymes";
import Puzzle from "@/pages/Puzzle";
import ParentDashboard from "@/pages/ParentDashboard";
import ParentSettings from "@/pages/ParentSettings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/abc" element={<Alphabet />} />
          <Route path="/123" element={<Numbers />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/shapes" element={<Shapes />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/rhymes" element={<Rhymes />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/settings" element={<ParentSettings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

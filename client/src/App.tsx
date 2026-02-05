import { BrowserRouter, Route, Routes } from "react-router";

import Index from "./pages/index.tsx";
import Poll from "./pages/poll.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/polls/:selectedPoll" element={<Poll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

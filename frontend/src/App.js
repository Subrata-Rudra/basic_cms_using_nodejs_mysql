import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import CreateEntityPage from "./components/CreateEntityPage";
import ViewEntityPage from "./components/ViewEntityPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/createEntity" element={<CreateEntityPage />} exact />
        <Route path="/viewEntity" element={<ViewEntityPage />} exact />
      </Routes>
    </div>
  );
}

export default App;

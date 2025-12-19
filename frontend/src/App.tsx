import "./App.css";
import { Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/auth/registration";

function App() {
  return (
    <>
      <Routes>
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </>
  );
}

export default App;

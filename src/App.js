import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessagesBoxScreen from "./screens/MessagesBoxScreen";
import SingleMessage from "./screens/SingleMessage";
import SigninScreen from "./screens/SignInScreen";
import SignupScreen from "./screens/SignUpScreen";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="top-center" limit={1} />
        <Routes>
          <Route path="/messages/:id" element={<SingleMessage />} />
          <Route path="/messages" element={<MessagesBoxScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

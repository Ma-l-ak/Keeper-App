import "./Style/App.css";
import NotePages from "./pages/NotePages.jsx";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LogoutPage from "./pages/Logout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/MyNotes" element={<NotePages />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

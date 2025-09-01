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
import HomePage from "./pages/HomePage.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/mynotes" element={<NotePages />} />
    </Route>
  )
);
function App() {
  return(
  <AuthProvider>
   <RouterProvider router={router} />
  </AuthProvider>
  );
}
export default App;

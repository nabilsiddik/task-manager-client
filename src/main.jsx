import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./Contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Login from './Pages/Login/Login';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute>
        <App/>
    </ProtectedRoute>
  },
  {
    path: '/login',
    element: <Login></Login>
  }
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <RouterProvider router={router} >
      </RouterProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);

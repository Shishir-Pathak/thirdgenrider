import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/routes.jsx";
import { BookingProvider } from "./context/BookingContext";
import { PackageBookingProvider } from "./context/PackageBookingContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BookingProvider>
      <PackageBookingProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRouter />
      </PackageBookingProvider>
    </BookingProvider>
  );
}

export default App;

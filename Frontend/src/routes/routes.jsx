import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import Home from "../pages/Home";
import About from "../pages/About";
import Bikes from "../pages/Bikes";
import BikeDetails from "../pages/BikeDetails";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import Contact from "../pages/Contact";
import Package from "../pages/Package";
import PackageDetails from "../pages/PackageDetails";
import Service from "../pages/Service";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import DashboardAuthGate from "../components/dashboard/DashboardAuthGate";
import DashboardBikes from "../pages/DashboardBikes";
import DashboardCompanyDetails from "../pages/DashboardCompanyDetails";
import DashboardPackages from "../pages/DashboardPackages";
import DashboardBikeBookings from "../pages/DashboardBikeBookings";
import DashboardPackageBookings from "../pages/DashboardPackageBookings";
import DashboardContact from "../pages/DashboardContact";
import DashboardBlogs from "../pages/DashboardBlogs";
import DashboardHome from "../pages/DashboardHome";
import DashboardAbout from "../pages/DashboardAbout";
import DashboardService from "../pages/DashboardService";
import DashboardLogin from "../pages/DashboardLogin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route element={<DashboardAuthGate />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="about" element={<DashboardAbout />} />
            <Route path="service" element={<DashboardService />} />
            <Route path="bikes" element={<DashboardBikes />} />
            <Route
              path="companyDetails"
              element={<DashboardCompanyDetails />}
            />
            <Route path="packages" element={<DashboardPackages />} />
            <Route path="bikeBookings" element={<DashboardBikeBookings />} />
            <Route
              path="packageBookings"
              element={<DashboardPackageBookings />}
            />
            <Route path="contact" element={<DashboardContact />} />
            <Route path="blogs" element={<DashboardBlogs />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:blogSlug" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/package" element={<Package />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          <Route path="/service" element={<Service />} />
        </Route>
        <Route path="/bike-details/:bikeId" element={<BikeDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

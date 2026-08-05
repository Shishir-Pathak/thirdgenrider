import express from "express";

import bikeBookingsRoutes from "./bikeBookingsRoutes.js";
import bikesRoutes from "./bikesRoutes.js";
import blogsRoutes from "./blogsRoutes.js";
import companyDetailsRoutes from "./companyDetailsRoutes.js";
import contactMessagesRoutes from "./contactMessagesRoutes.js";
import packageBookingsRoutes from "./packageBookingsRoutes.js";
import packagesRoutes from "./packagesRoutes.js";
import siteContentRoutes from "./siteContentRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";

const routes = express.Router();

routes.use("/bikes", bikesRoutes);
routes.use("/blogs", blogsRoutes);
routes.use("/bike-bookings", bikeBookingsRoutes);
routes.use("/company-details", companyDetailsRoutes);
routes.use("/contact-messages", contactMessagesRoutes);
routes.use("/package-bookings", packageBookingsRoutes);
routes.use("/packages", packagesRoutes);
routes.use("/site-content", siteContentRoutes);
routes.use("/admin", adminAuthRoutes);

export default routes;

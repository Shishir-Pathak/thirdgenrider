import express from "express";
import cors from "cors";
import routes from "./routes/index.js";


export function createApp() {

	const app = express();


	app.use(cors());


	// Handle JSON requests
	app.use(express.json());


	// Handle form-data text fields
	// (needed with multer uploads)
	app.use(express.urlencoded({
		extended: true
	}));


	app.get("/", (_req, res) => {

		res.send("API Running");

	});


	app.use("/api", routes);


	return app;

}
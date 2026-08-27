import express from "express";
import multer from "multer";

import {
	getSiteContent,
	updateSiteContent,
} from "../controller/siteContentController.js";


const router = express.Router();



// Multer configuration
const upload = multer({

	storage: multer.memoryStorage(),

	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},


	fileFilter(_req, file, cb) {


		if (!file.mimetype.startsWith("image/")) {

			cb(new Error("Only image files are allowed."));
			return;

		}


		cb(null, true);

	}

});




// Site content image upload middleware
function withSiteContentUpload(req, res, next) {


	upload.fields([


		{
			name: "homeHeroImage",
			maxCount: 1
		},


		{
			name: "aboutPrimaryImage",
			maxCount: 1
		},


		{
			name: "aboutSecondaryImage",
			maxCount: 1
		},


		{
			name: "processBackgroundImage",
			maxCount: 1
		},


		{
			name: "serviceStatsBackgroundImage",
			maxCount: 1
		}


	])(req, res, (err)=>{


		if(err){


			const message =
				err.code === "LIMIT_FILE_SIZE"
				?
				"Image must be 5 MB or smaller."
				:
				err.message || "Upload failed.";



			return res.status(400).json({

				message

			});


		}



		next();


	});


}




import authMiddleware from "../middleware/authmiddleware.js";

// Get complete site content
router.get(
	"/",
	getSiteContent
);

// Update complete site content (Superadmin only)
router.put(
	"/",
	authMiddleware(["superadmin"]),
	withSiteContentUpload,
	updateSiteContent
);



export default router;
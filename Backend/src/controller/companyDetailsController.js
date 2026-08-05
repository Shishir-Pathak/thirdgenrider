import CompanyDetails from "../models/CompanyDetails.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";


const textFields = [

	"name",
	"contactEmail",
	"contactPhone",
	"location",
	"businessHours",
	"about",
	"facebook",
	"tiktok",
	"instagram",
	"whatsapp",

];





function toDTO(o) {


	if (!o) return null;


	return {

		id: o.id,

		name: o.name,

		logo: o.logo || "",

		contactEmail: o.contact_email || "",

		contactPhone: o.contact_phone || "",

		whatsapp: o.whatsapp || "",

		location: o.location || "",

		businessHours: o.business_hours || "",

		about: o.about || "",

		facebook: o.facebook || "",

		tiktok: o.tiktok || "",

		instagram: o.instagram || "",

		createdAt: o.created_at,

		updatedAt: o.updated_at

	};

}









function buildPayload(body, res) {


	const payload = {};



	for (const field of textFields) {


		payload[field] =

			typeof body[field] === "string"

				? body[field].trim()

				: "";

	}





	if (!payload.name) {


		res.status(400).json({

			message: "Company name is required."

		});


		return null;


	}




	return payload;


}









// GET COMPANY DETAILS

export const getCompanyDetails = async (req, res) => {


	try {


		const company =

			await CompanyDetails.findOne();



		if (!company) {


			return res.status(404).json({

				message: "Company details not found."

			});


		}



		res.json(

			toDTO(company)

		);



	}
	catch(error) {


		res.status(500).json({

			message: error.message

		});


	}


};











// CREATE COMPANY DETAILS

export const createCompanyDetails = async (req, res) => {


	try {


		const existing =

			await CompanyDetails.findOne();



		if(existing) {


			return res.status(409).json({

				message:
					"Company details already exists. Update existing details."

			});


		}





		const data =

			buildPayload(

				req.body,

				res

			);



		if(!data) return;





		if(req.file?.buffer) {


			data.logo =

				await uploadImageBuffer(

					req.file.buffer

				);


		}





		const company =

			await CompanyDetails.create(

				data

			);





		res.status(201).json(

			toDTO(company)

		);



	}
	catch(error) {


		res.status(500).json({

			message:error.message

		});


	}


};











// UPDATE COMPANY DETAILS

export const updateCompanyDetails = async (req,res)=>{


	try {


		const updates =

			buildPayload(

				req.body,

				res

			);



		if(!updates) return;





		if(req.file?.buffer) {


			updates.logo =

				await uploadImageBuffer(

					req.file.buffer

				);


		}





		const existing =

			await CompanyDetails.findOne();



		if(!existing) {


			return res.status(404).json({

				message:"Company details not found."

			});


		}





		const updated =

			await CompanyDetails.update(

				existing.id,

				updates

			);





		res.json(

			toDTO(updated)

		);



	}
	catch(error) {


		res.status(500).json({

			message:error.message

		});


	}


};












// DELETE COMPANY DETAILS

export const deleteCompanyDetails = async(req,res)=>{


	try {


		const existing =

			await CompanyDetails.findOne();



		if(!existing) {


			return res.status(404).json({

				message:"Company details not found."

			});


		}





		const deleted =

			await CompanyDetails.delete(

				existing.id

			);





		if(!deleted) {


			return res.status(404).json({

				message:"Company details not found."

			});


		}





		res.status(204).send();



	}
	catch(error) {


		res.status(500).json({

			message:error.message

		});


	}


};
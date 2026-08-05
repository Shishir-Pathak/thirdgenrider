import Package from "../models/Package.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";


function toDTO(o) {

	if (!o) return null;

	return {
		id: o.id,
		title: o.title,
		location: o.location,
		duration: o.duration,
		groupSize: o.group_size,
		price: Number(o.price).toFixed(2),
		image: o.image || "",

		itinerary: o.itinerary || [],

		tripHighlights:
			o.tripHighlights || [],

		inclusions:
			o.inclusions || [],

		packageExperience:
			o.package_experience || "",

		createdAt:
			o.created_at,

		updatedAt:
			o.updated_at
	};

}





function parseItinerary(raw) {

	if (!raw) return [];

	let parsed = raw;


	if(typeof raw === "string") {

		try {
			parsed = JSON.parse(raw);
		}
		catch {

			return {
				error:"Invalid itinerary format."
			};

		}

	}



	if(!Array.isArray(parsed)) {

		return {
			error:"Itinerary must be an array."
		};

	}



	const itinerary=[];


	for(const item of parsed) {


		const dayNumber =
			item?.dayNumber?.trim() || "";


		const description =
			item?.description?.trim() || "";



		if(dayNumber && description){

			itinerary.push({
				dayNumber,
				description
			});

		}

	}



	return {
		itinerary
	};

}







function parseStringList(raw,label){


	if(!raw) return [];

	let parsed=raw;



	if(typeof raw==="string"){


		try{

			parsed=JSON.parse(raw);

		}
		catch{

			parsed =
				raw
				.split(/\r?\n/)
				.map(i=>i.trim())
				.filter(Boolean);

		}

	}



	if(!Array.isArray(parsed)){

		return {
			error:`${label} must be a list.`
		};

	}



	return {
		items:
			parsed
			.map(i=>i.trim())
			.filter(Boolean)
	};

}







function validatePackageBody(body,res){


	const title =
		body.title?.trim();


	const location =
		body.location?.trim();


	const duration =
		body.duration?.trim();



	const groupSize =
		Number(body.groupSize);



	const price =
		Number(body.price);



	const packageExperience =
		body.packageExperience?.trim() || "";





	if(!title){

		res.status(400).json({
			message:"Title is required."
		});

		return null;

	}




	if(!location){

		res.status(400).json({
			message:"Location is required."
		});

		return null;

	}



	if(!duration){

		res.status(400).json({
			message:"Duration is required."
		});

		return null;

	}




	if(!Number.isFinite(groupSize) || groupSize < 1){

		res.status(400).json({
			message:"Invalid group size."
		});

		return null;

	}




	if(!Number.isFinite(price) || price < 0){

		res.status(400).json({
			message:"Invalid price."
		});

		return null;

	}





	const itineraryResult =
		parseItinerary(body.itinerary);



	if(itineraryResult.error){

		res.status(400).json({
			message:
				itineraryResult.error
		});

		return null;

	}




	const highlightsResult =
		parseStringList(
			body.tripHighlights,
			"Trip highlights"
		);



	if(highlightsResult.error){

		res.status(400).json({
			message:
				highlightsResult.error
		});

		return null;

	}





	const inclusionsResult =
		parseStringList(
			body.inclusions,
			"Inclusions"
		);



	if(inclusionsResult.error){

		res.status(400).json({
			message:
				inclusionsResult.error
		});

		return null;

	}




	return {


		title,

		location,

		duration,

		groupSize,

		price,


		itinerary:
			itineraryResult.itinerary,


		tripHighlights:
			highlightsResult.items || [],



		inclusions:
			inclusionsResult.items || [],



		packageExperience

	};


}









export const getPackages = async(req,res)=>{


	try{


		const packages =
			await Package.findAll();



		res.json(
			packages.map(
				p=>toDTO(p)
			)
		);



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});


	}

};











export const getPackageById = async(req,res)=>{


	try{


		const pkg =
			await Package.findById(
				req.params.id
			);



		if(!pkg){

			return res.status(404).json({
				message:"Package not found."
			});

		}



		res.json(
			toDTO(pkg)
		);



	}
	catch(err){

		res.status(500).json({
			message:err.message
		});

	}

};











export const createPackage = async(req,res)=>{


	try{


		const data =
			validatePackageBody(
				req.body,
				res
			);



		if(!data) return;




		let image="";



		if(req.file?.buffer){

			image =
				await uploadImageBuffer(
					req.file.buffer
				);

		}




		const pkg =
			await Package.create({

				...data,

				image

			});



		res.status(201).json(
			toDTO(pkg)
		);



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});


	}

};









export const deletePackage = async(req,res)=>{


	try{


		const deleted =
			await Package.delete(
				req.params.id
			);



		if(!deleted){

			return res.status(404).json({
				message:"Package not found."
			});

		}



		res.status(204).send();



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});


	}

};

export const updatePackage = async (req, res) => {

	try {

		const id = req.params.id;


		const data = validatePackageBody(
			req.body,
			res
		);


		if (!data) return;



		let image;


		if (req.file?.buffer) {

			image = await uploadImageBuffer(
				req.file.buffer
			);

		}



		const updatedData = {

			...data,

			image

		};



		const updated =
			await Package.update(
				id,
				updatedData
			);



		if (!updated) {

			return res.status(404).json({
				message: "Package not found."
			});

		}



		res.json(
			toDTO(updated)
		);



	}
	catch(err){

		res.status(500).json({
			message: err.message
		});

	}

};
import SiteContent from "../models/SiteContent.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";


const DEFAULT_SITE_CONTENT = {
	homeHero: {
		title: "Rent Your Dream Bike Today",
		subtitle: "Affordable - Reliable - Comfortable",
		buttonText: "Book Now",
		imageUrl: "",
	},

	about: {
		heading: "",
		description: "",
		visionText: "",
		missionText: "",
		closingText: "",
		experienceYears: "5+",
		experienceLabel: "Years Of Experience",
		features: [],
		primaryImageUrl: "",
		secondaryImageUrl: "",
	},

	process: {
		heading: "",
		subheading: "",
		description: "",
		backgroundImageUrl: "",
		steps: [],
	},

	service: {
		heading: "",
		description: "",
		cards: [],
		statsBackgroundImageUrl: "",
		stats: [],
		reviewsHeading: "",
		reviewsDescription: "",
		reviews: [],
	}
};



function cleanText(value){
	return typeof value === "string"
		? value.trim()
		: "";
}




function normalizeFeatures(value){

	if(Array.isArray(value)){
		return value.map(cleanText).filter(Boolean);
	}


	if(typeof value === "string"){
		return value
			.split(/\r?\n/)
			.map(cleanText)
			.filter(Boolean);
	}


	return [];

}





function normalizeProcessSteps(value){

	if(!Array.isArray(value))
		return [];


	return value.map((step,index)=>({

		number:
			cleanText(step?.number)
			||
			`${String(index+1).padStart(2,"0")}.`,

		title:
			cleanText(step?.title),

		description:
			cleanText(step?.description)

	}));

}





function normalizeCards(value){

	if(!Array.isArray(value))
		return [];


	return value.map(card=>({

		icon:
			cleanText(card?.icon),

		title:
			cleanText(card?.title),

		description:
			cleanText(card?.description)

	}));

}





function normalizeStats(value){

	if(!Array.isArray(value))
		return [];


	return value.map(stat=>({

		icon:
			cleanText(stat?.icon),

		number:
			cleanText(stat?.number),

		label:
			cleanText(stat?.label)

	}));

}





function normalizeReviews(value){

	if(!Array.isArray(value))
		return [];


	return value.map(review=>({

		name:
			cleanText(review?.name),

		review:
			cleanText(review?.review)

	}));

}





function mergeWithDefaults(doc){

	const source =
		doc?.toObject
		?
		doc.toObject()
		:
		doc || {};


	return {

		id:
			source._id?.toString() || "",


		homeHero:{
			...DEFAULT_SITE_CONTENT.homeHero,
			...(source.homeHero || {})
		},


		about:{
			...DEFAULT_SITE_CONTENT.about,
			...(source.about || {})
		},


		process:{
			...DEFAULT_SITE_CONTENT.process,
			...(source.process || {})
		},


		service:{
			...DEFAULT_SITE_CONTENT.service,
			...(source.service || {})
		},


		createdAt:
			source.createdAt || null,


		updatedAt:
			source.updatedAt || null

	};

}





function buildPayload(body = {}){


	let parsedBody = body;


	if(typeof body.content === "string"){

		try{

			parsedBody = JSON.parse(body.content);

		}
		catch{

			throw new Error(
				"Invalid JSON content format."
			);

		}

	}



	const homeHero = parsedBody.homeHero || {};
	const about = parsedBody.about || {};
	const process = parsedBody.process || {};
	const service = parsedBody.service || {};



	return {


		homeHero:{

			title:
				cleanText(homeHero.title),

			subtitle:
				cleanText(homeHero.subtitle),

			buttonText:
				cleanText(homeHero.buttonText),

			imageUrl:
				cleanText(homeHero.imageUrl)

		},



		about:{

			heading:
				cleanText(about.heading),

			description:
				cleanText(about.description),

			visionText:
				cleanText(about.visionText),

			missionText:
				cleanText(about.missionText),

			closingText:
				cleanText(about.closingText),

			experienceYears:
				cleanText(about.experienceYears),

			experienceLabel:
				cleanText(about.experienceLabel),

			features:
				normalizeFeatures(about.features),

			primaryImageUrl:
				cleanText(about.primaryImageUrl),

			secondaryImageUrl:
				cleanText(about.secondaryImageUrl)

		},




		process:{

			heading:
				cleanText(process.heading),

			subheading:
				cleanText(process.subheading),

			description:
				cleanText(process.description),

			backgroundImageUrl:
				cleanText(process.backgroundImageUrl),

			steps:
				normalizeProcessSteps(process.steps)

		},




		service:{

			heading:
				cleanText(service.heading),

			description:
				cleanText(service.description),

			cards:
				normalizeCards(service.cards),

			statsBackgroundImageUrl:
				cleanText(service.statsBackgroundImageUrl),

			stats:
				normalizeStats(service.stats),

			reviewsHeading:
				cleanText(service.reviewsHeading),

			reviewsDescription:
				cleanText(service.reviewsDescription),

			reviews:
				normalizeReviews(service.reviews)

		}

	};

}





async function applyUploadedImages(payload,files){


	const images = {

		homeHeroImage:
			files?.homeHeroImage?.[0],

		aboutPrimaryImage:
			files?.aboutPrimaryImage?.[0],

		aboutSecondaryImage:
			files?.aboutSecondaryImage?.[0],

		processBackgroundImage:
			files?.processBackgroundImage?.[0],

		serviceStatsBackgroundImage:
			files?.serviceStatsBackgroundImage?.[0]

	};



	if(images.homeHeroImage?.buffer){

		payload.homeHero.imageUrl =
			await uploadImageBuffer(
				images.homeHeroImage.buffer,
				"vehicle-rental/site/home"
			);

	}



	if(images.aboutPrimaryImage?.buffer){

		payload.about.primaryImageUrl =
			await uploadImageBuffer(
				images.aboutPrimaryImage.buffer,
				"vehicle-rental/site/about"
			);

	}



	if(images.aboutSecondaryImage?.buffer){

		payload.about.secondaryImageUrl =
			await uploadImageBuffer(
				images.aboutSecondaryImage.buffer,
				"vehicle-rental/site/about"
			);

	}



	if(images.processBackgroundImage?.buffer){

		payload.process.backgroundImageUrl =
			await uploadImageBuffer(
				images.processBackgroundImage.buffer,
				"vehicle-rental/site/process"
			);

	}



	if(images.serviceStatsBackgroundImage?.buffer){

		payload.service.statsBackgroundImageUrl =
			await uploadImageBuffer(
				images.serviceStatsBackgroundImage.buffer,
				"vehicle-rental/site/service"
			);

	}

}





async function getMainContent(){

	return await SiteContent.findOne({
		key:"main"
	});

}





// GET FULL CONTENT

export const getSiteContent = async(req,res)=>{

	try{

		const doc =
			await getMainContent();


		res.json(
			mergeWithDefaults(doc)
		);


	}
	catch(error){

		res.status(500).json({
			message:error.message
		});

	}

};





// GET HOME HERO

export const getSiteContentHomeHero = async(req,res)=>{

	try{

		const doc =
			await getMainContent();


		res.json(
			mergeWithDefaults(doc).homeHero
		);


	}
	catch(error){

		res.status(500).json({
			message:error.message
		});

	}

};





// GET ABOUT

export const getSiteContentAbout = async(req,res)=>{

	try{

		const doc =
			await getMainContent();


		res.json(
			mergeWithDefaults(doc).about
		);


	}
	catch(error){

		res.status(500).json({
			message:error.message
		});

	}

};





// GET PROCESS

export const getSiteContentProcess = async(req,res)=>{

	try{

		const doc =
			await getMainContent();


		res.json(
			mergeWithDefaults(doc).process
		);


	}
	catch(error){

		res.status(500).json({
			message:error.message
		});

	}

};





// GET SERVICE

export const getSiteContentService = async(req,res)=>{

	try{

		const doc =
			await getMainContent();


		res.json(
			mergeWithDefaults(doc).service
		);


	}
	catch(error){

		res.status(500).json({
			message:error.message
		});

	}

};





// UPDATE CONTENT

export const updateSiteContent = async(req,res)=>{

	try{


		const payload =
			buildPayload(
				req.body || {}
			);



		await applyUploadedImages(
			payload,
			req.files
		);


await SiteContent.update(payload);

const doc = await SiteContent.findOne();

res.json(
    mergeWithDefaults(doc)
);


	}
	catch(error){


		console.log(
			"SITE CONTENT ERROR:",
			error
		);



		res.status(500).json({

			message:error.message

		});

	}

};
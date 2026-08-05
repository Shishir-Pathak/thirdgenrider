import Package from "../models/Package.js";
import PackageBooking from "../models/PackageBookings.js";
import { sendBookingConfirmationEmail } from "../utils/email.js";



function toDTO(o) {

	if (!o) return null;


	return {

		id: o.id,


		package: o.package_id
			? {
				id: o.package_id,
				title: o.package_title || "",
			}
			: null,


		packageTitle:
			o.package_title || "",


		customerName:
			o.customer_name,


		customerEmail:
			o.customer_email,


		customerPhone:
			o.customer_phone,


		numberOfPeople:
			o.number_of_people,


		pickupDate:
			o.pickup_date,


		returnDate:
			o.return_date,


		pickupLocation:
			o.pickup_location,


		returnLocation:
			o.return_location,


		message:
			o.message || "",


		createdAt:
			o.created_at,

		updatedAt:
			o.updated_at

	};

}





function parseDate(value){

	const date = new Date(value);

	return Number.isNaN(
		date.getTime()
	)
	? null
	: date;

}







function validateBookingBody(body,res){


	const packageId =
		body.package ||
		body.packageId;



	const customerName =
		body.customerName?.trim()
		||
		body.fullName?.trim()
		||
		"";



	const customerEmail =
		body.customerEmail?.trim()
		||
		body.email?.trim()
		||
		"";



	const customerPhone =
		body.customerPhone?.trim()
		||
		body.phone?.trim()
		||
		"";



	const numberOfPeople =
		Number(body.numberOfPeople);



	const pickupLocation =
		body.pickupLocation?.trim()
		||
		"";



	const returnLocation =
		body.returnLocation?.trim()
		||
		body.dropoffLocation?.trim()
		||
		"";



	const pickupDate =
		parseDate(body.pickupDate);



	const returnDate =
		parseDate(body.returnDate);



	const message =
		body.message?.trim()
		||
		"";





	if(!packageId){

		res.status(400).json({
			message:"Valid package is required."
		});

		return null;

	}




	if(!customerName){

		res.status(400).json({
			message:"Full name is required."
		});

		return null;

	}




	if(
		!customerEmail ||
		!/^\S+@\S+\.\S+$/.test(customerEmail)
	){

		res.status(400).json({
			message:"Valid email is required."
		});

		return null;

	}




	if(!customerPhone){

		res.status(400).json({
			message:"Phone is required."
		});

		return null;

	}





	if(
		!Number.isFinite(numberOfPeople)
		||
		numberOfPeople < 1
	){

		res.status(400).json({
			message:"Number of people must be at least 1."
		});

		return null;

	}




	if(!pickupLocation){

		res.status(400).json({
			message:"Pickup location is required."
		});

		return null;

	}




	if(!returnLocation){

		res.status(400).json({
			message:"Return location is required."
		});

		return null;

	}




	if(!pickupDate){

		res.status(400).json({
			message:"Valid pickup date is required."
		});

		return null;

	}




	if(!returnDate){

		res.status(400).json({
			message:"Valid return date is required."
		});

		return null;

	}




	if(returnDate < pickupDate){

		res.status(400).json({
			message:"Return date must be after pickup date."
		});

		return null;

	}



	return {

		package: packageId,

		customerName,

		customerEmail,

		customerPhone,

		numberOfPeople,

		pickupDate,

		returnDate,

		pickupLocation,

		returnLocation,

		message

	};


}









export const getPackageBookings = async(req,res)=>{


	try{


		const bookings =
			await PackageBooking.findAll();



		res.json(
			bookings.map(
				b=>toDTO(b)
			)
		);



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});


	}

};











export const createPackageBooking = async(req,res)=>{


	try{


		const data =
			validateBookingBody(
				req.body,
				res
			);



		if(!data) return;





		const packageExists =
			await Package.findById(
				data.package
			);



		if(!packageExists){

			return res.status(404).json({
				message:"Package not found."
			});

		}






		const booking =
			await PackageBooking.create(
				data
			);



		res.status(201).json(
			toDTO(booking)
		);





		sendBookingConfirmationEmail({

			bookingType:"Package Tour",

			itemName:
				packageExists.title,

			customerEmail:
				booking.customer_email,

			customerName:
				booking.customer_name,

			customerPhone:
				booking.customer_phone,


			pickupDate:
				booking.pickup_date,


			returnDate:
				booking.return_date,


			pickupLocation:
				booking.pickup_location,


			returnLocation:
				booking.return_location,


			numberOfPeople:
				booking.number_of_people,


			message:
				booking.message


		})
		.catch(err=>{

			console.error(
				"Email Error:",
				err
			);

		});



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});


	}

};









export const deletePackageBooking = async(req,res)=>{


	try{


		const deleted =
			await PackageBooking.delete(
				req.params.id
			);



		if(!deleted){

			return res.status(404).json({
				message:"Booking not found."
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
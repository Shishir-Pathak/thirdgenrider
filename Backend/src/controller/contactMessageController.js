import ContactMessage from "../models/ContactMessage.js";



function toDTO(o) {

	if (!o) return null;


	return {

		id: o.id,

		name: o.name,

		email: o.email,

		phone: o.phone || "",

		subject: o.subject || "",

		message: o.message,

		createdAt: o.created_at,

		updatedAt: o.updated_at

	};

}







function validateContactMessageBody(body, res) {


	const name =
		typeof body.name === "string"
			? body.name.trim()
			: "";



	const email =
		typeof body.email === "string"
			? body.email.trim()
			: "";



	const phone =
		typeof body.phone === "string"
			? body.phone.trim()
			: "";



	const subject =
		typeof body.subject === "string"
			? body.subject.trim()
			: "";



	const message =
		typeof body.message === "string"
			? body.message.trim()
			: "";






	if (!name) {

		res.status(400).json({

			message: "Name is required."

		});

		return null;

	}






	if (!email || !/^\S+@\S+\.\S+$/.test(email)) {


		res.status(400).json({

			message: "Valid email is required."

		});


		return null;

	}







	if (!message) {


		res.status(400).json({

			message: "Message is required."

		});


		return null;


	}





	return {

		name,

		email,

		phone,

		subject,

		message

	};


}









// GET ALL CONTACT MESSAGES

export const getContactMessages = async (req, res) => {


	try {


		const messages =

			await ContactMessage.findAll();



		res.json(

			messages.map(

				message => toDTO(message)

			)

		);



	}
	catch(err) {


		res.status(500).json({

			message: err.message

		});


	}


};









// CREATE CONTACT MESSAGE

export const createContactMessage = async (req, res) => {


	try {


		const data =

			validateContactMessageBody(

				req.body,

				res

			);



		if (!data) return;





		const message =

			await ContactMessage.create(

				data

			);





		res.status(201).json(

			toDTO(message)

		);



	}
	catch(err) {


		res.status(500).json({

			message: err.message

		});


	}


};









// DELETE CONTACT MESSAGE

export const deleteContactMessage = async (req, res) => {


	try {


		const { id } = req.params;



		const deleted =

			await ContactMessage.delete(

				id

			);





		if (!deleted) {


			return res.status(404).json({

				message: "Contact message not found."

			});


		}





		res.status(204).send();



	}
	catch(err) {


		res.status(500).json({

			message: err.message

		});


	}


};
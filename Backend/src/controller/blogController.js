import Blog from "../models/Blog.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";


function toDTO(o) {

	if (!o) return null;

	return {

		id: o.id,

		title: o.title,

		slug: o.slug,

		description: o.description,

		author: o.author,

		comments: o.comments || [],

		image: o.image || "",

		createdAt: o.created_at,

		updatedAt: o.updated_at

	};

}




function stripHtml(html){

	return String(html || "")
		.replace(/<[^>]*>/g," ")
		.replace(/\s+/g," ")
		.trim();

}




function parseComments(raw){

	if(!raw) return [];


	if(Array.isArray(raw)){
		return raw;
	}


	try{

		const parsed = JSON.parse(raw);

		if(Array.isArray(parsed)){
			return parsed;
		}

	}
	catch{}


	return String(raw)
		.split(/\r?\n|,/)
		.map(c=>c.trim())
		.filter(Boolean);

}





function validateBlogBody(body,res){


	body = body || {};

	const title =
		body.title?.trim() || "";


	const slug =
		body.slug?.trim() || "";


	const author =
		body.author?.trim() || "";


	const description =
		body.description || "";


	const comments =
		parseComments(body.comments);



	if(!title){

		res.status(400).json({
			message:"Title is required."
		});

		return null;
	}



	if(!slug){

		res.status(400).json({
			message:"Slug is required."
		});

		return null;
	}



	if(!author){

		res.status(400).json({
			message:"Author is required."
		});

		return null;
	}



	if(!stripHtml(description)){


		res.status(400).json({
			message:"Description is required."
		});

		return null;

	}



	return {

		title,
		slug,
		description,
		author,
		comments

	};


}








// GET ALL BLOGS

export const getBlogs = async(req,res)=>{


	try{


		const blogs =
			await Blog.findAll();



		res.json(

			blogs.map(
				blog=>toDTO(blog)
			)

		);


	}
	catch(err){

		res.status(500).json({
			message:err.message
		});

	}


};









// GET SINGLE BLOG

export const getBlogById = async(req,res)=>{


	try{


		const blog =
			await Blog.findById(
				req.params.id
			);



		if(!blog){

			return res.status(404).json({
				message:"Blog not found."
			});

		}



		res.json(
			toDTO(blog)
		);


	}
	catch(err){

		res.status(500).json({
			message:err.message
		});

	}


};









// CREATE BLOG

export const createBlog = async(req,res)=>{


	console.log("BLOG BODY:",req.body);
	console.log("BLOG FILE:",req.file);



	try{


		const data =
			validateBlogBody(
				req.body,
				res
			);



		if(!data) return;





		let image="";



		if(req.file?.buffer){


			image =
				await uploadImageBuffer(
					req.file.buffer,
					"vehicle-rental/blogs"
				);

		}




		const blog =
			await Blog.create({

				...data,

				image

			});




		res.status(201).json(

			toDTO(blog)

		);



	}
	catch(err){


		console.log(err);


		if(err.code==="ER_DUP_ENTRY"){


			return res.status(409).json({

				message:"Slug already exists."

			});

		}



		res.status(500).json({

			message:err.message

		});


	}


};









// UPDATE BLOG

export const updateBlog = async(req,res)=>{


	try{


		const data =
			validateBlogBody(
				req.body,
				res
			);



		if(!data) return;



		const updates={

			...data

		};




		if(req.file?.buffer){


			updates.image =
				await uploadImageBuffer(
					req.file.buffer,
					"vehicle-rental/blogs"
				);

		}




		const blog =
			await Blog.update(
				req.params.id,
				updates
			);



		if(!blog){

			return res.status(404).json({
				message:"Blog not found."
			});

		}



		res.json(
			toDTO(blog)
		);



	}
	catch(err){


		res.status(500).json({
			message:err.message
		});

	}


};











// DELETE BLOG

export const deleteBlog = async(req,res)=>{


	try{


		const deleted =
			await Blog.delete(
				req.params.id
			);



		if(!deleted){

			return res.status(404).json({
				message:"Blog not found."
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
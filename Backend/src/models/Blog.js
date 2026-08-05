import { pool } from "../config/db.js";


const Blog = {


	// Get all blogs
	async findAll() {


		const [blogs] = await pool.query(
			`
			SELECT *
			FROM blogs
			ORDER BY created_at DESC
			`
		);



		for (const blog of blogs) {


			const [comments] = await pool.query(
				`
				SELECT 
					id,
					comment,
					created_at

				FROM blog_comments

				WHERE blog_id = ?

				ORDER BY created_at ASC
				`,
				[blog.id]
			);



			blog.comments =
				comments.map(item => item.comment);


		}



		return blogs;


	},







	// Get blog by ID
	async findById(id) {


		const [rows] = await pool.query(
			`
			SELECT *
			FROM blogs
			WHERE id = ?
			`,
			[id]
		);



		if(!rows.length)
			return null;



		const blog = rows[0];



		const [comments] = await pool.query(
			`
			SELECT
				id,
				comment,
				created_at

			FROM blog_comments

			WHERE blog_id = ?

			ORDER BY created_at ASC
			`,
			[id]
		);



		blog.comments =
			comments.map(
				item => item.comment
			);



		return blog;


	},







	// Create blog
	async create(data) {


		const [result] = await pool.query(
			`
			INSERT INTO blogs
			(
				title,
				slug,
				description,
				author,
				image
			)

			VALUES (?, ?, ?, ?, ?)

			`,
			[
				data.title,
				data.slug,
				data.description,
				data.author,
				data.image || ""
			]
		);



		return this.findById(
			result.insertId
		);


	},







	// Update blog
	async update(id,data) {


		await pool.query(
			`
			UPDATE blogs SET

				title=?,
				slug=?,
				description=?,
				author=?,
				image=?

			WHERE id=?

			`,
			[
				data.title,
				data.slug,
				data.description,
				data.author,
				data.image || "",
				id
			]
		);



		return this.findById(id);


	},







	// Delete blog
	async delete(id) {


		const [result] = await pool.query(
			`
			DELETE FROM blogs
			WHERE id=?
			`,
			[id]
		);



		return result.affectedRows > 0;


	},







	// Add comment
	async addComment(blogId,comment){


		const [result] = await pool.query(
			`
			INSERT INTO blog_comments
			(
				blog_id,
				comment
			)

			VALUES (?,?)

			`,
			[
				blogId,
				comment
			]
		);



		return result.insertId;


	},







	// Delete comment
	async deleteComment(id){


		const [result] = await pool.query(
			`
			DELETE FROM blog_comments
			WHERE id=?
			`,
			[id]
		);



		return result.affectedRows > 0;


	}


};



export default Blog;
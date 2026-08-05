import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import request from "supertest";


process.env.Cloudinary_Cloud_Name = "test-cloud";
process.env.Cloudinary_API_Key = "test-key";
process.env.Cloudinary_API_Secret = "test-secret";

process.env.EMAIL_HOST = "127.0.0.1";
process.env.EMAIL_PORT = "9";
process.env.EMAIL_USER = "test-user";
process.env.EMAIL_PASS = "test-pass";
process.env.EMAIL_FROM = "test@example.com";
process.env.EMAIL_TO = "owner@example.com";
process.env.EMAIL_DISABLED = "true";

process.env.FRONTEND_URL =
	"http://localhost:5173";


let app;



before(async()=>{

	const appModule =
		await import("../src/app.js");


	app =
		appModule.createApp();


});



after(async()=>{

	// close mysql pool if you exported one

});



describe("API",()=>{


	it("health endpoint",async()=>{

		const res =
			await request(app)
			.get("/")
			.expect(200);


		assert.equal(
			res.text,
			"API Running"
		);

	});



	it("get bikes endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/bikes")
			.expect(200);



		assert.equal(
			Array.isArray(res.body),
			true
		);


	});



	it("get blogs endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/blogs")
			.expect(200);



		assert.equal(
			Array.isArray(res.body),
			true
		);


	});



	it("get company details endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/company-details")
			.expect(200);



		assert.ok(res.body);


	});



	it("get packages endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/packages")
			.expect(200);



		assert.equal(
			Array.isArray(res.body),
			true
		);


	});



	it("get site content endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/site-content")
			.expect(200);



		assert.ok(
			res.body
		);


	});



	it("get contact messages endpoint",async()=>{


		const res =
			await request(app)
			.get("/api/contact-messages")
			.expect(200);



		assert.equal(
			Array.isArray(res.body),
			true
		);


	});



});
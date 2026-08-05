import cloudinary, { assertCloudinaryConfigured } from "../config/cloudinary.js";

/**
 * @param {Buffer} buffer
 * @param {string} [folder]
 * @returns {Promise<string>} secure_url
 */
export function uploadImageBuffer(buffer, folder = "vehicle-rental/bikes") {
	assertCloudinaryConfigured();
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: "image" },
			(err, result) => {
				if (err) reject(err);
				else if (!result?.secure_url) {
					reject(new Error("Cloudinary upload returned no URL."));
				} else {
					resolve(result.secure_url);
				}
			},
		);
		stream.end(buffer);
	});
}
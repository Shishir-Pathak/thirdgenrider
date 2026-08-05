import nodemailer from "nodemailer";

const {
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_SECURE = "false",
	EMAIL_USER,
	EMAIL_PASS,
	EMAIL_FROM,
    EMAIL_TO,
} = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM || !EMAIL_TO) {
	console.warn(
		"Email is not fully configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, and EMAIL_TO in your .env file.",
	);
}

const transporter = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: Number(EMAIL_PORT),
	secure: EMAIL_SECURE === "true",
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
});

function buildBookingEmail({
	bookingType,
	itemName,
	customerName,
	customerEmail,
	customerPhone,
	pickupDate,
	returnDate,
	pickupLocation,
	returnLocation,
	numberOfPeople,
	message,
}) {
	const subject = `New ${bookingType} Booking`;
	const formattedPickup = new Date(pickupDate).toLocaleString();
	const formattedReturn = new Date(returnDate).toLocaleString();
	const details = [
		`Booking Type: ${bookingType}`,
		`Item: ${itemName}`,
		`Customer Name: ${customerName}`,
		`Customer Email: ${customerEmail}`,
		`Customer Phone: ${customerPhone}`,
		`Pickup: ${formattedPickup}`,
		`Return: ${formattedReturn}`,
		`Pickup Location: ${pickupLocation}`,
		`Return Location: ${returnLocation}`,
	];

	if (typeof numberOfPeople === "number") {
		details.push(`Number of People: ${numberOfPeople}`);
	}
	if (message) {
		details.push(`Message: ${message}`);
	}

	const html = `
		<h2>New ${bookingType} Booking</h2>
		<p>A new booking has been submitted. See details below:</p>
		<ul>
			${details.map((line) => `<li>${line}</li>`).join("")}
		</ul>
		<p>Thanks,<br/>Your Third Generation Rider Team</p>
	`;

	return { subject, html, text: details.join("\n") };
}

export async function sendBookingConfirmationEmail({
	bookingType,
	itemName,
	customerEmail,
	customerName,
	customerPhone,
	pickupDate,
	returnDate,
	pickupLocation,
	returnLocation,
	numberOfPeople,
	message,
}) {
	if (process.env.EMAIL_DISABLED === "true") {
		return { disabled: true };
	}

	const mailOptions = {
		from: EMAIL_FROM,
		to: EMAIL_TO,
		...buildBookingEmail({
			bookingType,
			itemName,
			customerName,
			customerEmail,
			customerPhone,
			pickupDate,
			returnDate,
			pickupLocation,
			returnLocation,
			numberOfPeople,
			message,
		}),
	};

	return transporter.sendMail(mailOptions);
}

const PDFDocument = require("pdfkit");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const ejs = require("ejs");
const streamBuffers = require("stream-buffers");
const puppeteer = require("puppeteer");
dotenv.config({
	path: "./.env",
});
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require("fs");
const imagePath = "./public/rweme_logo.png";
const contactLogoBase64Image = fs.readFileSync(imagePath, { encoding: "base64" });

async function createPDF(data, contractData) {
	const port = process.env.DEV_PORT;
	try {
		// Step 1: Render EJS Template
		const templatePath = path.join(__dirname, "../views/farmercontract.ejs");
		const baseURL = `http://localhost:${port}`;
		const htmlContent = await ejs.renderFile(templatePath, { farmer: contractData, baseURL });

		// Step 2: Convert HTML to PDF using Puppeteer
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setContent(htmlContent, { waitUntil: "networkidle0" });
		const pdfBuffer = await page.pdf({ format: "A4" });
		await browser.close();

		// Step 3: Upload the PDF buffer to Cloudinary
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "raw", public_id: `${data.fileName}.pdf` }, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});

			// Write the buffer to the upload stream
			uploadStream.end(pdfBuffer);
		});

		// Return the publicly accessible URL
		return result.secure_url;
	} catch (error) {
		console.error("Error in createPDF:", error);
		throw error;
	}
}

async function updatePDF(data, publicId) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, async (error, result) => {
			if (error) {
				reject(error);
			} else {
				try {
					const uploadResult = await createPDF(data);
					resolve(uploadResult);
				} catch (err) {
					reject(err);
				}
			}
		});
	});
}

async function deleteFile(publicId) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}
module.exports = {
	createPDF,
	updatePDF,
	deleteFile,
};

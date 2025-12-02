const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (order) => {
	return new Promise((resolve, reject) => {
		try {
			const invoicePath = path.join(
				__dirname,
				`../invoices/invoice-${order._id}.pdf`
			);
			const doc = new PDFDocument();
			doc.pipe(fs.createWriteStream(invoicePath));

			doc.fontSize(20).text("Invoice", { align: "center" });
			doc.moveDown();
			doc.fontSize(14).text(`Order ID: ${order._id}`);
			doc.text(`Customer: ${order.user.name} (${order.user.email})`);
			doc.text(`Status: ${order.status}`);
			doc.text(`Total: $${order.totalPrice}`);
			doc.moveDown();
			doc.text("Items:");
			order.items.forEach((i) => {
				doc.text(
					`${i.quantity} x ${i.item.name} @ $${i.price} = $${
						i.quantity * i.price
					}`
				);
			});

			doc.end();

			doc.on("finish", () => {
				console.log(`Invoice generated at ${invoicePath}`);
				resolve(invoicePath);
			});
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = generateInvoice;

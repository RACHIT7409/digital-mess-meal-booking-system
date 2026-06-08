const QRCode = require("qrcode");
const crypto = require("crypto");

// Generate secure random QR token
const generateQrToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate QR image as base64 string
const generateQrCode = async (qrToken) => {
  const qrData = JSON.stringify({
    qrToken,
  });

  const qrCodeImage = await QRCode.toDataURL(qrData);

  return qrCodeImage;
};

module.exports = {
  generateQrToken,
  generateQrCode,
};
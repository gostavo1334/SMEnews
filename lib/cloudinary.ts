import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzlc5aa9p',
  api_key: process.env.CLOUDINARY_API_KEY || '927441656839916',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HCCi_kt1IXs-F-3MtpmzQiM8-D0',
});

export default cloudinary;

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'hmcpifvi',
  api_key: process.env.CLOUDINARY_API_KEY || '326785964712281',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'OVwXKX0Jv3qoK-pAef_n1uP4su8',
});

export default cloudinary;

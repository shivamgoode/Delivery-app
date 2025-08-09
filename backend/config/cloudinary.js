import {v2 as cloudinary} from 'cloudinary';
const connectCloudinary = async () => {

const CLOUDINARY_CLOUD_NAME="dsustwkmh"
const CLOUDINARY_API_KEY="734787277856966"
const CLOUDINARY_API_SECRET="t9pNBeuEkVZqDuRBprCBgzJ3lNo"

  cloudinary.config({
    cloud_name: `${CLOUDINARY_CLOUD_NAME}`,
    api_key: `${CLOUDINARY_API_KEY}`,
    api_secret: `${CLOUDINARY_API_SECRET}`,
  })
}

export default connectCloudinary;

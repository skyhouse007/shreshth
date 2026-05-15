import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

/** All uploads land under this Cloudinary folder (Media Library → shreshth → …). */
export const CLOUDINARY_FOLDER_ROOT = 'shreshth';

export const cloudinaryFolders = {
  properties: `${CLOUDINARY_FOLDER_ROOT}/properties`,
  hero: `${CLOUDINARY_FOLDER_ROOT}/hero`,
  siteProjects: `${CLOUDINARY_FOLDER_ROOT}/site-projects`,
};

export const uploadBuffer = (buffer, folder = cloudinaryFolders.properties) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

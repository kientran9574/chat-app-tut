import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";
export function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

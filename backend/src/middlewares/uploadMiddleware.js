// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../lib/cloudinary";
// // Tạo storage engine cho Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "comments",
//     allowed_formats: ["jpg", "jpeg", "png", "gif"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }],
//   },
// });

// const upload = multer({ storage: storage });

// export const uploadCommentImage = upload.single("image");

// // Hàm xử lý xóa ảnh từ Cloudinary (nếu cần)
// export const deleteImageFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.error("Error deleting image from Cloudinary:", error);
//   }
// };

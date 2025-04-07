import User from "../models/users.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../index.js";
// import multer from "multer";
// import fs from "fs";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    console.log("🚀 ~ getUsersForSidebar ~ loggedInUser:", loggedInUser);
    // tìm tất cả người dùng nhưng không tìm người dùng hiện tại đang đăng nhập
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    console.log("🚀 ~ getUsersForSidebar ~ filteredUsers:", filteredUsers);
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    //  filter ra được thì nó trả ra data giữa cuộc trò chuyện 2 người này
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// xử lý video lớn
// Cấu hình multer để lưu file tạm
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === "video" && !file.mimetype.startsWith("video/")) {
//       return cb(new Error("Only video files are allowed"));
//     }
//     if (file.fieldname === "image" && !file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed"));
//     }
//     cb(null, true);
//   },
// }).fields([
//   { name: "image", maxCount: 1 },
//   { name: "video", maxCount: 1 },
// ]);
export const sendMessage = async (req, res) => {
  try {
    const { text, image, video } = req.body;
    console.log("🚀 ~ sendMessage ~ video:", video)
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    // let videoUrl;
    if (image) {
      const imageResponse = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });
      imageUrl = imageResponse.secure_url;
    }
    // if (video) {
    //   const videoResponse = await cloudinary.uploader.upload(video, {
    //     resource_type: "video",
    //   });
    //   console.log("🚀 ~ sendMessage ~ videoResponse:", videoResponse);
    //   videoUrl = videoResponse.secure_url;
    // }
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      video: video || undefined,
    });
    await newMessage.save();
    // real-time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
  }
};
// export const sendMessage = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.log("Multer error:", err.message);
//       return res
//         .status(400)
//         .json({ error: err.message || "File upload failed" });
//     }

//     try {
//       const { text } = req.body;
//       const { id: receiverId } = req.params;
//       const senderId = req.user._id;

//       let imageUrl;
//       let videoUrl;

//       // Upload image nếu có
//       if (req.files && req.files["image"]) {
//         const imageFile = req.files["image"][0];
//         const imageResponse = await cloudinary.uploader.upload(imageFile.path, {
//           resource_type: "image",
//         });
//         imageUrl = imageResponse.secure_url;
//         fs.unlinkSync(imageFile.path); // Xóa file tạm
//       }

//       // Upload video nếu có (dung lượng lớn)
//       if (req.files && req.files["video"]) {
//         const videoFile = req.files["video"][0];
//         const videoResponse = await cloudinary.uploader.upload(videoFile.path, {
//           resource_type: "video",
//           chunk_size: 6 * 1024 * 1024, // 6MB mỗi chunk để tối ưu upload lớn
//         });
//         console.log("🚀 ~ sendMessage ~ videoResponse:", videoResponse);
//         videoUrl = videoResponse.secure_url;
//         fs.unlinkSync(videoFile.path); // Xóa file tạm
//       }

//       // Tạo message mới
//       const newMessage = new Message({
//         senderId,
//         receiverId,
//         text: text || "",
//         image: imageUrl,
//         video: videoUrl,
//       });

//       await newMessage.save();

//       // Gửi real-time qua socket
//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//       }

//       res.status(201).json(newMessage);
//     } catch (error) {
//       console.log("Error in sendMessage controller:", error.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
// };

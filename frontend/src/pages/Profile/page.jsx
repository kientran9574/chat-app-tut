import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.readAsDataURL(file);

  //   reader.onload = async () => {
  //     const base64Image = reader.result;
  //     setSelectedImg(base64Image);
  //     await updateProfile({ profilePic: base64Image });
  //   };
  // };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      const result = await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8 space-y-8">
        <div className="bg-base-300 p-6 space-y-8 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                className="size-32 rounded-full object-cover  border-4"
                src={selectedImg || authUser.profilePic || `/avatar.jpg`}
              ></img>
              <label className="absolute  bottom-0 right-0 bg-base-content p-2 cursor-pointer rounded-full border border-white hover:scale-105">
                <Camera className="size-5 text-base-200"></Camera>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                ></input>
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-base-300 p-6 space-y-6 rounded-xl ">
          <h1 className="text-xl text-primary font-bold">
            Account Information:
          </h1>
          <div className="flex items-center justify-between">
            <h3 className="">Member since</h3>
            <span>{authUser.createdAt.split("T")[0]}</span>
          </div>
          <hr></hr>
          <div className="flex items-center justify-between">
            <h3 className="">Account Status</h3>
            <span className="text-green-500">Status</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;

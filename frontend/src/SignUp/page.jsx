import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "../lib/utils";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data, event) => {
    event?.preventDefault();
    try {
      await signup(data);
      navigate("/login");
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 p-8">
      <div className="flex flex-col items-center mt-40 p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center ">
            <MessageSquare className="size-5 text-primary" />
            <h1 className="text-xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free account
            </p>
          </div>
          <form
            className="w-full flex flex-col justify-center gap-4"
            onSubmit={handleSubmit(onSubmit, () => console.log(12321312))}
          >
            {/* FULLNAME */}
            <div className="form-control w-full">
              <label className="label flex items-start flex-col mb-2">
                <span className="label text-md text-white">FULLNAME:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Họ và Tên"
                  className="input w-full pl-10"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="form-control w-full">
              <label className="label flex items-start flex-col mb-2">
                <span className="label text-md text-white">EMAIL:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="input w-full pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-control w-full">
              <label className="label flex items-start flex-col mb-2">
                <span className="label text-md text-white">PASSWORD:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Mật khẩu"
                  className="input w-full pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button className="btn bg-primary mt-2" type="submit">
              Join
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;

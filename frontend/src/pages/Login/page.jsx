import React from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../lib/utils";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import { useAuthStore } from "../../store/useAuthStore";
const LoginPage = () => {
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data, event) => {
    event?.preventDefault();
    try {
      const result = await login(data);
      console.log("🚀 ~ onSubmit ~ result:", result)
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };
  return (
    <div className="grid lg:grid-cols-2 p-8">
      <div className="flex flex-col items-center mt-40 p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <MessageSquare className="size-5 text-primary" />
            <h1 className="text-xl font-bold mt-2">Login Account</h1>
          </div>
          <form
            className="w-full flex flex-col justify-center gap-4 "
            onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
          >
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
              Login
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/sign-up" className="link link-primary">
                Sign Up
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

export default LoginPage;

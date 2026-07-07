
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 
import toast, { Toaster } from "react-hot-toast";
import {  Eye, EyeOff, UploadCloud, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const uploadToImgBB = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
    
    if (!apiKey) {
      throw new Error("ImgBB API Key missing in environment file!");
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: data,
    });
    
    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("Image upload failed!");
    }
  };

  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    let localErrors = {};

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      localErrors.password = passwordError;
    }

    if (!imageFile) {
      toast.error("Please select a profile image.");
      localErrors.image = "Profile image is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      localErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(localErrors).length > 0) {
      setFormErrors(localErrors);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const imageUrl = await uploadToImgBB(imageFile);

      const signUpRes = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imageUrl,
      });

      if (signUpRes.error) {
        toast.error(signUpRes.error.message || "Registration failed.", { id: toastId });
        setLoading(false);
        return;
      }
      
      toast.loading("Logging into your workspace...", { id: toastId });
      const signInRes = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInRes.error) {
        toast.error("Account created, but auto-login failed. Redirecting to Login page...", { id: toastId });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.success("Welcome to your workspace!", { id: toastId });
        await authClient.listSessions.refresh(); 
        window.location.href = "/dashboard"; 
      }

    } catch (err) {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 text-left">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
      
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Join workspace and unlock AI-powered software design tools.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Field */}
          <div className="w-full space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Full Name *
            </label>
            <input
              required
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Email Address Field */}
          <div className="w-full space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Email Address *
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 px-3 rounded-xl border-2 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none transition-colors ${
                formErrors.email 
                  ? "border-red-500 dark:border-red-500 focus:border-red-500" 
                  : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
              }`}
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{formErrors.email}</p>
            )}
          </div>

          {/* Profile Image Field */}
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Profile Image *
            </label>
            <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed ${formErrors.image ? 'border-red-500 bg-red-50/50 dark:bg-red-950/10' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'} rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all`}>
              <div className="flex flex-col items-center justify-center py-2 text-center px-3">
                <UploadCloud className={`h-6 w-6 ${formErrors.image ? 'text-red-500' : 'text-gray-400'} mb-1`} />
                <p className={`text-xs ${formErrors.image ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'} truncate max-w-xs font-medium`}>
                  {imageFile ? imageFile.name : (formErrors.image || "Click to upload avatar file")}
                </p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  if (formErrors.image) setFormErrors({ ...formErrors, image: null });
                }}
              />
            </label>
          </div>

          {/* Password Field  */}
          <div className="w-full space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Password *
            </label>
            <div className="relative w-full">
              <input
                required
                name="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={handleChange}
                type={isVisible ? "text" : "password"}
                className={`w-full h-12 pl-3 pr-10 rounded-xl border-2 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none transition-colors ${
                  formErrors.password 
                    ? "border-red-500 dark:border-red-500 focus:border-red-500" 
                    : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                }`}
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" 
                type="button" 
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{formErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            isLoading={loading}
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 mt-2"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
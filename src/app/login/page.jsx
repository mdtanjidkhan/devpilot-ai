"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let localErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      localErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      localErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      localErrors.password = "Password is required";
    }
    if (Object.keys(localErrors).length > 0) {
      setFormErrors(localErrors);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      const response = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        toast.error(response.error.message || "Invalid email or password.", { id: toastId });
      } else {
        toast.success("Welcome back!", { id: toastId });
        await authClient.listSessions.refresh(); 
        window.location.href = "/dashboard"; 
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again.", { id: toastId });
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
              <LogIn className="h-7 w-7" />
            </div>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Log in to your workspace to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Email Address *
            </label>
            <input
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
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block pl-1">
              Password *
            </label>
            <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-12 px-3 rounded-xl border-2 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none transition-colors ${
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
          <Button
            isLoading={loading}
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 mt-2"
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
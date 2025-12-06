import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

// Validation schemas
const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .min(9, "Password must be at least 9 characters"),
});

const signupSchema = yup.object({
  fullName: yup.string().required("Name is required").min(2, "Enter a valid name"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .min(9, "Password must be at least 9 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current URL mode
  const isSignupURL = location.pathname === "/sign-up";

  const [isSignup, setIsSignup] = useState(isSignupURL);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Sync state if URL changes
    setIsSignup(isSignupURL);
  }, [isSignupURL]);

  const form = useForm({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;


  const onSubmit = async (data) => {
    try {
      // 1. Your Backend URL (from the black terminal window)
      const BASE_URL = "http://localhost:5258"; 

      // 2. Decide if we are Logging in or Signing up
      const url = isSignup 
        ? `${BASE_URL}/api/Users/` 
        : `${BASE_URL}/api/Users`;

      console.log("Sending data to:", url);

      // 3. Send the request
      const response = await axios.post(url, data);

      // 4. Handle Success
      console.log("Success!", response.data);
      alert("Success! " + (isSignup ? "Account created." : "Logged in."));
      
      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Error connecting:", error);
      alert("Failed: " + (error.response?.data?.message || error.message));
    }
  };

  const toggleMode = () => {
    if (isSignup) {
      navigate("/login");
    } else {
      navigate("/sign-up");
    }
    setIsSignup(!isSignup);
    reset();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 px-3">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden">

        <div className="lg:w-1/2 bg-blue-900 text-white p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold leading-tight">Task Flow</h1>
          <p className="text-lg mt-4 opacity-90">Manage all your tasks efficiently in one place.</p>
        </div>

        <div className="lg:w-1/2 p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            {isSignup ? "Create an Account" : "Welcome Back!"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {isSignup && (
              <Textbox
                label="Full Name"
                type="text"
                placeholder="Your Name"
                register={register("fullName")}
                error={errors.name?.message}
              />
            )}

            <Textbox
              label="Email Address"
              type="email"
              placeholder="email@gmail.com"
              register={register("email")}
              error={errors.email?.message}
            />

            <div className="relative">
              <Textbox
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="•••••••••"
                register={register("password")}
                error={errors.password?.message}
              />
              <div
                className="absolute right-4 top-13 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {!isSignup && (
              <div className="w-full flex justify-end">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-gray-500 hover:text-blue-900 cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
            )}

            <Button
              type="submit"
              label={isSignup ? "Sign Up" : "Login"}
              className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition-all"
            />
          </form>

          <p className="text-center text-gray-600 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-900 font-semibold cursor-pointer"
              onClick={toggleMode}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

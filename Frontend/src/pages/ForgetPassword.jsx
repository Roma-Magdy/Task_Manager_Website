import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log("RESET REQUEST:", data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-3">
      <div className="bg-white shadow-2xl p-10 rounded-3xl max-w-lg w-full">
        
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-5">
          Reset Your Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your email and we will send you reset instructions.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Textbox
            label="Email Address"
            type="email"
            placeholder="email@gmail.com"
            register={register("email")}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            label="Send Reset Link"
            className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition-all"
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

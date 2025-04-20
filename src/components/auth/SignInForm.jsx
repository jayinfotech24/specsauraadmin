"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Login } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [IsLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const schema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email.").required("Please enter your email."),
    password: Yup.string().required("Please enter your password.")
  });



  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const submitHandler = (data) => {
    setIsLoading(true)
    const jsonObject = {

      email: data.email,
      password: data.password

    }

    dispatch(Login(jsonObject)).then((response) => {
      console.log("res", response)
      if (response.payload.status == 200) {
        toast.success("SignIn successfully.")
        router.push("/")
        localStorage.setItem("authToken", response.payload.authToken)
        setIsLoading(false)
      }
      setIsLoading(false)
    })
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {IsLoading && <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        {/* <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link> */}
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>

            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="space-y-6   ">
                <div className="h-24">
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email"
                    {...register("email")}
                    error={!!errors.email}
                    hint={errors.email?.message}
                  />
                </div>
                <div className="h-24">
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative " >
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      error={!!errors.password}
                      hint={errors.password?.message}

                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div> */}
                  {/* <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link> */}
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"
import companyLogo from '../../assets/complogo.png';
import bgImage from '../../assets/barber-bg.jpg';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Icons } from "@/custom-components/icons";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import React from "react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LoginProps extends React.HTMLAttributes<HTMLDivElement> {}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

export function Login({ className, ...props }: LoginProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(data: any) {
    setIsLoading(true);
    axiosInstance
      .post("/auth/login", { username: data.username, password: data.password })
      .then((response) => {
        
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userdocno', response.data.userdocno);
        if (response.data.accessToken) {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error(`Error fetching:`, error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <div className="container flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 border rounded shadow">
        {/* Left section with image */}
        <div className="relative h-full flex flex-col bg-muted p-10 text-white dark:border-r lg:flex" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center text-lg font-medium h-20">
            <img src={companyLogo} alt="Spot Company Logo" className="rounded-md object-cover h-full w-auto" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;From classic to trendy, we've got your look covered.&rdquo;
              </p>
              <footer className="text-sm">#BarberKings #FreshAndClean</footer>
            </blockquote>
          </div>
        </div>

        {/* Right section with login form */}
        <div className="flex items-center justify-center p-6 lg:p-8 w-full">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center space-y-2 text-center">
              <img src={companyLogo} alt="Brand Logo" className="h-20 w-auto" /> {/* Add brand logo */}
              <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
              <p className="text-sm text-muted-foreground">Enter your username and password below to login.</p>
            </div>
            <div className={cn("grid gap-6", className)} {...props}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      {...register("username")}
                      disabled={isSubmitting}
                    />
                    {errors.username && (
                      <p className="text-red-700 text-sm text-left">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      {...register("password")}
                      disabled={isSubmitting}
                    />
                    {errors.password && (
                      <p className="text-red-700 text-sm text-left">{errors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In to continue
                  </Button>
                </div>
              </form>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

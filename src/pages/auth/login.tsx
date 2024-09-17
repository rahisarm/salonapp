"use client"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Icons } from "@/custom-components/icons";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import React from "react"

interface LoginProps extends React.HTMLAttributes<HTMLDivElement> {}

const schema=yup.object().shape({
  username:yup.string().required('Username is required'),
  password:yup.string().required('Password is required')
});

export function Login({ className, ...props }: LoginProps){

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

    const [isLoading,setIsLoading]=React.useState<boolean>(false);

    async function onSubmit(data:any) {
      
    }

    return (
      <>
      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className="md:hidden">
        
      </div>
      <div className="container relative hidden h-[300px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            SPOT
          </div>
          <div className="absolute inset-0 bg-zinc-900"></div>
          <div className="relative z-20 mt-auto">
            
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
            </div>
            <div className={cn("grid gap-6", className)} {...props}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter your username" type="text" autoCapitalize="none" autoComplete="text" autoCorrect="off" {...register("username")}
                      disabled={isSubmitting}/>
                    {errors.username && (
                      <p className="text-red-700 text-sm text-left">{errors.username.message}</p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="password">Password</Label>
                    <Input id="password" placeholder="Enter your password" type="password" autoCapitalize="none" autoComplete="off" autoCorrect="off" {...register("password")}
                      disabled={isSubmitting}/>
                    {errors.password && (
                      <p className="text-red-700 text-sm text-left">{errors.password.message}</p>
                    )}
                  </div>
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting  && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </div>
              </form>      
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
    )
}
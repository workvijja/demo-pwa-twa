"use client"

import useAuth from "@/hooks/auth/useAuth";
import {useForm} from "react-hook-form";
import {loginSchema, LoginUser} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Input} from "@/components/ui/input";

export default function LoginForm({isOpen, setIsOpenAction}: {
  isOpen: boolean,
  setIsOpenAction: (value: boolean) => void
}) {
  const {login, loginStatus} = useAuth();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = (data: LoginUser) => {
    login(data, {
      onSuccess: () => {
        form.reset()
        setIsOpenAction(false)
      }
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpenAction}>
      <DrawerContent className="h-full max-h-[75dvh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full h-full max-w-sm flex flex-col">
            <div className="overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Login</DrawerTitle>
                <DrawerDescription>
                  fill your information
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-4 p-4">
                <FormField
                  name={"email"}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="guest@example.com" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  name={"password"}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={loginStatus === "pending"}>
                {
                  loginStatus === "pending" ? (
                    <>
                      Logging in...
                      <Loader2 className="animate-spin"/>
                    </>
                  ) : "Login"
                }
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

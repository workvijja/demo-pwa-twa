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

export default function LoginForm({trigger}: { trigger: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
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
        setIsOpen(false)
      }
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-sm min-h-[75dvh] flex flex-col">
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

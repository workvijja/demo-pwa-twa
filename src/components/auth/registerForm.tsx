"use client"

import useAuth from "@/hooks/auth/useAuth";
import {useForm, useFormContext} from "react-hook-form";
import {registerSchema, RegisterUser} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Camera, Images, Loader2, Pencil} from "lucide-react";
import {Input} from "@/components/ui/input";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const AvatarInput = () => {
  const form = useFormContext();
  const username = form.watch("username");
  const avatarPreview = form.watch("avatar");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatar", reader.result as string)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative mx-auto">
      <Avatar className="h-20 w-20">
        {avatarPreview ? (
          <AvatarImage src={avatarPreview} alt="Profile" className="object-cover"/>
        ) : (
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        )}
      </Avatar>
      <div className="absolute -bottom-2 -right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="size-8 rounded-full"
            >
              <Pencil className="size-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'user';
                input.onchange = (e) => handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                input.click();
              }}
              className="cursor-pointer"
            >
              <Camera/>
              Take Photo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = false;
                input.onchange = (e) => handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                input.click();
              }}
              className="cursor-pointer"
            >
              <Images/>
              Choose from Library
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function RegisterForm({isOpen, setIsOpenAction}: {
  isOpen: boolean,
  setIsOpenAction: (value: boolean) => void
}) {
  const {register, registerStatus} = useAuth();

  const form = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "Guest User",
      email: "",
      password: "",
      avatar: ""
    }
  })

  const onSubmit = (data: RegisterUser) => {
    register(data, {
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
                <DrawerTitle>Register</DrawerTitle>
                <DrawerDescription>
                  fill your information
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-4 p-4">
                <AvatarInput/>
                <FormField
                  name={"username"}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Guest User" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
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
              <Button type="submit" disabled={registerStatus === "pending"}>
                {
                  registerStatus === "pending" ? (
                    <>
                      Registering...
                      <Loader2 className="animate-spin"/>
                    </>
                  ) : "Register"
                }
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

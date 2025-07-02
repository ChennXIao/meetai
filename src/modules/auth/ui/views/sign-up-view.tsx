"use client";

import {Card, CardContent} from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { OctagonAlertIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
}  from "@/components/ui/form";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () =>{
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });

    const router = useRouter();
    const [pending, setPending] = useState(false);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
        },
        {
            onSuccess: () => {
                setPending(false);
                router.push("/");
            },
            onError: ({error}) => {
                setError(error.message);
            },
        }
    )
    };

    return(
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col gap-y-4">
                            <h1 className="text-2xl font-semibold">Let's get started</h1>
                            <p className="text-muted-foreground">
                                create your account
                            </p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="John Doe"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPending(false);
                                                        setError(null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="name@example.com"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPending(false);
                                                        setError(null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPending(false);
                                                        setError(null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPending(false);
                                                        setError(null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full"disabled={pending}>
                                    Sign In
                                </Button>
                                {error && (
                                    <Alert variant="destructive" className="mt-4 !!destructive">
                                        <OctagonAlertIcon className="h-4 w-4" />
                                        <AlertTitle className="text-sm">{error}</AlertTitle>
                                    </Alert>
                                )}
                            </form>
                        </Form>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/sign-in" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="image" className="h-[92px] w-[92px]"/>
                        <p className="text-white text-center font-bold">
                            Meet.ai
                        </p>

                    </div>
                </CardContent>
            </Card>
            <div className="relative my-8">
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
        
    );
};

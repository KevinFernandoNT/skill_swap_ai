import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { StudyProfileForm } from "./StudyProfileForm";
import { useRegister } from '@/hooks/useAuth';

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nic: z.string().min(1, "NIC is required"),
  address: z.string().min(5, "Address is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  avatar: z.any().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Revoke object URL when preview changes or component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const registerMutation = useRegister({
    onSuccess: (data) => {
      toast({
        title: 'Account created!',
        description: "You've successfully signed up for SkillSwap.",
      });
      window.location.href = '/login';
    },
    onError: (error) => {
      toast({
        title: 'Signup failed',
        description: error?.response?.data?.message || 'Registration error',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      nic: '',
      address: '',
      password: ''
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    const formData = new FormData();
    formData.append('name', data.firstName + ' ' + data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('address', data.address);
    formData.append('phone', data.phone);
    formData.append('dob', data.dob);
    formData.append('nic', data.nic);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    registerMutation.mutate(formData);
  };

  const password = form.watch("password");
  const passwordRequirements = [
    { id: 1, label: "At least 8 characters", valid: password?.length >= 8 },
    { id: 2, label: "At least one uppercase letter", valid: /[A-Z]/.test(password || "") },
    { id: 3, label: "At least one lowercase letter", valid: /[a-z]/.test(password || "") },
    { id: 4, label: "At least one number", valid: /[0-9]/.test(password || "") },
    { id: 5, label: "At least one special character", valid: /[^A-Za-z0-9]/.test(password || "") },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">First Name</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Last Name</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" placeholder="Enter your last name" {...field} />
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
                <FormLabel className="text-gray-400 ">Email</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Phone Number</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Date of Birth</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-100 text-black" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">NIC</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" placeholder="Enter your NIC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel className="text-gray-400">Address</FormLabel>
                <FormControl>
                  <Input className="w-full bg-gray-200 text-black" placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={() => (
              <FormItem className="col-span-full">
                <FormLabel className="text-gray-400">Add a Profile Picture</FormLabel>
                <div className="flex items-center gap-4 mb-2">
                  {avatarPreview && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                      <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <FormControl>
                    <Input
                      className="w-full bg-gray-200 text-black"
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarFile(e.target.files[0]);
                          const url = URL.createObjectURL(e.target.files[0]);
                          setAvatarPreview(url);
                        } else {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel className="text-gray-400">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="w-full bg-gray-200"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Password requirements:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.id} className="text-sm flex items-center">
                        {req.valid ? (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 mr-2 text-gray-300" />
                        )}
                        <span className={req.valid ? "text-gray-700" : "text-gray-500"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full">
            <Button type="submit" className="w-full" disabled={registerMutation.status === 'pending'}>
              {registerMutation.status === 'pending' ? (
                <Loader2 className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

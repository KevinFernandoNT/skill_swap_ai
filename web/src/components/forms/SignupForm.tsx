import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

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
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to SkillSwap
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create your account to start learning and teaching skills
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <LabelInputContainer>
                  <FormLabel htmlFor="firstname" className="text-neutral-700 dark:text-neutral-300">First name</FormLabel>
                  <FormControl>
                    <Input 
                      id="firstname" 
                      placeholder="John" 
                      type="text" 
                      className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <LabelInputContainer>
                  <FormLabel htmlFor="lastname" className="text-neutral-700 dark:text-neutral-300">Last name</FormLabel>
                  <FormControl>
                    <Input 
                      id="lastname" 
                      placeholder="Doe" 
                      type="text" 
                      className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <FormLabel htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    id="email" 
                    placeholder="john@example.com" 
                    type="email" 
                    className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <FormLabel htmlFor="phone" className="text-neutral-700 dark:text-neutral-300">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    id="phone" 
                    placeholder="+1234567890" 
                    type="tel" 
                    className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <FormLabel htmlFor="dob" className="text-neutral-700 dark:text-neutral-300">Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    id="dob" 
                    type="date" 
                    className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          
          <FormField
            control={form.control}
            name="nic"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <FormLabel htmlFor="nic" className="text-neutral-700 dark:text-neutral-300">NIC</FormLabel>
                <FormControl>
                  <Input 
                    id="nic" 
                    placeholder="Enter your NIC" 
                    type="text" 
                    className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          
          <FormField
            control={form.control}
            name="avatar"
            render={() => (
              <LabelInputContainer className="mb-4">
                <FormLabel htmlFor="avatar" className="text-neutral-700 dark:text-neutral-300">Profile Picture</FormLabel>
                <div className="flex items-center gap-4 mb-2">
                  {avatarPreview && (
                    <div className="max-w-[100px] max-h-[100px] rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                      <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <FormControl>
                    <Input
                      id="avatar"
                      className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
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
              </LabelInputContainer>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <LabelInputContainer className="mb-8">
                <FormLabel htmlFor="password" className="text-neutral-700 dark:text-neutral-300">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 text-black border border-neutral-200 dark:bg-zinc-900 dark:border-neutral-700 dark:text-neutral-300"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Password requirements:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.id} className="text-sm flex items-center">
                        {req.valid ? (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 mr-2 text-neutral-300 dark:text-neutral-600" />
                        )}
                        <span className={req.valid ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <FormMessage />
              </LabelInputContainer>
            )}
          />

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={registerMutation.status === 'pending'}
          >
            {registerMutation.status === 'pending' ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              'Sign up &rarr;'
            )}
            <BottomGradient />
          </button>
        </form>
      </Form>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from '@/hooks/useAuth';

const signupSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

export const SignupForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  const {mutate: registerUser, status} = useRegister({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    const formData = new FormData();
    formData.append('name', data.firstName + ' ' + data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    registerUser(formData);
  };

  // Show loading animation when signing up
  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Creating your account...</h3>
          <p className="text-sm text-muted-foreground">Please wait while we set up your SkillSwap profile</p>
        </div>
        {/* Animated dots */}
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground block mb-2 text-sm font-medium">First Name</label>
            <Input
              type="text"
              placeholder="John"
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="text-muted-foreground block mb-2 text-sm font-medium">Last Name</label>
            <Input
              type="text"
              placeholder="Doe"
              {...register('lastName')}
            />
            {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        
        <div>
          <label className="text-muted-foreground block mb-2 text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="john@example.com"
            {...register('email')}
          />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="text-muted-foreground block mb-2 text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>
        
        <div className="flex flex-row items-center space-x-3 space-y-0">
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
                <label className="text-sm text-muted-foreground font-normal cursor-pointer">
                  I agree to the Terms and Conditions
                </label>
              </>
            )}
          />
        </div>
        {errors.agreeToTerms && <p className="text-destructive text-xs mt-1">{errors.agreeToTerms.message}</p>}
        
        <Button
          type="submit"
          className="w-full"
          disabled={status === 'pending'}
        >
          Create Account
        </Button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

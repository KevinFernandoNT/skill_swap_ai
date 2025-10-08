
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from '@/hooks/useAuth';

const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().optional(),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export const LoginForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  const {mutate: loginUser , status} = useLogin({
    onSuccess: (data) => {
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data?.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      if (data?.stream_chat_token) {
        localStorage.setItem('stream_chat_token', data.stream_chat_token);
      }
      toast({
        title: 'Login successful!',
        description: 'Welcome back to SkillSwap.',
      });
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error?.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginUser({email:data.email, password: data.password})
  };

  // Show loading animation when logging in
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
          <h3 className="text-lg font-semibold text-white mb-2">Signing you in...</h3>
          <p className="text-sm text-gray-400">Please wait while we authenticate your account</p>
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
        <div>
          <label className="text-white block mb-2 text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
            {...register('email')}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex flex-row items-center space-x-3 space-y-0">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label className="text-sm text-gray-300 font-normal cursor-pointer">
                  Remember me for 30 days
                </label>
              </>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={status === 'pending'}
        >
          Log In
        </Button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

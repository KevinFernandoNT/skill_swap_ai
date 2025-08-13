
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

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 block mb-1">Email</label>
            <Input
              className="bg-gray-200 text-black"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="text-gray-400">Password</label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                className="bg-gray-200 text-black"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
                  />
                  <label className="text-sm text-gray-400 font-normal cursor-pointer">
                    Remember me for 30 days
                  </label>
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              'Log In'
            )}
          </Button>
        </div>
      </form>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Eye, EyeOff, Loader2, Upload, X, Check } from "lucide-react";
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

interface MultiStepSignupFormProps {
  onStepChange?: (step: number) => void;
}

export const MultiStepSignupForm = ({ onStepChange }: MultiStepSignupFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

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
    trigger,
    getValues,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid image file',
          variant: 'destructive',
        });
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const nextStep = async () => {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'password', 'agreeToTerms']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = (data: SignupFormValues) => {
    const formData = new FormData();
    formData.append('name', data.firstName + ' ' + data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    if (profileImage) {
      formData.append('avatar', profileImage);
    }
    
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
    <div className="w-full">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            {currentStep > 1 ? <Check size={16} /> : '1'}
          </div>
          <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            {currentStep > 2 ? <Check size={16} /> : '2'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Basic Information</h2>
              <p className="text-gray-400 text-sm">Let's start with your basic details</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white block mb-2 text-sm font-medium">First Name</label>
                <Input
                  type="text"
                  placeholder="John"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-white block mb-2 text-sm font-medium">Last Name</label>
                <Input
                  type="text"
                  placeholder="Doe"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="text-white block mb-2 text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
                {...register('email')}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="text-white block mb-2 text-sm font-medium">Password</label>
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
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label className="text-sm text-gray-300 font-normal cursor-pointer">
                      I agree to the Terms and Conditions
                    </label>
                  </>
                )}
              />
            </div>
            {errors.agreeToTerms && <p className="text-red-400 text-xs mt-1">{errors.agreeToTerms.message}</p>}
            
            <Button
              type="button"
              onClick={nextStep}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Next Step
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Profile Picture</h2>
              <p className="text-gray-400 text-sm">Upload a profile picture to personalize your account</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}

              <div className="text-center">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors">
                    <Upload size={16} className="mr-2" />
                    {profileImage ? 'Change Picture' : 'Upload Picture'}
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={status === 'pending'}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

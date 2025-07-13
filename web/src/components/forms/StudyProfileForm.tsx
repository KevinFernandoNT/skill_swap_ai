
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PlusCircle, MinusCircle, BookOpen, User, Calendar, Headphones, MapPin } from "lucide-react";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type StudyProfileFormProps = {
  form: UseFormReturn<any>;
};

export const StudyProfileForm = ({ form }: StudyProfileFormProps) => {
  const [teachTopicsCount, setTeachTopicsCount] = useState(1);
  const [learnTopicsCount, setLearnTopicsCount] = useState(1);

  const teachTopics = form.watch("teachTopics");
  const learnTopics = form.watch("learnTopics");

  const addLearnTopic = () => {
    const currentTopics = form.getValues("learnTopics") || [];
    form.setValue("learnTopics", [
      ...currentTopics, 
      { subject: "", level: "beginner", keywords: "" }
    ]);
    setLearnTopicsCount(learnTopicsCount + 1);
  };

  const removeLearnTopic = (index: number) => {
    const currentTopics = form.getValues("learnTopics");
    if (currentTopics.length > 1) {
      form.setValue(
        "learnTopics",
        currentTopics.filter((_, i) => i !== index)
      );
      setLearnTopicsCount(learnTopicsCount - 1);
    }
  };

  const addTeachTopic = () => {
    const currentTopics = form.getValues("teachTopics") || [];
    form.setValue("teachTopics", [
      ...currentTopics, 
      { subject: "", level: "beginner", keywords: "" }
    ]);
    setTeachTopicsCount(teachTopicsCount + 1);
  };

  const removeTeachTopic = (index: number) => {
    const currentTopics = form.getValues("teachTopics");
    if (currentTopics.length > 1) {
      form.setValue(
        "teachTopics",
        currentTopics.filter((_, i) => i !== index)
      );
      setTeachTopicsCount(teachTopicsCount - 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Study Profile</h2>
        <p className="text-sm text-gray-500">Tell us about your learning goals and teaching abilities</p>
      </div>
      
      {/* What user wants to learn */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">What you want to learn</h3>
        </div>
        
        {learnTopics?.map((_, index) => (
          <div key={`learn-topic-${index}`} className="space-y-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Topic {index + 1}</h4>
              {learnTopics.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeLearnTopic(index)}
                  type="button"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`learnTopics.${index}.subject`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`learnTopics.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVEL_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name={`learnTopics.${index}.keywords`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. HTML, CSS, JavaScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLearnTopic}
          className="w-full mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Another Learning Topic
        </Button>
        
        <FormField
          control={form.control}
          name="learningPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Any specific learning preferences</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your learning style, materials you prefer, etc." 
                  {...field}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* What user can teach */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">What you can teach</h3>
        </div>
        
        {teachTopics?.map((_, index) => (
          <div key={`teach-topic-${index}`} className="space-y-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Topic {index + 1}</h4>
              {teachTopics.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeTeachTopic(index)}
                  type="button"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`teachTopics.${index}.subject`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Data Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`teachTopics.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVEL_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name={`teachTopics.${index}.keywords`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Python, Machine Learning, Statistics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTeachTopic}
          className="w-full mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Another Teaching Topic
        </Button>
        
        <FormField
          control={form.control}
          name="teachingPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Any specific teaching preferences</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your teaching style, approach, etc." 
                  {...field}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Availability and Study Type */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <FormLabel>Availability</FormLabel>
              </div>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekends" id="weekends" />
                    <FormLabel htmlFor="weekends" className="font-normal">Weekends only</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <FormLabel htmlFor="weekdays" className="font-normal">Weekdays only</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <FormLabel htmlFor="both" className="font-normal">Both weekdays and weekends</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="studyType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <FormLabel>Preferred Study Method</FormLabel>
              </div>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <FormLabel htmlFor="online" className="font-normal">Online</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <FormLabel htmlFor="physical" className="font-normal">In-person</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both_methods" id="both_methods" />
                    <FormLabel htmlFor="both_methods" className="font-normal">Both online and in-person</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Special Preferences */}
      <FormField
        control={form.control}
        name="specialPreferences"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <FormLabel>Special Preferences</FormLabel>
            </div>
            <FormControl>
              <Textarea 
                placeholder="Any other preferences for your learning/teaching experience? (e.g., teaching techniques, learning pace, etc.)" 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Onboarding() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      department: "",
      semester: "",
    },
  });

  const onSubmit = async (values) => {
    const { saveOnboarding } = useStore.getState();

    try {
      await saveOnboarding({
        department: values.department,
        semester: values.semester,
        completed: true,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      {/* Main Page Card */}
      <Card className="fixed inset-10 overflow-auto p-8">
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Left Section - Welcome */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-secondary/20 p-12 rounded-lg">
            <h1 className="text-4xl font-bold text-primary mb-4 text-center">
              Welcome to KUConnect 🎓
            </h1>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              Let’s set up your profile so we can personalize your dashboard
              with the right courses and resources.
            </p>
          </div>

          {/* Right Section - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Complete Your Setup
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Just a few details and you’re ready to go.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    {/* Department */}
                    <FormField
                      control={form.control}
                      name="department"
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="computer science">
                                Computer Science
                              </SelectItem>
                              <SelectItem value="electrical engineering">
                                Electrical Engineering
                              </SelectItem>
                              <SelectItem value="business administration">
                                Business Administration
                              </SelectItem>
                              <SelectItem value="mathematics">
                                Mathematics
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Semester */}
                    <FormField
                      control={form.control}
                      name="semester"
                      rules={{ required: "Semester is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Semester</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 8 }).map((_, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  Semester {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

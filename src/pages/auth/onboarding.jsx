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
import { useEffect, useState } from "react";
import { fetchDepartments, fetchProgramsByDepartment } from "@/apis/catalog";

export default function Onboarding() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      departmentId: "",
      programId: "",
      semester: "",
    },
  });

  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [departmentsError, setDepartmentsError] = useState("");
  const [programsError, setProgramsError] = useState("");

  useEffect(() => {
    
    let isMounted = true;
    const loadDepartments = async () => {
      setIsLoadingDepartments(true);
      setDepartmentsError("");
      try {
        const res = await fetchDepartments();
        if (isMounted) {
          setDepartments(res?.data ?? []);
        }
      } catch (e) {
        if (isMounted) setDepartmentsError("Failed to load departments");
      } finally {
        if (isMounted) setIsLoadingDepartments(false);
      }
    };
    loadDepartments();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = form.watch(async (values, { name }) => {
      if (name === "departmentId") {
        const deptId = values.departmentId;
        // Reset program selection when department changes
        form.setValue("programId", "");
        setPrograms([]);
        setProgramsError("");
        if (!deptId) return;
        setIsLoadingPrograms(true);
        try {
          const res = await fetchProgramsByDepartment(deptId);
          setPrograms(res?.data ?? []);
        } catch (e) {
          setProgramsError("Failed to load programs for department");
        } finally {
          setIsLoadingPrograms(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values) => {
    const { saveOnboarding } = useStore.getState();

    try {
      await saveOnboarding({
        department_id: values.departmentId,
        program_id: values.programId,
        semester: values.semester,
      });

      // Navigate to dashboard after successful onboarding
      console.log("Onboarding completed, navigating to dashboard...");
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
                      name="departmentId"
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            disabled={isLoadingDepartments}
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={isLoadingDepartments ? "Loading departments..." : "Select your department"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {departmentsError ? (
                            <p className="text-sm text-destructive mt-1">{departmentsError}</p>
                          ) : null}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Program */}
                    <FormField
                      control={form.control}
                      name="programId"
                      rules={{ required: "Program is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <Select
                            disabled={!form.watch("departmentId") || isLoadingPrograms}
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    !form.watch("departmentId")
                                      ? "Select department first"
                                      : isLoadingPrograms
                                      ? "Loading programs..."
                                      : programs.length === 0
                                      ? "No programs found"
                                      : "Select your program"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programs.map((prog) => (
                                <SelectItem key={prog.id} value={prog.id}>
                                  {prog.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {programsError ? (
                            <p className="text-sm text-destructive mt-1">{programsError}</p>
                          ) : null}
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

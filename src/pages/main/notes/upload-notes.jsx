import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import * as z from "zod";
import { useState } from "react";
import Loader from "@/components/loader";
import { useForm } from "react-hook-form";
import { uploadNote } from "@/apis/notes";
import AppLayout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import DropzoneWithPreview from "@/components/dropzone";
import { useNavigate, useParams } from "react-router-dom";

// Validation schema
const formSchema = z.object({
  title: z.string().min(1, "Course Title is required"),
  topic: z.string().optional(),
  semester: z.string().min(1, "Semester is required"),
  noteType: z.enum(["self", "inclass"]),
  description: z.string().optional(),
  tags: z.string().optional(),
  language: z.string().optional(),
});

export default function UploadNotes() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "",
      semester: "",
      noteType: "self",
      description: "",
      tags: "",
      language: "",
    },
  });

  const onSubmit = async (values) => {
    if (!files.length) {
      setError("Please select a file.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", files[0]);

      const res = await uploadNote(courseId || "default-course", formData);
      if (res?.success) {
        navigate(`/courses/${courseId}/notes`);
      } else {
        setError(res?.error || "Upload failed.");
      }
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="px-8 py-10">
        <h1 className="text-3xl font-bold text-primary">Upload your notes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic/Chapter</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>{`Semester ${
                            i + 1
                          }`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note type</FormLabel>
                    <div className="flex gap-6">
                      <label className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="self"
                          checked={field.value === "self"}
                          onChange={() => field.onChange("self")}
                        />
                        <span>Self-prepared</span>
                      </label>
                      <label className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="inclass"
                          checked={field.value === "inclass"}
                          onChange={() => field.onChange("inclass")}
                        />
                        <span>In-class lecture</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit">Upload</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>

          {/* Dropzone */}
          <DropzoneWithPreview
            files={files}
            setFiles={setFiles}
            setError={setError}
          />
        </div>
      </div>
    </AppLayout>
  );
}

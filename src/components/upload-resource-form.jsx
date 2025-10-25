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
import AppLayout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import DropzoneWithPreview from "@/components/dropzone";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { uploadResource } from "@/apis/resource";

// Validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  course_id: z.string().min(1, "Course is required"),
  type: z.string().min(1, "Type is required"),
  url: z.string().optional(),
});

export default function UploadResourceForm({ resourceType = "doc" }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courses } = useStore((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState(
    resourceType === "video" ? "url" : "file"
  ); // "file" or "url"

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      course_id: "",
      type: resourceType, // "doc" for notes, "video" for videos
      url: "",
    },
  });

  const onSubmit = async (values) => {
    // Validate that either file or URL is provided, not both
    if (uploadMethod === "file" && !files.length) {
      setError("Please select a file.");
      return;
    }
    if (uploadMethod === "url" && !values.url) {
      setError("Please provide a URL.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Add required fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("course_id", values.course_id);
      formData.append("type", values.type);

      // Add either file or URL
      if (uploadMethod === "file") {
        formData.append("file", files[0]);
      } else {
        formData.append("url", values.url);
      }

      // Use unified resource API
      const res = await uploadResource(formData);

      if (res?.success) {
        // Navigate back to the appropriate page
        if (resourceType === "doc") {
          navigate(`/courses/${courseId}/notes`);
        } else {
          navigate(`/courses/${courseId}/lectures`);
        }
      } else {
        setError(res?.error || "Upload failed.");
      }
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-8 py-10">
        <h1 className="text-3xl font-bold text-primary">
          Upload your {resourceType === "doc" ? "notes" : "video lectures"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Upload Method Selection */}
              <div className="space-y-2">
                <FormLabel>Upload Method</FormLabel>
                <div className="flex gap-6">
                  {/* If the resource is a video, force URL mode and disable file upload */}
                  {resourceType === "video" ? (
                    <>
                      <label className="flex gap-2 items-center" title="Disabled for videos">
                        <input type="radio" value="file" disabled />
                        <span className="text-gray-400" >
                          Upload File 
                        </span>
                      </label>
                      <label className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="url"
                          checked={uploadMethod === "url"}
                          onChange={() => setUploadMethod("url")}
                        />
                        <span>Provide URL</span>
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="file"
                          checked={uploadMethod === "file"}
                          onChange={() => setUploadMethod("file")}
                        />
                        <span>Upload File</span>
                      </label>
                      <label className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="url"
                          checked={uploadMethod === "url"}
                          onChange={() => setUploadMethod("url")}
                        />
                        <span>Provide URL</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter resource title" />
                    </FormControl>
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
                      <Input {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL Field - only show when URL method is selected */}
              {uploadMethod === "url" && (
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/resource"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Type field - hidden but required */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit">
                  Upload {resourceType === "doc" ? "Notes" : "Video"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>

          {/* Dropzone - only show when file method is selected */}
          {uploadMethod === "file" && (
            <DropzoneWithPreview
              files={files}
              setFiles={setFiles}
              setError={setError}
            />
          )}

          {/* URL Preview - only show when URL method is selected */}
          {uploadMethod === "url" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex justify-center items-center bg-white">
              <div className="text-gray-500">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  You can provide a URL to an external resource
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDFs, Videos, Documents, etc.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

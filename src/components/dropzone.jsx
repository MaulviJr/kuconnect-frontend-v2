import { useCallback } from "react";
import { Trash } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export default function DropzoneWithPreview({ files, setFiles, setError }) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles && rejectedFiles.length) {
        const rej = rejectedFiles[0];
        if (rej.size > MAX_FILE_SIZE) {
          setError("File is too large. Max 25MB.");
        } else {
          setError("Invalid file type.");
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          setError("File too large (max 25MB).");
          return;
        }
        setFiles([file]); // only allow 1 file
      }
    },
    [setFiles, setError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${
      ["B", "KB", "MB", "GB"][i]
    }`;
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 min-h-[260px] flex flex-col items-center justify-center text-center transition
          ${
            isDragActive
              ? "border-green-700 bg-green-50"
              : "border-green-400 bg-white"
          }`}>
        <input {...getInputProps()} />
        <p className="text-lg font-medium">
          Drop your files here or click to upload
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          (PDF, DOCX, JPG, PNG - Max size 25MB)
        </p>
      </div>

      {/* Preview list */}
      <div className="mt-4 space-y-2">
        {files.map((f, idx) => (
          <div
            key={f.name + idx}
            className="flex items-center justify-between border rounded-md p-2">
            <div className="flex items-center gap-3">
              {f.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-green-50 text-green-600 rounded">
                  DOC
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatBytes(f.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(URL.createObjectURL(f), "_blank")}>
                Preview
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeFile(idx)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

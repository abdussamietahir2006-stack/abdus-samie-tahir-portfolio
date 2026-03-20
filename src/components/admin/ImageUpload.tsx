import React, { useState, useCallback } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { apiUploadImage } from "../../utils/api";

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onUploadSuccess, label }) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleUpload = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    setUploading(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiUploadImage(formData);
      onUploadSuccess(response.data.url);
      setStatus("success");
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>}
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {currentImage && (
          <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
            <img 
              src={currentImage.startsWith("http") ? currentImage : `${currentImage}`} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = "https://picsum.photos/seed/error/400/400";
              }}
            />
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`flex-grow w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
            status === "success" ? "border-emerald-500/50 bg-emerald-500/5" :
            status === "error" ? "border-red-500/50 bg-red-500/5" :
            "border-white/10 hover:border-fuchsia-500/50 bg-white/5"
          }`}
        >
          <input
            type="file"
            onChange={onSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-fuchsia-500 animate-spin" size={24} />
              <span className="text-xs text-slate-400">Uploading...</span>
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="text-emerald-500" size={24} />
              <span className="text-xs text-emerald-400">Upload Successful</span>
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="text-red-500" size={24} />
              <span className="text-xs text-red-400">Upload Failed</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-slate-400" size={24} />
              <span className="text-xs text-slate-400">Drag & drop or click to upload</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

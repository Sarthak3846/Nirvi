"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { useSessionStore } from "@/state/session";
import { toast } from "sonner";
import { Alert } from "@heroui/react";
import Image from "next/image";
import { Bug } from "lucide-react";

export function ReportIssueButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSessionStore((state) => state.session?.user);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      setImageError("Image size must be less than 1MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          screenshot: uploadedImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit issue");
      }

      toast.success("Issue reported successfully");
      setDescription("");
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setOpen(false);
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="shadow-lg sm:px-4 sm:py-2 px-2 py-2 text-xs sm:text-sm h-8 sm:h-10"
        size="sm"
      >
        <Bug className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
        <span className="hidden sm:inline">Report Issue</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Tell us about the issue</Label>
              <Textarea
                id="description"
                placeholder="Describe what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image (Max 1MB)</Label>
              <input
                ref={fileInputRef}
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {imageError && (
                <Alert description={imageError} />
              )}
              {uploadedImage && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <Image 
                    src={uploadedImage} 
                    alt="Uploaded preview" 
                    className="max-h-32 rounded-md border" 
                    width={200}
                    height={150}
                  />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSubmit}
              className="w-full"
              disabled={!description.trim() || loading || !uploadedImage}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

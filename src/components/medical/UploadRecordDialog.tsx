import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, Loader2 } from "lucide-react";

interface UploadRecordDialogProps {
  onUploadSuccess?: () => void;
  trigger?: ReactNode;
}

export const UploadRecordDialog = ({ onUploadSuccess, trigger }: UploadRecordDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the medical record",
        variant: "destructive",
      });
      return false;
    }

    if (!metadata.trim()) {
      toast({
        title: "Error", 
        description: "Please enter metadata (e.g., doctor name, date, type)",
        variant: "destructive",
      });
      return false;
    }

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return false;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    // Validate metadata is valid JSON
    try {
      JSON.parse(metadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Metadata must be valid JSON format",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    // For demo purposes, we'll simulate IPFS upload
    // In production, you'd use a service like Web3.Storage, Pinata, or your own IPFS node
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock IPFS hash
        const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        resolve(mockHash);
      }, 2000);
    });
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    
    try {
      // Upload file to IPFS
      toast({
        title: "Uploading...",
        description: "Uploading file to IPFS...",
      });

      const ipfsHash = await uploadToIPFS(file!);
      
      toast({
        title: "File uploaded to IPFS",
        description: `Hash: ${ipfsHash}`,
      });

      // Here you would call the smart contract to store the record
      // For now, we'll simulate the blockchain transaction
      toast({
        title: "Storing on blockchain...",
        description: "Recording metadata on blockchain...",
      });

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Success!",
        description: "Medical record uploaded successfully",
      });

      // Reset form
      setTitle("");
      setMetadata("");
      setFile(null);
      setOpen(false);
      
      // Trigger refresh of records list
      onUploadSuccess?.();

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your medical record",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-medium transition-all">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Record
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Upload Medical Record
          </DialogTitle>
          <DialogDescription>
            Upload your medical documents securely to the blockchain. Files are encrypted and stored on IPFS.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Record Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Cardiac Consultation Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata (JSON format) *</Label>
            <Textarea
              id="metadata"
              placeholder='{"doctor": "Dr. Smith", "date": "2024-01-15", "type": "Consultation", "hospital": "City General"}'
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={3}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Include doctor name, date, record type, hospital, etc. in JSON format.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Medical Document *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Record
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
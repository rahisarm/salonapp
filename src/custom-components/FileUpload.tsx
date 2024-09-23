import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';

interface FileUploadProps {
  
  refdocno: string;
  refdtype: string;
  onFileUpload: (file: File, refdocno: string, refdtype: string) => void; // Callback for file upload
  openstatus?:boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ refdocno, refdtype, onFileUpload ,openstatus=false}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isOpen,setIsOpen]=useState<boolean>(openstatus);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile, refdocno, refdtype);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a File</DialogTitle>
          <DialogDescription>Upload a file for document no: {refdocno} and document type: {refdtype}</DialogDescription>
        </DialogHeader>
        <input type="file" onChange={handleFileChange} />
        <Button disabled={!selectedFile} onClick={handleUploadClick}>
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FileUpload;

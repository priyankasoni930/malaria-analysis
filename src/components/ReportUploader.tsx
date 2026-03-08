import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, Loader2 } from "lucide-react";

interface ReportUploaderProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
}

const ReportUploader = ({ onFileSelected, isAnalyzing }: ReportUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    setFileName(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileImage className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{fileName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {isAnalyzing ? "Analyzing..." : "Uploaded"}
                    </p>
                  </div>
                </div>
                {!isAnalyzing && (
                  <button
                    onClick={clearFile}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="rounded-md overflow-hidden bg-secondary border border-border flex items-center justify-center">
                <img src={preview} alt="Cell image" className="max-h-60 object-contain w-full" />
              </div>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-xs text-primary"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting parasites...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`
              cursor-pointer block rounded-lg border border-dashed p-10
              transition-all duration-200 text-center
              ${dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 bg-card"
              }
            `}
          >
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Upload cell image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag & drop or <span className="text-primary">browse</span> · PNG, JPG
                </p>
              </div>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportUploader;

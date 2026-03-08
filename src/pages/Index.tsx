import { useState } from "react";
import { motion } from "framer-motion";
import { Microscope, Zap, Shield, ScanEye } from "lucide-react";
import ReportUploader from "@/components/ReportUploader";
import AnalysisResult from "@/components/AnalysisResult";
import { analyzeMalariaCell } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelected = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeMalariaCell(base64, file.type);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ScanEye className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">MalaCheck</span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Detect malaria from <span className="text-primary">cell images</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Upload a microscopic blood smear image and our AI will detect whether malaria parasites are present.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mt-5 mb-10"
        >
          {[
            { icon: Microscope, label: "Parasite detection" },
            { icon: Zap, label: "Results in seconds" },
            { icon: Shield, label: "Species identification" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground"
            >
              <f.icon className="w-3.5 h-3.5 text-primary" />
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* Stacked layout: Upload then Results */}
        <div className="space-y-6">
          <ReportUploader onFileSelected={handleFileSelected} isAnalyzing={isAnalyzing} />
          {result && <AnalysisResult result={result} />}
        </div>

        {!result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 p-4 rounded-lg border border-border bg-card"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">How it works:</strong> Upload a microscopic blood smear image (thin or thick smear). 
              The AI analyzes cell morphology to detect Plasmodium parasites and identify the species. 
              Results are for informational purposes only — always consult a healthcare professional.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;

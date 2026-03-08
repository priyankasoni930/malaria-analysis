import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AnalysisResultProps {
  result: string;
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
  const lower = result.toLowerCase();
  const isPositive = lower.includes("positive");
  const isNegative = lower.includes("negative") && !isPositive;

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="text-xs font-semibold uppercase tracking-wider text-primary mt-5 mb-2 first:mt-0">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={i} className="text-sm font-bold text-foreground mt-5 mb-2 first:mt-0">
            {line.slice(2)}
          </h2>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-sm text-muted-foreground ml-3 mb-1 list-disc marker:text-primary/50">
            {renderInline(line.slice(2))}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="text-sm text-muted-foreground ml-3 mb-1 list-decimal marker:text-primary/50">
            {renderInline(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-sm text-muted-foreground mb-1 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Status */}
      <div
        className={`rounded-lg p-3 mb-3 flex items-start gap-2.5 border ${
          isPositive
            ? "border-destructive/20 bg-destructive/5"
            : isNegative
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-card"
        }`}
      >
        {isPositive ? (
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
        ) : isNegative ? (
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isPositive ? "Malaria Detected" : isNegative ? "No Malaria Detected" : "Analysis Complete"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isPositive
              ? "Parasites found — consult a doctor immediately."
              : isNegative
              ? "No parasites found in this sample."
              : "Review findings below."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4">{renderContent(result)}</div>
        <div className="px-4 pb-4">
          <div className="rounded-md bg-secondary p-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ⚠️ AI-assisted analysis only. Not a medical diagnosis. Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;

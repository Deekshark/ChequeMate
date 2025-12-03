import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraView } from "@/components/camera-view";
import { ExtractionForm } from "@/components/extraction-form";
import { mockChequeData } from "@/lib/mockData";
import { CheckCircle2, ArrowRight, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "idle" | "scanning" | "review" | "success";

export default function Scanner() {
  const [step, setStep] = useState<Step>("idle");
  
  // Handlers
  const handleCapture = () => {
    setStep("scanning");
    // Simulate OCR delay
    setTimeout(() => {
      setStep("review");
    }, 2500);
  };

  const handleConfirm = (data: any) => {
    console.log("Processed Data:", data);
    setStep("success");
  };

  const handleRetake = () => {
    setStep("idle");
  };

  const handleReset = () => {
    setStep("idle");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">AutoCheque <span className="font-normal text-slate-400">Pro</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className={step === "idle" || step === "scanning" ? "text-primary" : ""}>1. Scan</span>
            <ArrowRight className="w-4 h-4" />
            <span className={step === "review" ? "text-primary" : ""}>2. Review</span>
            <ArrowRight className="w-4 h-4" />
            <span className={step === "success" ? "text-primary" : ""}>3. Complete</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* STATE: IDLE & SCANNING */}
          {(step === "idle" || step === "scanning") && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Scan Document</h2>
                <p className="text-slate-500 text-lg">Place the cheque within the frame and ensure good lighting.</p>
              </div>
              
              <CameraView 
                isScanning={step === "scanning"} 
                onCapture={handleCapture} 
              />
              
              <div className="mt-8 flex justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Auto-Focus Ready
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  OCR Engine Online
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE: REVIEW */}
          {step === "review" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <ExtractionForm 
                initialData={mockChequeData} 
                onConfirm={handleConfirm}
                onRetake={handleRetake}
              />
            </motion.div>
          )}

          {/* STATE: SUCCESS */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center pt-12"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Processing Complete</h2>
              <p className="text-slate-500 text-lg mb-8">
                The document has been successfully scanned, verified, and sent to the core banking system.
              </p>
              
              <div className="bg-white border rounded-xl p-6 shadow-sm mb-8 text-left">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 text-sm uppercase font-bold tracking-wider">Transaction ID</span>
                  <span className="font-mono text-slate-900">TXN-8829-221</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm uppercase font-bold tracking-wider">Status</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">Authorized</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="w-5 h-5" />
                  Print Receipt
                </Button>
                <Button 
                  size="lg" 
                  className="h-14 px-8 bg-primary hover:bg-primary/90"
                  onClick={handleReset}
                >
                  Scan Next Document
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

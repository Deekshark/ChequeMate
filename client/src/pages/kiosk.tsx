import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Keyboard, 
  Mic, 
  CreditCard, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  PenTool
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChequePreview } from "@/components/cheque-preview";

// --- Schemas & Types ---
const formSchema = z.object({
  payeeName: z.string().min(2, "Payee name is required"),
  amountFigures: z.string().min(1, "Amount is required"),
  amountWords: z.string().min(5, "Amount in words is required"),
  date: z.string().min(1, "Date is required"),
  accountNumber: z.string().min(8, "Account number is required"),
});

type FormData = z.infer<typeof formSchema>;

type Step = "input-selection" | "manual-entry" | "voice-entry" | "preview" | "printing" | "complete";

// --- Main Component ---
export default function ChequeKiosk() {
  const [step, setStep] = useState<Step>("input-selection");
  const [formData, setFormData] = useState<FormData>({
    payeeName: "",
    amountFigures: "",
    amountWords: "",
    date: new Date().toISOString().split('T')[0],
    accountNumber: "1234-5678-9012" // Default for demo
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const handleManualSubmit = (data: FormData) => {
    setFormData(data);
    setStep("preview");
  };

  const handlePrint = () => {
    setStep("printing");
    setTimeout(() => {
      setStep("complete");
    }, 4500); // Match animation duration
  };

  const handleReset = () => {
    setStep("input-selection");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-20 flex items-center shadow-sm">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight leading-none">SmartPrint</h1>
              <p className="text-xs text-slate-500 font-medium">Automated Cheque Filler</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <StepIndicator active={["input-selection", "manual-entry", "voice-entry"].includes(step)} label="1. Input" />
            <ArrowRight className="w-4 h-4" />
            <StepIndicator active={["preview", "printing"].includes(step)} label="2. Review" />
            <ArrowRight className="w-4 h-4" />
            <StepIndicator active={step === "complete"} label="3. Print" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT INPUT METHOD */}
          {step === "input-selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">How would you like to enter details?</h2>
              <p className="text-slate-500 text-xl text-center mb-12">Choose a method to fill your cheque automatically.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputOption 
                  icon={<Keyboard className="w-8 h-8" />} 
                  title="Manual Entry" 
                  desc="Type details on screen"
                  onClick={() => setStep("manual-entry")}
                />
                <InputOption 
                  icon={<Mic className="w-8 h-8" />} 
                  title="Voice Input" 
                  desc="Speak to fill details"
                  onClick={() => setStep("voice-entry")} 
                  isBeta
                />
                <InputOption 
                  icon={<CreditCard className="w-8 h-8" />} 
                  title="Bank Card" 
                  desc="Scan card for account info"
                  onClick={() => {}} 
                  disabled
                />
                <InputOption 
                  icon={<QrCode className="w-8 h-8" />} 
                  title="QR Scan" 
                  desc="Scan from mobile app"
                  onClick={() => {}} 
                  disabled
                />
              </div>
            </motion.div>
          )}

          {/* STEP 1B: MANUAL ENTRY FORM */}
          {step === "manual-entry" && (
            <motion.div
              key="manual-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Enter Cheque Details</h2>
                <Button variant="ghost" onClick={() => setStep("input-selection")}>Cancel</Button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="payeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ramesh Kumar" className="h-12 text-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="amountFigures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="3500" type="number" className="h-12 text-lg font-mono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" className="h-12 text-lg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="amountWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount in Words</FormLabel>
                        <FormControl>
                          <Input placeholder="Three Thousand Five Hundred Only" className="h-12 text-lg italic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input className="h-12 text-lg font-mono bg-slate-50" readOnly {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold mt-4">
                    Preview Cheque
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {/* STEP 1C: VOICE ENTRY (MOCK) */}
          {step === "voice-entry" && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center pt-12"
            >
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <Mic className="w-16 h-16 text-primary relative z-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Listening...</h2>
              <p className="text-slate-500 mb-8">Please say the Payee Name and Amount clearly.</p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Mock voice fill
                  form.setValue("payeeName", "Priya Sharma");
                  form.setValue("amountFigures", "12000");
                  form.setValue("amountWords", "Twelve Thousand Rupees Only");
                  setStep("manual-entry");
                }}
              >
                Simulate "Pay Priya 12000"
              </Button>
            </motion.div>
          )}

          {/* STEP 2 & 3: PREVIEW & PRINTING */}
          {(step === "preview" || step === "printing") && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  {step === "printing" ? "Printing Cheque..." : "Review Before Printing"}
                </h2>
                <p className="text-slate-500 text-lg">
                  {step === "printing" ? "Please wait while the machine prints your details." : "Ensure all details are correct. This will be printed directly on the cheque."}
                </p>
              </div>

              <div className="mb-8 transform scale-100 hover:scale-[1.02] transition-transform duration-500">
                <ChequePreview data={formData} isPrinting={step === "printing"} />
              </div>

              {step === "preview" && (
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8"
                    onClick={() => setStep("manual-entry")}
                  >
                    Edit Details
                  </Button>
                  <Button 
                    size="lg" 
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg shadow-lg hover:shadow-xl shadow-primary/25"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 w-5 h-5" />
                    Confirm & Print
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: COMPLETE */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center pt-12"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Printing Complete!</h2>
              <p className="text-slate-500 text-lg mb-8">
                Your cheque has been printed with precision. Please collect it from the tray below.
              </p>
              <Button 
                size="lg" 
                className="h-14 px-8"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 w-5 h-5" />
                Process Another Cheque
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Helper Components ---

function InputOption({ icon, title, desc, onClick, disabled, isBeta }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-200
        ${disabled 
          ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" 
          : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
        }
      `}
    >
      <div className={`mb-6 p-4 rounded-full transition-colors ${disabled ? "bg-slate-200 text-slate-400" : "bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white"}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
      
      {isBeta && (
        <span className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full">
          AI BETA
        </span>
      )}
    </button>
  );
}

function StepIndicator({ active, label }: { active: boolean, label: string }) {
  return (
    <span className={`transition-colors duration-300 ${active ? "text-primary font-bold" : "text-slate-400"}`}>
      {label}
    </span>
  );
}

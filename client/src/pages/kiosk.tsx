import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { 
  Keyboard, 
  Mic, 
  CreditCard, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  PenTool,
  Edit3,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChequePreview } from "@/components/cheque-preview";
import { numberToWords } from "@/lib/numberConverter";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
    accountNumber: "1234 5678 9012"
  });

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: "onChange"
  });

  // API mutation for saving cheque records
  const saveChequeRecord = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/cheque-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save record");
      return response.json();
    },
    onError: () => {
      toast({
        title: "Warning",
        description: "Cheque printed but audit record failed to save.",
        variant: "destructive",
      });
    },
  });

  // Auto-fill effect
  const amountValue = form.watch("amountFigures");
  useEffect(() => {
    if (amountValue) {
      const words = numberToWords(amountValue);
      if (words) {
        form.setValue("amountWords", words, { shouldValidate: true });
      }
    }
  }, [amountValue, form]);

  const handleManualSubmit = (data: FormData) => {
    setFormData(data);
    setStep("preview");
  };

  const handlePrint = () => {
    setStep("printing");
    
    // Save to database for audit trail
    saveChequeRecord.mutate(formData);
    
    // Simulate print duration
    setTimeout(() => {
      setStep("complete");
    }, 5000);
  };

  const handleReset = () => {
    setStep("input-selection");
    form.reset({
        payeeName: "",
        amountFigures: "",
        amountWords: "",
        date: new Date().toISOString().split('T')[0],
        accountNumber: "1234 5678 9012"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-20 flex items-center shadow-sm">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep("input-selection")}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight leading-none">SmartPrint</h1>
              <p className="text-xs text-slate-500 font-medium">Automated Cheque Filler</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
            <StepIndicator active={["input-selection", "manual-entry", "voice-entry"].includes(step)} label="1. Input Details" />
            <ArrowRight className="w-4 h-4" />
            <StepIndicator active={["preview", "printing"].includes(step)} label="2. Review & Print" />
            <ArrowRight className="w-4 h-4" />
            <StepIndicator active={step === "complete"} label="3. Collect Cheque" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-12">
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
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Welcome back.</h2>
                <p className="text-slate-500 text-xl">How would you like to fill your cheque today?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <InputOption 
                  icon={<Keyboard className="w-10 h-10" />} 
                  title="Manual Entry" 
                  desc="Type details using the touchscreen"
                  onClick={() => setStep("manual-entry")}
                  primary
                />
                <InputOption 
                  icon={<Mic className="w-10 h-10" />} 
                  title="Voice Assistant" 
                  desc="Simply speak to fill details"
                  onClick={() => setStep("voice-entry")} 
                  isBeta
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 max-w-4xl mx-auto opacity-60">
                 <InputOption 
                  icon={<CreditCard className="w-6 h-6" />} 
                  title="Bank Card" 
                  desc="Insert card to fetch details"
                  onClick={() => {}} 
                  disabled
                  small
                />
                <InputOption 
                  icon={<QrCode className="w-6 h-6" />} 
                  title="Scan QR" 
                  desc="Use mobile banking app"
                  onClick={() => {}} 
                  disabled
                  small
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
              className="max-w-3xl mx-auto"
            >
              <Card className="border-none shadow-xl bg-white overflow-hidden">
                <div className="bg-slate-50 border-b px-8 py-6 flex items-center justify-between">
                  <div>
                     <h2 className="text-2xl font-bold text-slate-800">Cheque Details</h2>
                     <p className="text-slate-500">Please fill in the required information</p>
                  </div>
                  <Button variant="ghost" onClick={() => setStep("input-selection")}>Cancel</Button>
                </div>

                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-8">
                      
                      {/* Payee & Date Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="payeeName"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-base font-semibold text-slate-700">Pay To (Name)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. John Smith" className="h-14 text-lg" {...field} />
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
                              <FormLabel className="text-base font-semibold text-slate-700">Date</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-14 text-lg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Amount Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <FormField
                          control={form.control}
                          name="amountFigures"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold text-slate-700">Amount (₹)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                  <Input 
                                    placeholder="0.00" 
                                    type="number" 
                                    className="h-14 pl-10 text-xl font-mono font-bold tracking-wide" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="amountWords"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-base font-semibold text-slate-700 flex justify-between">
                                <span>Amount in Words</span>
                                <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Auto-filled</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Amount in words will appear here..." 
                                  className="h-14 text-lg italic bg-white" 
                                  readOnly 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-slate-700">From Account</FormLabel>
                            <FormControl>
                              <Input className="h-14 text-lg font-mono bg-slate-50 text-slate-500" readOnly {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full h-16 text-xl font-bold shadow-lg hover:shadow-xl transition-all">
                          Review & Print <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
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
              <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 relative cursor-pointer hover:bg-primary/10 transition-colors">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75" />
                <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse" />
                <Mic className="w-16 h-16 text-primary relative z-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Listening...</h2>
              <p className="text-slate-500 mb-12 text-lg">Try saying: <br/><span className="font-semibold text-slate-900">"Pay Ramesh Kumar 5000 Rupees"</span></p>
              
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full"
                onClick={() => {
                  form.setValue("payeeName", "Ramesh Kumar");
                  form.setValue("amountFigures", "5000");
                  setStep("manual-entry");
                }}
              >
                Simulate Voice Input
              </Button>
            </motion.div>
          )}

          {/* STEP 2 & 3: PREVIEW & PRINTING */}
          {(step === "preview" || step === "printing") && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Side: The Cheque Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                   <div className="bg-slate-800 text-white px-4 py-2 rounded-t-lg text-sm font-medium flex justify-between items-center">
                      <span>Print Preview</span>
                      <span className="text-slate-400 text-xs">100% Scale</span>
                   </div>
                   <div className="p-4 md:p-8 bg-slate-100 rounded-b-lg flex items-center justify-center">
                      <ChequePreview data={formData} isPrinting={step === "printing"} />
                   </div>
                </div>

                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start gap-3 text-sm">
                   <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <Check className="w-4 h-4" />
                   </div>
                   <p>
                     <strong>Smart Check:</strong> All fields are properly aligned. The amount in words matches the figures. Date is valid.
                   </p>
                </div>
              </div>

              {/* Right Side: Confirmation Panel */}
              <div className="lg:col-span-1">
                <Card className="h-full border-none shadow-xl">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Confirm Details</h3>
                    
                    <div className="space-y-6 flex-1">
                      <DetailRow label="Payee" value={formData.payeeName} />
                      <DetailRow label="Date" value={formData.date} />
                      <Separator />
                      <DetailRow label="Amount" value={`₹ ${formData.amountFigures}`} large />
                      <p className="text-sm text-slate-500 italic pl-1">{formData.amountWords}</p>
                      <Separator />
                      <DetailRow label="Account" value={formData.accountNumber} />
                    </div>

                    {step === "preview" ? (
                      <div className="space-y-3 mt-8">
                        <Button 
                          size="lg" 
                          className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20"
                          onClick={handlePrint}
                        >
                          <Printer className="mr-2 w-5 h-5" />
                          Confirm & Print
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full h-14"
                          onClick={() => setStep("manual-entry")}
                        >
                          <Edit3 className="mr-2 w-4 h-4" />
                          Edit Details
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-8 bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                        <p className="font-medium text-slate-900">Printing in progress...</p>
                        <p className="text-sm text-slate-500">Please do not remove the cheque</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
                Your cheque has been printed successfully. <br/>Please collect it from the output tray.
              </p>
              <Button 
                size="lg" 
                className="h-14 px-8 shadow-lg"
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

function DetailRow({ label, value, large }: { label: string, value: string, large?: boolean }) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
      <span className={`font-medium text-slate-900 ${large ? "text-2xl font-mono" : "text-lg"}`}>{value}</span>
    </div>
  );
}

function InputOption({ icon, title, desc, onClick, disabled, isBeta, primary, small }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-200 text-center
        ${disabled 
          ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" 
          : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
        }
        ${primary ? "border-primary/20 bg-blue-50/30" : ""}
        ${small ? "p-6 min-h-[160px]" : "min-h-[240px]"}
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

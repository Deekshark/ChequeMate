import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Check, Save, Printer, RefreshCw } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  payeeName: z.string().min(2, "Name is required"),
  date: z.string().min(1, "Date is required"),
  accountNumber: z.string().min(10, "Invalid account number"),
  amountWords: z.string().min(2, "Amount in words required"),
  amountFigures: z.string().min(1, "Amount required"),
});

interface ExtractionFormProps {
  initialData: z.infer<typeof formSchema>;
  onConfirm: (data: z.infer<typeof formSchema>) => void;
  onRetake: () => void;
}

export function ExtractionForm({ initialData, onConfirm, onRetake }: ExtractionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfirm(values);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">Review Details</CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  Please verify the extracted information below
                </CardDescription>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">
                High Confidence Score (98%)
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="payeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-500 uppercase text-xs font-bold tracking-wider">Payee Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="font-sans text-lg bg-slate-50 border-slate-200 focus:bg-white transition-all h-12" />
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
                        <FormLabel className="text-slate-500 uppercase text-xs font-bold tracking-wider">Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="font-mono text-lg bg-slate-50 border-slate-200 focus:bg-white transition-all h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-500 uppercase text-xs font-bold tracking-wider">Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="font-mono text-xl tracking-widest bg-slate-50 border-slate-200 focus:bg-white transition-all h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <Separator className="bg-slate-100" />

                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="amountFigures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-500 uppercase text-xs font-bold tracking-wider">Amount (Figures)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                            <Input {...field} className="pl-10 font-mono text-2xl font-bold text-slate-900 bg-slate-50 border-slate-200 focus:bg-white transition-all h-14" />
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
                      <FormItem>
                        <FormLabel className="text-slate-500 uppercase text-xs font-bold tracking-wider">Amount (Words)</FormLabel>
                        <FormControl>
                          <Input {...field} className="font-serif italic text-lg text-slate-700 bg-slate-50 border-slate-200 focus:bg-white transition-all h-14" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={item} className="flex items-center justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    onClick={onRetake}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Retake Photo
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Confirm & Process
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

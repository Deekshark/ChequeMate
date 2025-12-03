import { motion } from "framer-motion";
import { Camera, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import chequeImage from "@assets/generated_images/a_realistic_bank_cheque_on_a_desk.png";

interface CameraViewProps {
  isScanning: boolean;
  onCapture: () => void;
}

export function CameraView({ isScanning, onCapture }: CameraViewProps) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border-4 border-white/20 ring-1 ring-black/10">
      {/* Camera Feed Simulation */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
         <img 
           src={chequeImage} 
           alt="Camera Feed" 
           className="w-full h-full object-cover opacity-90"
         />
      </div>

      {/* Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/80 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/80 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/80 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/80 rounded-br-xl" />
        
        {/* Scanning Line Animation */}
        {isScanning && (
          <motion.div
            initial={{ top: "10%" }}
            animate={{ top: "90%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "reverse" 
            }}
            className="absolute left-8 right-8 h-0.5 bg-primary shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10"
          >
             <div className="absolute right-0 -top-3 bg-primary text-primary-foreground text-[10px] font-mono px-2 py-0.5 rounded-full opacity-80">
               OCR ACTIVE
             </div>
          </motion.div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        System Ready
      </div>

      {/* Capture Controls */}
      {!isScanning && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-auto">
          <Button 
            size="lg" 
            onClick={onCapture}
            className="h-16 w-16 rounded-full border-4 border-white/30 bg-primary hover:bg-primary/90 shadow-lg transition-all hover:scale-105 active:scale-95 p-0 flex items-center justify-center"
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
        </div>
      )}

      {/* Scanning Message */}
      {isScanning && (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end h-1/3">
          <div className="text-white font-medium text-lg tracking-wide animate-pulse flex items-center gap-2">
            <ScanLine className="w-5 h-5" />
            Analyzing Document...
          </div>
          <p className="text-white/60 text-sm mt-1">Please hold still</p>
        </div>
      )}
    </div>
  );
}

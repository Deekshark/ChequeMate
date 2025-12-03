import { motion } from "framer-motion";
import blankChequeImage from "@assets/generated_images/a_blank_bank_cheque_template.png";

interface ChequePreviewProps {
  data: {
    payeeName: string;
    date: string;
    amountWords: string;
    amountFigures: string;
    accountNumber: string;
  };
  isPrinting?: boolean;
}

export function ChequePreview({ data, isPrinting = false }: ChequePreviewProps) {
  // Font styles that mimic machine printing
  const printStyle = "font-mono font-bold text-slate-900 tracking-wider absolute";
  
  return (
    <div className="relative w-full aspect-[2.2/1] bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
      {/* Background Cheque Image */}
      <img 
        src={blankChequeImage} 
        alt="Blank Cheque" 
        className="w-full h-full object-cover opacity-90"
      />

      {/* Overlay Print Layer */}
      <div className="absolute inset-0 p-[4%]">
        
        {/* Date - Top Right */}
        <div className={`${printStyle} top-[12%] right-[5%] text-lg tracking-[0.2em]`}>
           {isPrinting ? (
             <Typewriter text={data.date} speed={50} />
           ) : data.date}
        </div>

        {/* Payee Name - Middle Left */}
        <div className={`${printStyle} top-[28%] left-[18%] text-xl w-[60%]`}>
          {isPrinting ? (
             <Typewriter text={data.payeeName} speed={30} delay={0.5} />
           ) : data.payeeName}
        </div>

        {/* Amount Words - Below Name */}
        <div className={`${printStyle} top-[42%] left-[15%] text-lg w-[65%] leading-relaxed italic opacity-90`}>
           {isPrinting ? (
             <Typewriter text={data.amountWords} speed={20} delay={1.5} />
           ) : data.amountWords}
        </div>

        {/* Amount Figures - Middle Right Box */}
        <div className={`${printStyle} top-[40%] right-[5%] text-2xl bg-white/50 px-4 py-1`}>
           {isPrinting ? (
             <Typewriter text={`$${data.amountFigures}`} speed={50} delay={2.5} />
           ) : `$${data.amountFigures}`}
        </div>

        {/* Account Number - Bottom Left (MICR area simulation) */}
        <div className={`${printStyle} bottom-[15%] left-[10%] font-mono text-sm text-slate-600`}>
           {isPrinting ? (
             <Typewriter text={`A/C: ${data.accountNumber}`} speed={20} delay={3} />
           ) : `A/C: ${data.accountNumber}`}
        </div>

      </div>

      {/* Printer Head Animation */}
      {isPrinting && (
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-black/10 to-transparent border-r border-black/20 z-20 backdrop-blur-[1px]"
        />
      )}
    </div>
  );
}

// Simple typewriter effect component
function Typewriter({ text, speed = 50, delay = 0 }: { text: string, speed?: number, delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0, delay: delay }}
    >
      <motion.span
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: text.length * 0.05, 
          ease: "linear",
          delay: delay 
        }}
        className="inline-block overflow-hidden whitespace-nowrap align-bottom"
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

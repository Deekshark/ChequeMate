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
  // Using 'Courier New' or generic monospace for that Dot Matrix / Impact Printer look
  const printStyle = "font-mono font-bold text-slate-900 absolute tracking-widest uppercase mix-blend-multiply opacity-90";
  
  return (
    <div className="relative w-full shadow-2xl rounded-lg overflow-hidden bg-white transform transition-all">
      <div className="relative w-full aspect-[2.25/1]">
        {/* Background Cheque Image */}
        <img 
          src={blankChequeImage} 
          alt="Blank Cheque" 
          className="w-full h-full object-cover"
        />

        {/* Overlay Print Layer - Positioned with percentages for responsiveness */}
        <div className="absolute inset-0 font-mono text-[#1a1a1a]">
          
          {/* Date - Top Right Box */}
          {/* Adjusted positions based on standard cheque layout visual estimation */}
          <div className={`${printStyle} top-[14%] right-[5%] text-[1.1vw] tracking-[0.3em]`}>
             {isPrinting ? (
               <Typewriter text={formatDate(data.date)} speed={50} />
             ) : formatDate(data.date)}
          </div>

          {/* Payee Name - "Pay" line */}
          <div className={`${printStyle} top-[27%] left-[16%] text-[1.4vw] w-[60%]`}>
            {isPrinting ? (
               <Typewriter text={data.payeeName} speed={30} delay={0.5} />
             ) : data.payeeName}
          </div>

          {/* Amount Words - "Rupees" line */}
          <div className={`${printStyle} top-[38%] left-[18%] text-[1.1vw] w-[60%] leading-relaxed`}>
             {isPrinting ? (
               <Typewriter text={data.amountWords} speed={15} delay={1.5} />
             ) : data.amountWords}
          </div>

          {/* Amount Figures - Box on the right */}
          <div className={`${printStyle} top-[38%] right-[6%] text-[1.6vw] w-[18%] text-center bg-white/20`}>
             {isPrinting ? (
               <Typewriter text={`₹ ${data.amountFigures}/-`} speed={50} delay={3.5} />
             ) : `₹ ${data.amountFigures}/-`}
          </div>

          {/* Account Number - Bottom Left */}
          <div className={`${printStyle} bottom-[18%] left-[12%] text-[1.2vw] tracking-[0.1em]`}>
             {isPrinting ? (
               <Typewriter text={data.accountNumber} speed={20} delay={4.0} />
             ) : data.accountNumber}
          </div>

        </div>

        {/* Printer Head Animation - Scanning bar effect */}
        {isPrinting && (
          <motion.div
            initial={{ left: "-5%" }}
            animate={{ left: "105%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent border-r-2 border-blue-500/20 z-20 backdrop-blur-[0.5px]"
          >
             <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[8px] px-1 font-mono">PRINT HEAD</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Formatting date from YYYY-MM-DD to DD MM YYYY
function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  // Returning with spaces for the separate boxes usually found on cheques
  return `${day} ${month} ${year}`;
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
          duration: text.length * (0.05 * (50/speed)), 
          ease: "linear",
          delay: delay 
        }}
        className="inline-block overflow-hidden whitespace-nowrap align-bottom align-text-bottom"
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

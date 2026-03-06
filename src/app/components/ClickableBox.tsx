import { motion } from "motion/react";

interface ClickableBoxProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  shape?: "rectangle" | "oval";
}

export function ClickableBox({ children, onClick, className = "", shape = "rectangle" }: ClickableBoxProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`cursor-pointer transition-all ${shape === "oval" ? "rounded-full" : "rounded-md"} ${className}`}
      whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

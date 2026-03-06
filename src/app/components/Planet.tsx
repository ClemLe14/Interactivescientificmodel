import { motion } from "motion/react";

interface PlanetProps {
  name: string;
  size: number;
  color: string;
  orbitRadius: number;
  orbitDuration: number;
  onClick: () => void;
  isPaused: boolean;
  speed: number;
}

export function Planet({
  name,
  size,
  color,
  orbitRadius,
  orbitDuration,
  onClick,
  isPaused,
  speed,
}: PlanetProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: orbitRadius * 2,
        height: orbitRadius * 2,
        marginLeft: -orbitRadius,
        marginTop: -orbitRadius,
      }}
    >
      {/* Orbit circle */}
      <div
        className="absolute inset-0 rounded-full border border-white/20"
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
        }}
      />
      
      {/* Orbiting planet */}
      <motion.div
        className="absolute left-1/2 top-0"
        style={{
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        animate={{
          rotate: isPaused ? 0 : 360,
        }}
        transition={{
          duration: orbitDuration / speed,
          repeat: Infinity,
          ease: "linear",
          paused: isPaused,
        }}
      >
        <motion.button
          className="rounded-full cursor-pointer border-2 border-white/30 shadow-lg relative group"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            boxShadow: `0 0 ${size / 2}px ${color}40`,
          }}
          onClick={onClick}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {name}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';

export function SnowEffect() {
  const snowflakes = Array.from({ length: 300 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${5 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
          }}
          initial={{ y: -20, x: 0 }}
          animate={{
            y: '160vh',
            x: [0, 30, -30, 0],
          }}
          transition={{
            y: {
              duration: parseFloat(flake.animationDuration),
              repeat: Infinity,
              delay: parseFloat(flake.animationDelay),
              ease: 'linear',
            },
            x: {
              duration: parseFloat(flake.animationDuration) / 2,
              repeat: Infinity,
              delay: parseFloat(flake.animationDelay),
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
}
import { motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'

interface ProcessingAnimationProps {
  count: number
}

export function ProcessingAnimation({ count }: ProcessingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="relative h-44 w-44">
          <motion.div
            className="absolute inset-0 rounded-full ring-gradient blur-md opacity-70"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full ring-gradient"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-4 rounded-full bg-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-violet-500 to-cyan-500 shadow-[0_24px_60px_-20px_rgba(139,92,246,0.55)]"
            >
              <BrainCircuit className="h-9 w-9 text-white" />
            </motion.div>
          </div>

          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-sky-400/70"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 90,
                y: Math.sin((i / 8) * Math.PI * 2) * 90,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 font-display text-2xl font-bold"
        >
          Sistem sedang menganalisis…
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 max-w-md text-sm text-muted-foreground"
        >
          Memetakan {count} gejala terhadap basis pengetahuan pakar dan menghitung
          tingkat keyakinan diagnosis.
        </motion.p>

        <motion.div
          className="mt-6 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {['Knowledge base', 'Inference engine', 'Explainer'].map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'

/**
 * Editorial side-profile illustration with the three ENT regions
 * (ear, nose / sinus, throat) highlighted by glowing markers and
 * concentric soundwave rings. Pure SVG so it scales sharply.
 */
export function AnatomyCenterpiece() {
  return (
    <div className="relative isolate aspect-square w-full max-w-[520px]">
      {/* ambient halo */}
      <div className="ambient-blob inset-6 bg-gradient-to-br from-sky-400/30 via-violet-400/20 to-cyan-400/30 dark:from-sky-500/20 dark:via-violet-500/15 dark:to-cyan-500/20" />

      {/* slow rotating conic ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 90deg at 50% 50%, rgba(14,165,233,0.45), rgba(139,92,246,0.0) 30%, rgba(6,182,212,0.45) 60%, rgba(14,165,233,0.0) 90%)',
          maskImage:
            'radial-gradient(circle at center, black 60%, transparent 62%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, black 60%, transparent 62%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-[6%] rounded-full border border-white/40 bg-white/30 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-white/[0.03]" />
      <div className="absolute inset-[14%] rounded-full border border-white/40 dark:border-white/[0.05]" />

      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="profile-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="profile-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="1" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dot-glow-violet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dot-glow-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stylized side-profile silhouette */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          d="M 360 80
             C 295 70, 230 95, 200 150
             C 178 192, 175 220, 180 245
             C 184 268, 178 286, 168 296
             C 158 306, 152 314, 156 324
             C 160 332, 178 332, 188 332
             C 192 348, 196 360, 196 372
             C 196 388, 184 398, 184 410
             C 184 424, 200 434, 232 436
             L 256 440
             L 296 440
             L 296 470"
          stroke="url(#profile-stroke)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="url(#profile-fill)"
        />

        {/* Subtle face contour */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.2, delay: 0.2, ease: 'easeInOut' }}
          d="M 220 200 C 215 220, 218 245, 224 260"
          stroke="url(#profile-stroke)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Inner dotted skull contour for editorial detail */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2.5, delay: 0.4, ease: 'easeInOut' }}
          d="M 350 110 C 290 100, 235 130, 218 175 C 205 210, 210 240, 210 260 C 210 285, 200 300, 192 312"
          stroke="#0EA5E9"
          strokeWidth="1"
          strokeDasharray="2 5"
        />

        {/* Ear region */}
        <g>
          <motion.circle
            cx="320"
            cy="260"
            r="18"
            fill="url(#dot-glow)"
            animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '320px 260px' }}
          />
          <circle cx="320" cy="260" r="5" fill="#0EA5E9" />
          {[26, 42, 60, 80].map((r, i) => (
            <motion.circle
              key={r}
              cx="320"
              cy="260"
              r={r}
              stroke="#0EA5E9"
              strokeOpacity={0.5}
              strokeWidth="1"
              fill="none"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.6, 1.15, 1.4] }}
              transition={{
                duration: 3,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: '320px 260px' }}
            />
          ))}
        </g>

        {/* Sinus region */}
        <g>
          <motion.circle
            cx="240"
            cy="232"
            r="14"
            fill="url(#dot-glow-violet)"
            animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ transformOrigin: '240px 232px' }}
          />
          <circle cx="240" cy="232" r="4" fill="#8B5CF6" />
        </g>

        {/* Throat region */}
        <g>
          <motion.circle
            cx="252"
            cy="408"
            r="14"
            fill="url(#dot-glow-cyan)"
            animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ transformOrigin: '252px 408px' }}
          />
          <circle cx="252" cy="408" r="4" fill="#06B6D4" />
        </g>

        {/* Connector lines from regions to floating tags */}
        <motion.path
          d="M 320 260 L 420 200"
          stroke="#0EA5E9"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.2 }}
        />
        <motion.path
          d="M 240 232 L 130 180"
          stroke="#8B5CF6"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
        />
        <motion.path
          d="M 252 408 L 130 460"
          stroke="#06B6D4"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.6 }}
        />
      </svg>

      {/* Floating region labels */}
      <RegionTag
        className="left-[78%] top-[34%]"
        color="sky"
        title="Telinga"
        meta="G011 · G020 · G023"
        delay={1.2}
      />
      <RegionTag
        className="left-[5%] top-[28%]"
        color="violet"
        title="Sinus"
        meta="G003 · G014 · G010"
        delay={1.4}
      />
      <RegionTag
        className="left-[5%] top-[82%]"
        color="cyan"
        title="Tenggorokan"
        meta="G021 · G024"
        delay={1.6}
      />
    </div>
  )
}

interface TagProps {
  className?: string
  color: 'sky' | 'violet' | 'cyan'
  title: string
  meta: string
  delay?: number
}

function RegionTag({ className = '', color, title, meta, delay = 0 }: TagProps) {
  const palette = {
    sky: { dot: '#0EA5E9', text: 'text-sky-600 dark:text-sky-300' },
    violet: { dot: '#8B5CF6', text: 'text-violet-600 dark:text-violet-300' },
    cyan: { dot: '#06B6D4', text: 'text-cyan-600 dark:text-cyan-300' },
  }[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`absolute ${className}`}
    >
      <div className="glass-card flex items-center gap-2.5 rounded-xl px-3 py-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: palette.dot, boxShadow: `0 0 12px ${palette.dot}` }}
        />
        <div className="leading-tight">
          <p className={`text-xs font-semibold ${palette.text}`}>{title}</p>
          <p className="font-mono text-[10px] text-muted-foreground">{meta}</p>
        </div>
      </div>
    </motion.div>
  )
}

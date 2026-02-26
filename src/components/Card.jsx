import { motion } from 'framer-motion';
import { AlignLeft, Layers, Flame, Pencil, Trash2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG MAPS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:    { label: 'Active',    dot: '#10b981', bg: '#f0fdf8', border: '#a7f3d0', text: '#065f46' },
  completed: { label: 'Completed', dot: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', text: '#4c1d95' },
  in_review: { label: 'In Review', dot: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#78350f' },
  pending:   { label: 'Pending',   dot: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a' },
  blocked:   { label: 'Blocked',   dot: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: '#fef2f2' },
  high:     { label: 'High',     color: '#f97316', bg: '#fff7ed' },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: '#fffbeb' },
  low:      { label: 'Low',      color: '#10b981', bg: '#f0fdf8' },
};

const TYPE_CONFIG = {
  feature:     { label: 'Feature',     color: '#10b981', bg: '#f0fdf8' },
  bug:         { label: 'Bug Fix',     color: '#ef4444', bg: '#fef2f2' },
  improvement: { label: 'Improvement', color: '#3b82f6', bg: '#eff6ff' },
  task:        { label: 'Task',        color: '#8b5cf6', bg: '#f5f3ff' },
  research:    { label: 'Research',    color: '#f59e0b', bg: '#fffbeb' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Badge = ({ label, color, bg, border, dot }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
               text-[11px] font-semibold tracking-wide border whitespace-nowrap"
    style={{ color, background: bg, borderColor: border || color + '33' }}
  >
    {dot && (
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
    )}
    {label}
  </span>
);

const MetaRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-2.5">
    <div
      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
      style={{ background: '#f0fdf8' }}
    >
      <Icon size={12} style={{ color: '#10b981' }} />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span
        className="text-[10px] uppercase tracking-widest font-semibold"
        style={{ color: '#9ca3af', fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FeatureCard — individual card, props se data aata hai
 *
 * Props:
 *   featureName  string
 *   projectName  string   ← parentheses mein dikhta hai
 *   description  string
 *   type         'feature' | 'bug' | 'improvement' | 'task' | 'research'
 *   priority     'critical' | 'high' | 'medium' | 'low'
 *   status       'active' | 'completed' | 'in_review' | 'pending' | 'blocked'
 *   onEdit       () => void
 *   onDelete     () => void
 *   index        number   ← stagger animation ke liye
 */
const FeatureCard = ({
  featureName  = 'Untitled Feature',
  projectName  = 'Unknown Project',
  description  = 'No description provided.',
  type         = 'feature',
  priority     = 'medium',
  status       = 'pending',
  onEdit       = () => {},
  onDelete     = () => {},
  index        = 0,
}) => {
  const statusCfg   = STATUS_CONFIG[status]     || STATUS_CONFIG.pending;
  const priorityCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const typeCfg     = TYPE_CONFIG[type]         || TYPE_CONFIG.feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -3,
        boxShadow: '0 12px 40px rgba(16,185,129,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className="relative bg-white rounded-2xl border overflow-hidden cursor-pointer h-auto width-20"
      style={{
        borderColor: '#e5e7eb',
        boxShadow:   '0 1px 4px rgba(0,0,0,0.05)',
        fontFamily:  "'DM Sans', sans-serif",
      }}
    >
      {/* Left accent bar — color matches status */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: statusCfg.dot }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: index * 0.07 + 0.2, duration: 0.4, ease: 'easeOut' }}
      />

      <div className="pl-5 pr-4 pt-4 pb-4 flex flex-col gap-3.5">

        {/* ── Row 1: Feature name + project name + status badge + actions ───── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-gray-900 font-semibold text-[15px] leading-snug truncate max-w-[200px]">
                {featureName}
              </h3>
              <span className="text-[12px] font-medium shrink-0" style={{ color: '#10b981' }}>
                ({projectName})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              label={statusCfg.label}
              color={statusCfg.text}
              bg={statusCfg.bg}
              border={statusCfg.border}
              dot={statusCfg.dot}
            />
            <div className="flex items-center gap-0.5">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <Pencil size={13} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Row 2: Description ─────────────────────────────────────────────── */}
        <MetaRow icon={AlignLeft} label="Description">
          <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>
            {description}
          </p>
        </MetaRow>

        {/* Divider */}
        <div className="h-px" style={{ background: '#f3f4f6' }} />

        {/* ── Row 3: Type + Priority ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <MetaRow icon={Layers} label="Type">
            <Badge label={typeCfg.label} color={typeCfg.color} bg={typeCfg.bg} />
          </MetaRow>
          <MetaRow icon={Flame} label="Priority">
            <Badge label={priorityCfg.label} color={priorityCfg.color} bg={priorityCfg.bg} />
          </MetaRow>
        </div>

      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD GRID  ← IS WRAPPER KO PAGE PY USE KARO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FeatureCardGrid
 *
 * Yeh wrapper handle karta hai:
 *   ✅ Desktop  → 3 cards per row
 *   ✅ Tablet   → 2 cards per row
 *   ✅ Mobile   → 1 card per row
 *   ✅ Agar sirf 1 ya 2 card hain → baqi jagah KHALI rahti hai, stretch nahi hoti
 *
 * Props:
 *   features  — API se aayi hui array
 *   onEdit    — (id) => void
 *   onDelete  — (id) => void
 *
 * Usage:
 *   <FeatureCardGrid
 *     features={apiFeatures}
 *     onEdit={(id) => handleEdit(id)}
 *     onDelete={(id) => handleDelete(id)}
 *   />
 */
export const FeatureCardGrid = ({ features = [], onEdit, onDelete }) => {
  return (
    <div
      /*
        ╔══════════════════════════════════════════════════════════╗
        ║  CORE TRICK — flex-grow-0  ← YE HAI ASLI FIX           ║
        ╠══════════════════════════════════════════════════════════╣
        ║  flex flex-wrap  → cards naturally wrap ho jaate hain   ║
        ║  gap-5           → 20px gap                             ║
        ║                                                          ║
        ║  Har card wrapper:                                       ║
        ║  • w-full              → mobile (1 per row)             ║
        ║  • sm:w-[calc(50%-10px)]    → tablet (2 per row)        ║
        ║  • lg:w-[calc(33.333%-14px)] → desktop (3 per row)      ║
        ║  • flex-grow-0  ← card kabhi badhega NAHI empty space   ║
        ║  • flex-shrink-0 ← card kabhi chhota nahi hoga          ║
        ╚══════════════════════════════════════════════════════════╝
      */
      className="flex flex-wrap gap-5"
    >
      {features.map((feature, i) => (
        <div
          key={feature.id ?? i}
          // ── THE FIX IS HERE ─────────────────────────────────────────────
          // flex-grow-0  → sirf 1 card ho toh woh poori row nahi lega
          // flex-shrink-0 → card apni width se chhota nahi hoga
          // w calculations → exactly 3 per row on lg, 2 on sm, 1 on mobile
          style={{
            flexGrow:   0,           // ← KEY: never stretch to fill empty space
            flexShrink: 0,
          }}
          className="
            w-full
            sm:w-[calc(50%-10px)]
            lg:w-[calc(33.333%-14px)]
          "
        >
          <FeatureCard
            index={i}
            featureName={feature.featureName}
            projectName={feature.projectName}
            description={feature.description}
            type={feature.type}
            priority={feature.priority}
            status={feature.status}
            onEdit={() => onEdit?.(feature.id)}
            onDelete={() => onDelete?.(feature.id)}
          />
        </div>
      ))}

      {/* Empty state */}
      {features.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100
                          flex items-center justify-center mb-4">
            <Layers size={22} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">No features found</p>
          <p className="text-gray-300 text-xs mt-1">Add your first feature to get started</p>
        </motion.div>
      )}
    </div>
  );
};

export default FeatureCard;

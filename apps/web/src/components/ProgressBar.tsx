import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress?: number;
  current?: number;
  max?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, current, max, className }) => {
  let percent = 0;
  if (typeof progress === 'number') {
    percent = Math.max(0, Math.min(100, progress));
  } else if (typeof current === 'number' && typeof max === 'number' && max > 0) {
    percent = Math.max(0, Math.min(100, (current / max) * 100));
  }

  return (
    <div className={`border-foreground h-3 w-full overflow-hidden border-2 ${className ?? ''}`}>
      <motion.div
        className="bg-foreground border-background h-full border-2"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ProgressBar;

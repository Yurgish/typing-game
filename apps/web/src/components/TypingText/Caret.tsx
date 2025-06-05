import { motion } from 'framer-motion';

interface CaretProps {
  type?: 'regular' | 'bottom';
}

const Caret = ({ type = 'regular' }: CaretProps) => {
  const caretClassName = type === 'bottom' ? 'border-b-3 w-full' : 'border-l-3 h-full';
  const caretWrapperClassName = type === 'bottom' ? 'justify-center' : 'items-center';
  return (
    <motion.div
      layoutId="caret"
      animate={{
        opacity: [0, 1, 0],
        transition: {
          duration: 1,
          repeat: Infinity
        }
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className={`absolute inset-0 flex ${caretWrapperClassName}`}
    >
      <div className={`border-foreground ${caretClassName}`} />
    </motion.div>
  );
};

export default Caret;

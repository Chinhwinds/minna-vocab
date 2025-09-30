import React, { forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export type MotionSwipeCardHandle = {
  triggerExit: (direction: 'left' | 'right') => Promise<void>;
};

interface MotionSwipeCardProps {
  enabled?: boolean;
  threshold?: number;
  leftLabel?: string;
  rightLabel?: string;
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (performed: 'left' | 'right' | null) => void;
}

const MotionSwipeCard = forwardRef<MotionSwipeCardHandle, MotionSwipeCardProps>(
  ({ enabled = false, threshold = 40, leftLabel = 'Chưa thuộc', rightLabel = 'Thuộc', children, onSwipeLeft, onSwipeRight, onDragStart, onDragEnd }, ref) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-240, 0, 240], [-10, 0, 10]);
    const knownOpacity = useTransform(x, [40, 140], [0, 0.7]);
    const unknownOpacity = useTransform(x, [-140, -40], [0.7, 0]);
    const controls = useAnimation();

    const animateExit = async (dir: 'left' | 'right') => {
      const toX = dir === 'right' ? 240 : -240;
      await controls.start({ x: toX, opacity: 0, rotate: dir === 'right' ? 10 : -10, transition: { duration: 0.18, ease: 'easeOut' } });
      return Promise.resolve();
    };

    useImperativeHandle(ref, () => ({
      triggerExit: async (direction: 'left' | 'right') => {
        await animateExit(direction);
      },
    }));

    return (
      <motion.div
        style={{ x, rotate, cursor: enabled ? 'grab' as const : 'default' as const }}
        drag={enabled ? 'x' : false}
        dragElastic={0.2}
        dragMomentum={false}
        whileHover={enabled ? { scale: 1.01 } : undefined}
        whileTap={enabled ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        animate={controls}
        onDragStart={() => { if (enabled) onDragStart && onDragStart(); }}
        onDragEnd={async (_, info) => {
          if (!enabled) return;
          if (info.offset.x > threshold && onSwipeRight) {
            // Fire callback immediately for snappy transition; exit animation will be handled by parent unmount
            onSwipeRight();
            onDragEnd && onDragEnd('right');
            return;
          }
          if (info.offset.x < -threshold && onSwipeLeft) {
            onSwipeLeft();
            onDragEnd && onDragEnd('left');
            return;
          }
          await controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 600, damping: 30 } });
          onDragEnd && onDragEnd(null);
        }}
      >
        <div className="relative">
          {/* Overlays */}
          {enabled && (
            <>
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none bg-green-100" style={{ opacity: knownOpacity }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none bg-red-100" style={{ opacity: unknownOpacity }} />
              <motion.div className="absolute left-3 top-3 text-xs font-semibold text-green-700" style={{ opacity: knownOpacity }}>
                {rightLabel}
              </motion.div>
              <motion.div className="absolute right-3 top-3 text-xs font-semibold text-red-700" style={{ opacity: unknownOpacity }}>
                {leftLabel}
              </motion.div>
            </>
          )}
          {children}
        </div>
      </motion.div>
    );
  }
);

export default MotionSwipeCard;



export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const stagger = (delay = 0.07) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

export const springTrans = { type: 'spring' as const, stiffness: 320, damping: 32 };
export const easeTrans = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
export const viewport = { once: true, margin: '-60px' as const };

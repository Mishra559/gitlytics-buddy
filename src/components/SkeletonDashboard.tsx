import { motion } from "framer-motion";

const SkeletonDashboard = () => {
  const pulse = "animate-pulse-glow bg-muted rounded-lg";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Profile */}
      <div className={`${pulse} h-44 w-full`} />
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className={`${pulse} h-24`} />)}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${pulse} h-64`} />
        <div className={`${pulse} h-64`} />
      </div>
      {/* Repos */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className={`${pulse} h-20`} />)}
      </div>
    </motion.div>
  );
};

export default SkeletonDashboard;

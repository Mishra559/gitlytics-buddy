import { GitHubRepo } from "@/hooks/useGitHub";
import { Star, GitFork, BookOpen, Code } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  repos: GitHubRepo[];
}

const StatsCards = ({ repos }: StatsCardsProps) => {
  const nonFork = repos.filter(r => !r.fork);
  const totalStars = nonFork.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = nonFork.reduce((s, r) => s + r.forks_count, 0);

  const langCount: Record<string, number> = {};
  nonFork.forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const stats = [
    { label: "Total Stars", value: totalStars.toLocaleString(), icon: Star, color: "text-chart-4" },
    { label: "Total Forks", value: totalForks.toLocaleString(), icon: GitFork, color: "text-chart-2" },
    { label: "Repositories", value: nonFork.length.toString(), icon: BookOpen, color: "text-chart-1" },
    { label: "Top Language", value: topLang, icon: Code, color: "text-chart-3" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="rounded-lg border border-border bg-card p-4 stat-gradient"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            {stat.label}
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;

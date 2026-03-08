import { GitHubRepo } from "@/hooks/useGitHub";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(145, 65%, 42%)",
  "hsl(200, 80%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(35, 90%, 55%)",
  "hsl(350, 70%, 55%)",
  "hsl(170, 60%, 45%)",
  "hsl(50, 85%, 50%)",
  "hsl(320, 60%, 50%)",
];

interface LanguageChartProps {
  repos: GitHubRepo[];
}

const LanguageChart = ({ repos }: LanguageChartProps) => {
  const langCount: Record<string, number> = {};
  repos.filter(r => !r.fork).forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });

  const data = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Language Distribution</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-foreground truncate">{d.name}</span>
              <span className="text-muted-foreground ml-auto">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageChart;

import { GitHubEvent } from "@/hooks/useGitHub";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { subDays, format, startOfDay, eachDayOfInterval } from "date-fns";

interface ContributionHeatmapProps {
  events: GitHubEvent[];
}

const ContributionHeatmap = ({ events }: ContributionHeatmapProps) => {
  const { grid, maxCount } = useMemo(() => {
    const end = startOfDay(new Date());
    const start = subDays(end, 364);
    const days = eachDayOfInterval({ start, end });

    const countMap: Record<string, number> = {};
    events.forEach(e => {
      const key = format(new Date(e.created_at), "yyyy-MM-dd");
      countMap[key] = (countMap[key] || 0) + 1;
    });

    let max = 0;
    const grid = days.map(d => {
      const key = format(d, "yyyy-MM-dd");
      const count = countMap[key] || 0;
      if (count > max) max = count;
      return { date: d, count, key };
    });

    return { grid, maxCount: max };
  }, [events]);

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (maxCount === 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const levelColors = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/70",
    "bg-primary",
  ];

  // Group by weeks
  const weeks: typeof grid[] = [];
  let currentWeek: typeof grid = [];
  grid.forEach((day, i) => {
    const dayOfWeek = day.date.getDay();
    if (i === 0) {
      // Pad start
      for (let j = 0; j < dayOfWeek; j++) {
        currentWeek.push({ date: new Date(), count: -1, key: `pad-${j}` });
      }
    }
    currentWeek.push(day);
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Activity (last year)</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-[700px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.key}
                  className={`h-[13px] w-[13px] rounded-sm ${day.count < 0 ? "opacity-0" : levelColors[getLevel(day.count)]}`}
                  title={day.count >= 0 ? `${format(day.date, "MMM d, yyyy")}: ${day.count} events` : ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <div key={i} className={`h-[11px] w-[11px] rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
};

export default ContributionHeatmap;

import { GitHubRepo } from "@/hooks/useGitHub";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "hsl(210 80% 55%)",
  JavaScript: "hsl(50 90% 50%)",
  Python: "hsl(210 60% 45%)",
  Rust: "hsl(25 80% 50%)",
  Go: "hsl(195 70% 50%)",
  Java: "hsl(20 70% 45%)",
  Ruby: "hsl(0 70% 50%)",
  "C++": "hsl(330 60% 50%)",
  C: "hsl(220 40% 50%)",
  Swift: "hsl(15 80% 55%)",
  Kotlin: "hsl(270 60% 55%)",
  PHP: "hsl(250 40% 50%)",
  HTML: "hsl(15 80% 55%)",
  CSS: "hsl(280 60% 50%)",
  Shell: "hsl(120 40% 45%)",
  Dart: "hsl(195 80% 45%)",
  Vue: "hsl(153 50% 48%)",
};

interface RepoListProps {
  repos: GitHubRepo[];
  sortBy: string;
}

const RepoList = ({ repos, sortBy }: RepoListProps) => {
  const sorted = [...repos].filter(r => !r.fork);
  
  if (sortBy === "stars") sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
  else if (sortBy === "forks") sorted.sort((a, b) => b.forks_count - a.forks_count);
  else sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const display = sorted.slice(0, 20);

  return (
    <div className="grid gap-3">
      {display.map((repo, i) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="group flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-all"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {repo.name}
              </h3>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            {repo.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] || "hsl(var(--muted-foreground))" }} />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
              <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
              <span className="hidden sm:inline">Updated {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}</span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
};

export default RepoList;

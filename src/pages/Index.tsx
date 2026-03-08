import { useState } from "react";
import { Github, AlertCircle } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import StatsCards from "@/components/StatsCards";
import LanguageChart from "@/components/LanguageChart";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import RepoList from "@/components/RepoList";
import SkeletonDashboard from "@/components/SkeletonDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import { useGitHubUser, useGitHubRepos, useGitHubEvents } from "@/hooks/useGitHub";

const Index = () => {
  const [username, setUsername] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  const userQuery = useGitHubUser(username);
  const reposQuery = useGitHubRepos(username);
  const eventsQuery = useGitHubEvents(username);

  const isLoading = userQuery.isLoading || reposQuery.isLoading;
  const error = userQuery.error || reposQuery.error;

  const handleSearch = (name: string) => {
    setUsername(name);
    setSortBy("updated");
  };

  const sortOptions = [
    { value: "updated", label: "Recently Updated" },
    { value: "stars", label: "Most Starred" },
    { value: "forks", label: "Most Forked" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Github className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">GitHub Analytics</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero / Search */}
        {!username && (
          <div className="py-20 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-mono text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Developer Analytics
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Explore any developer's<br />
              <span className="text-primary">GitHub profile</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a username to get detailed analytics, language breakdowns, and contribution activity.
            </p>
          </div>
        )}

        <div className={username ? "mb-8" : ""}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {(error as Error).message}
          </div>
        )}

        {/* Loading */}
        {isLoading && <div className="mt-8"><SkeletonDashboard /></div>}

        {/* Dashboard */}
        {userQuery.data && reposQuery.data && !isLoading && (
          <div className="mt-8 space-y-6">
            <ProfileCard user={userQuery.data} />
            <StatsCards repos={reposQuery.data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LanguageChart repos={reposQuery.data} />
              {eventsQuery.data && <ContributionHeatmap events={eventsQuery.data} />}
            </div>

            {/* Repos Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Repositories</h3>
                <div className="flex gap-1">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        sortBy === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <RepoList repos={reposQuery.data} sortBy={sortBy} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

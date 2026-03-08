import { useQuery } from "@tanstack/react-query";

const BASE = "https://api.github.com";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  html_url: string;
  blog: string | null;
  company: string | null;
  twitter_username: string | null;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  topics: string[];
  size: number;
  open_issues_count: number;
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const batch = await fetchJson<GitHubRepo[]>(
      `${BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    repos.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }
  return repos;
}

export function useGitHubUser(username: string) {
  return useQuery({
    queryKey: ["github-user", username],
    queryFn: () => fetchJson<GitHubUser>(`${BASE}/users/${username}`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useGitHubRepos(username: string) {
  return useQuery({
    queryKey: ["github-repos", username],
    queryFn: () => fetchAllRepos(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useGitHubEvents(username: string) {
  return useQuery({
    queryKey: ["github-events", username],
    queryFn: () => fetchJson<GitHubEvent[]>(`${BASE}/users/${username}/events/public?per_page=100`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

import { GitHubUser } from "@/hooks/useGitHub";
import { MapPin, Link as LinkIcon, Building, Calendar, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface ProfileCardProps {
  user: GitHubUser;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-lg border border-border bg-card p-6 glow-primary"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="h-24 w-24 rounded-full border-2 border-primary/30"
        />
        <div className="flex-1 text-center sm:text-left">
          <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <h2 className="text-2xl font-bold text-foreground">{user.name || user.login}</h2>
          </a>
          <p className="text-muted-foreground font-mono text-sm">@{user.login}</p>
          {user.bio && <p className="mt-2 text-sm text-foreground/80 max-w-lg">{user.bio}</p>}

          <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{user.location}</span>
            )}
            {user.company && (
              <span className="flex items-center gap-1"><Building className="h-4 w-4" />{user.company}</span>
            )}
            {user.blog && (
              <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <LinkIcon className="h-4 w-4" />{user.blog}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />Joined {format(new Date(user.created_at), "MMM yyyy")}
            </span>
          </div>

          <div className="mt-4 flex gap-6 justify-center sm:justify-start text-sm">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{user.followers}</strong>
              <span className="text-muted-foreground">followers</span>
            </span>
            <span className="flex items-center gap-1.5">
              <strong className="text-foreground">{user.following}</strong>
              <span className="text-muted-foreground">following</span>
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-accent" />
              <strong className="text-foreground">{user.public_repos}</strong>
              <span className="text-muted-foreground">repos</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;

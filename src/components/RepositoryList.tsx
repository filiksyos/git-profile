'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Star, GitFork, Code2 } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface RepositoryListProps {
  repositories: Repository[];
  selectedRepos: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function RepositoryList({
  repositories,
  selectedRepos,
  onSelectionChange,
}: RepositoryListProps) {
  const handleToggle = (repoName: string) => {
    if (selectedRepos.includes(repoName)) {
      onSelectionChange(selectedRepos.filter((r) => r !== repoName));
    } else {
      onSelectionChange([...selectedRepos, repoName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRepos.length === repositories.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(repositories.map((r) => r.full_name));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Repositories ({repositories.length})
        </h2>
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {selectedRepos.length === repositories.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="space-y-4">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Checkbox
              checked={selectedRepos.includes(repo.full_name)}
              onCheckedChange={() => handleToggle(repo.full_name)}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {repo.name}
                </a>
              </div>

              {repo.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <Code2 className="w-4 h-4" />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
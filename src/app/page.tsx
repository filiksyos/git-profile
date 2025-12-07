'use client';

import { useState } from 'react';
import { RepositoryList } from '@/components/RepositoryList';
import { ProfileCard } from '@/components/ProfileCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Github, Sparkles, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export default function Home() {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [focus, setFocus] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [profile, setProfile] = useState<string[]>([]);
  const [storeName, setStoreName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleListRepositories = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setRepositories([]);
    setProfile([]);

    try {
      const response = await fetch(`/api/repositories?username=${username}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch repositories');
      }

      setRepositories(data.repositories);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIndexRepositories = async () => {
    if (!apiKey) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (selectedRepos.length === 0) {
      setError('Please select at least one repository to index');
      return;
    }

    setIndexing(true);
    setError('');

    try {
      const response = await fetch('/api/index-repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          repositories: selectedRepos,
          apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to index repositories');
      }

      setStoreName(data.storeName);
      alert(`Successfully indexed ${selectedRepos.length} repositories!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIndexing(false);
    }
  };

  const handleGenerateProfile = async () => {
    if (!apiKey) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (!storeName) {
      setError('Please index repositories first');
      return;
    }

    setGenerating(true);
    setError('');
    setProfile([]);

    try {
      const response = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName,
          apiKey,
          focus: focus.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      setProfile(data.profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-12 h-12 text-gray-800 dark:text-white" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Git Profile
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover your coding persona through AI-powered analysis
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="username">GitHub Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="md:w-1/2">
              <Label htmlFor="focus">Focus (Optional)</Label>
              <Input
                id="focus"
                type="text"
                placeholder="e.g., coding style, dependency versions, tech stack, UI"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-end md:w-1/2">
              <Button
                onClick={handleListRepositories}
                disabled={loading || !username}
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                {loading ? 'Loading...' : 'List Repositories'}
              </Button>

              <Button
                onClick={handleIndexRepositories}
                disabled={indexing || selectedRepos.length === 0 || !apiKey}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                {indexing ? 'Indexing...' : `Index ${selectedRepos.length > 0 ? `(${selectedRepos.length})` : 'Repositories'}`}
              </Button>

              <Button
                onClick={handleGenerateProfile}
                disabled={generating || !storeName || !apiKey}
                variant="default"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate Profile'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {(loading || indexing || generating) && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Profile Results */}
        {profile.length > 0 && (
          <div className="mb-8">
            <ProfileCard profile={profile} username={username} />
          </div>
        )}

        {/* Repository List */}
        {repositories.length > 0 && (
          <RepositoryList
            repositories={repositories}
            selectedRepos={selectedRepos}
            onSelectionChange={setSelectedRepos}
          />
        )}
      </div>
    </div>
  );
}
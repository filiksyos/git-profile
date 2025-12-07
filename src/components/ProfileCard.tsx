'use client';

import { useState } from 'react';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface ProfileCardProps {
  profile: string[];
  username: string;
}

export function ProfileCard({ profile, username }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Format the profile as bullet points
    const formattedText = profile.map(point => `• ${point}`).join('\n');
    
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-xl p-8 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {username}'s Coding Profile
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI-Generated Insights
            </p>
          </div>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
        <ul className="space-y-3">
          {profile.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
            >
              <span className="text-purple-600 dark:text-purple-400 font-bold mt-1">•</span>
              <span className="flex-1">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
        Generated using Gemini AI • Based on indexed repository analysis
      </div>
    </div>
  );
}
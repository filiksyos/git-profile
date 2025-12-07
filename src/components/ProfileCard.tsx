'use client';

import { User, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  profile: string[];
  username: string;
}

export function ProfileCard({ profile, username }: ProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-xl p-8 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-3 mb-6">
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
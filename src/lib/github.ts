import axios from 'axios';

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

export async function fetchUserRepositories(username: string): Promise<Repository[]> {
  try {
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Optional: Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers,
        params: {
          per_page: 100,
          sort: 'updated',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`User "${username}" not found`);
    }
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
}

export async function fetchRepositoryFiles(
  owner: string,
  repo: string,
  path: string = ''
): Promise<any[]> {
  try {
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching files for ${owner}/${repo}:`, error.message);
    return [];
  }
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const headers: any = {
      'Accept': 'application/vnd.github.v3.raw',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching file ${path}:`, error.message);
    return null;
  }
}
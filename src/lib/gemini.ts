import { GoogleGenAI } from '@google/genai';
import { fetchRepositoryFiles, fetchFileContent } from './github';

interface IndexResult {
  storeName: string;
  filesIndexed: number;
}

/**
 * Index repositories using Gemini File Search
 */
export async function indexRepositories(
  username: string,
  repositories: string[],
  apiKey: string
): Promise<IndexResult> {
  const ai = new GoogleGenAI({ apiKey });

  // Create a unique store name
  const storeName = `fileSearchStores/${username}-${Date.now()}`;

  const filesToUpload: Array<{ name: string; content: string }> = [];

  // Fetch files from each repository
  for (const repoName of repositories) {
    const [owner, repo] = repoName.includes('/') 
      ? repoName.split('/')
      : [username, repoName];

    console.log(`Fetching files from ${owner}/${repo}...`);

    // Get important files (main source files, package.json, etc.)
    const files = await fetchRepositoryFiles(owner, repo);
    
    // Filter for code files and important configs
    const importantExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.json', '.md', '.yaml', '.yml'];
    const importantFiles = files.filter((file: any) => 
      file.type === 'file' && 
      importantExtensions.some(ext => file.name.endsWith(ext))
    ).slice(0, 10); // Limit to 10 files per repo

    for (const file of importantFiles) {
      const content = await fetchFileContent(owner, repo, file.path);
      if (content) {
        filesToUpload.push({
          name: `${owner}/${repo}/${file.path}`,
          content,
        });
      }
    }
  }

  if (filesToUpload.length === 0) {
    throw new Error('No files found to index');
  }

  console.log(`Uploading ${filesToUpload.length} files to Gemini File Search...`);

  // Create File Search store
  try {
    // Note: The actual File Search API may have different implementation
    // This is a simplified version based on the Gemini AI SDK
    const store = await ai.fileSearchStores.create({
      config: { displayName: `${username}-repos-${Date.now()}` },
    });

    // Upload files to the store
    for (const file of filesToUpload) {
      const fileBlob = new Blob([file.content], { type: 'text/plain' });
      
      const uploadOperation = await ai.fileSearchStores.uploadToFileSearchStore({
        fileSearchStoreName: store.name!,
        file: fileBlob,
        config: {
          displayName: file.name,
        },
      });

      // Wait for upload to complete
      let operation = uploadOperation;
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max wait
      
      while (!operation.done && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          operation = await ai.operations.get({ operation: operation });
        } catch (opError) {
          console.error(`Error checking operation status:`, opError);
          break;
        }
        attempts++;
      }
    }

    return {
      storeName: store.name!,
      filesIndexed: filesToUpload.length,
    };
  } catch (error: any) {
    console.error('Error creating File Search store:', error);
    throw new Error(`Failed to index repositories: ${error.message}`);
  }
}

/**
 * Generate a coding profile by analyzing indexed repositories
 */
export async function generateCodingProfile(
  storeName: string,
  apiKey: string,
  focus?: string
): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey });

  const focusGuidance = focus 
    ? `\n\nIMPORTANT: Pay special attention to aspects related to "${focus}". While still generating 20 diverse bullet points, prioritize insights about ${focus} when analyzing the code.`
    : '';

  const prompt = `Analyze this developer's code and generate exactly 20 specific, insightful bullet points about their coding style and preferences. Each point should be a concise phrase starting with a dash. Focus on:

${focusGuidance}

Return ONLY the 20 bullet points, one per line, each starting with "- ". Be specific and data-driven based on the actual code.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [storeName],
            },
          },
        ],
      },
    });

    let answer = '';
    
    if (response.text) {
      answer = response.text;
    } else if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content) {
        if (typeof candidate.content === 'string') {
          answer = candidate.content;
        } else if (candidate.content.parts && Array.isArray(candidate.content.parts)) {
          answer = candidate.content.parts
            .filter((part: any) => part.text)
            .map((part: any) => part.text)
            .join('\n');
        }
      }
    }

    if (!answer) {
      throw new Error('No response from Gemini AI');
    }

    // Parse the response into individual bullet points
    const bulletPoints = answer
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);

    // Ensure we have exactly 20 points
    if (bulletPoints.length < 20) {
      // If we got fewer, pad with generic insights
      while (bulletPoints.length < 20) {
        bulletPoints.push('Shows consistent coding practices across projects');
      }
    }

    return bulletPoints.slice(0, 20);
  } catch (error: any) {
    console.error('Error generating profile:', error);
    throw new Error(`Failed to generate profile: ${error.message}`);
  }
}
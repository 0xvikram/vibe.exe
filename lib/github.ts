const GITHUB_API_URL = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  size: number;
  updated_at: string;
}

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    return {
      Authorization: `Bearer ${token}`
    };
  }
  return {};
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API_URL}/users/${username}`, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(res.status === 403 ? 'Rate limit exceeded' : 'User not found');
  }
  return res.json();
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(`${GITHUB_API_URL}/users/${username}/repos?sort=updated&per_page=100`, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(res.status === 403 ? 'Rate limit exceeded' : 'Failed to fetch repos');
  }
  return res.json();
}

export async function fetchRepoLanguages(username: string, repo: string): Promise<Record<string, number>> {
  const res = await fetch(`${GITHUB_API_URL}/repos/${username}/${repo}/languages`, { headers: getHeaders() });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Rate limit exceeded');
    return {};
  }
  return res.json();
}

export async function fetchEvents(username: string): Promise<any[]> {
  const res = await fetch(`${GITHUB_API_URL}/users/${username}/events/public`, { headers: getHeaders() });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Rate limit exceeded');
    return [];
  }
  return res.json();
}

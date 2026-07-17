import { fetchUser, fetchRepos, fetchRepoLanguages, fetchEvents } from './github';
import { generateAuraTitle } from './auraTitle';
import { getLanguageColor } from './languageColors';
import { generatePercentiles } from './percentiles';
import { generateHoroscope } from './horoscopeTemplates';

export interface AuraData {
  username: string;
  avatar: string;
  title: string;
  colors: string[];
  topLanguage: string;
  nightOwlPercent: number;
  variance: number;
  reposCount: number;
  totalEvents: number;
  particles: { color: string; size: number }[];
  ranks: { nightOwlRank: number, consistencyRank: number, activityRank: number };
  insights: string[];
}

export async function computeAura(username: string): Promise<AuraData> {
  const user = await fetchUser(username);
  const repos = await fetchRepos(username);
  const events = await fetchEvents(username);

  // Analyze events
  let nightOwlEvents = 0;
  const eventDays: Record<string, number> = {};
  
  events.forEach(event => {
    const date = new Date(event.created_at);
    const hour = date.getHours();
    if (hour >= 0 && hour <= 5) {
      nightOwlEvents++;
    }
    
    const day = date.toISOString().split('T')[0];
    eventDays[day] = (eventDays[day] || 0) + 1;
  });

  const nightOwlPercent = events.length > 0 ? nightOwlEvents / events.length : 0;
  
  // Variance in events
  const counts = Object.values(eventDays);
  const mean = counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
  const variance = counts.length > 0 
    ? counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / counts.length 
    : 0;

  // Language analysis (top 10 updated repos)
  const topRepos = repos.slice(0, 10);
  const languageBytes: Record<string, number> = {};
  
  for (const repo of topRepos) {
    const langs = await fetchRepoLanguages(username, repo.name);
    for (const [lang, bytes] of Object.entries(langs)) {
      languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
    }
  }

  const sortedLanguages = Object.entries(languageBytes)
    .sort((a, b) => b[1] - a[1]);

  const topLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : 'Unknown';
  
  // Calculate colors and particles
  const totalBytes = sortedLanguages.reduce((sum, [_, bytes]) => sum + bytes, 0);
  const colors = sortedLanguages.slice(0, 4).map(([lang]) => getLanguageColor(lang));
  if (colors.length === 0) colors.push('#888888');

  const particles = sortedLanguages.slice(0, 6).map(([lang, bytes]) => ({
    color: getLanguageColor(lang),
    size: Math.max(5, (bytes / totalBytes) * 40)
  }));

  const title = generateAuraTitle(topLanguage, nightOwlPercent, variance, events.length);
  const ranks = generatePercentiles(nightOwlPercent, variance, repos.length);
  const insights = generateHoroscope(nightOwlPercent, variance, events.length);

  return {
    username: user.login,
    avatar: user.avatar_url,
    title,
    colors,
    topLanguage,
    nightOwlPercent,
    variance,
    reposCount: repos.length,
    totalEvents: events.length,
    particles,
    ranks,
    insights
  };
}

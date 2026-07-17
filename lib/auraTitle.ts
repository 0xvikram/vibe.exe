export function generateAuraTitle(
  topLanguage: string,
  nightOwlPercent: number,
  variance: number,
  totalEvents: number
): string {
  let adjective = 'Dedicated';
  if (nightOwlPercent > 0.6) adjective = 'Nocturnal';
  else if (nightOwlPercent < 0.2) adjective = 'Early Bird';
  else if (totalEvents > 200) adjective = 'Relentless';
  else if (totalEvents < 50) adjective = 'Minimalist';

  let noun = 'Coder';
  if (topLanguage && topLanguage !== 'Unknown') {
    noun = `${topLanguage} Wizard`;
  }

  let modifier = '';
  if (variance > 5) modifier = ' (Chaotic)';
  else if (variance < 2) modifier = ' (Zen)';

  return `${adjective} ${noun}${modifier}`;
}

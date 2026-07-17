export const languageColors: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#CC342D',
  PHP: '#4F5D95',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  Shell: '#89e051',
};

export function hexToHsl(hex: string): { h: number, s: number, l: number } {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function getLanguageColor(lang: string): string {
  const hex = languageColors[lang] || '#888888';
  const hsl = hexToHsl(hex);
  // Boost saturation for more vibrant aura
  const boostedS = Math.min(100, hsl.s + 30);
  const adjustedL = Math.max(40, Math.min(60, hsl.l));
  return `hsl(${Math.round(hsl.h)}, ${Math.round(boostedS)}%, ${Math.round(adjustedL)}%)`;
}

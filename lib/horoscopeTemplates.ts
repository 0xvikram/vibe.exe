export function generateHoroscope(
  nightOwlPercent: number, 
  variance: number, 
  totalEvents: number
): string[] {
  const insights: string[] = [];

  // Night Owl buckets
  if (nightOwlPercent > 0.6) {
    const options = [
      "You probably code best after 11pm and regret it every morning.",
      "Your most brilliant ideas happen when the rest of the world is asleep.",
      "Vampire hours detected. The sun is your natural enemy.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  } else if (nightOwlPercent < 0.1) {
    const options = [
      "An early bird who actually writes code during business hours. A rare breed.",
      "You value your sleep schedule more than unnecessary late-night refactors.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  }

  // Consistency buckets
  if (variance > 5) {
    const options = [
      "Your commit graph looks like a heartbeat during a marathon. Very bursty.",
      "You code in intense, chaotic sprints and then vanish for days.",
      "Commit, commit, commit... silence. The cycle of a chaotic good developer.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  } else if (variance < 1.5) {
    const options = [
      "Frighteningly consistent. Are you a developer or a cron job?",
      "Slow and steady wins the race. Your streak is genuinely impressive.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  }

  // Volume buckets
  if (totalEvents > 200) {
    const options = [
      "You practically live in the terminal. Touch grass occasionally.",
      "A relentless shipping machine. Your keyboard must be exhausted.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  } else if (totalEvents < 30) {
    const options = [
      "A minimalist. You only push code when it's absolutely necessary.",
      "Quality over quantity, presumably. You measure twice and cut once.",
    ];
    insights.push(options[Math.floor(Math.random() * options.length)]);
  }

  // Fallback if not enough insights
  if (insights.length < 2) {
    insights.push("You maintain a balanced, healthy relationship with your codebase.");
  }
  if (insights.length < 1) {
    insights.push("A true enigma. Your GitHub profile defies easy categorization.");
  }

  return insights.slice(0, 2);
}

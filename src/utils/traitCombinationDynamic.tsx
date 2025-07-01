export const traitCombinationInsights: Record<string, Record<string, string>> = {
  Outcomes: {
    Options: `You're results-driven but flexible — you like knowing where you're going, but also enjoy exploring different ways to get there. This combo gives you strategic range: you aim high, but aren't afraid to pivot if there's a smarter route forward.`,
    
    Risks: `You pursue results with a cautious lens — always scanning for what could go wrong. This helps you avoid overcommitment or blind optimism. Just make sure your risk filter doesn't slow down momentum when decisiveness matters.`,
    
    Evidence: `You ground your goals in hard data. This pairing means you're unlikely to chase an outcome unless you've run the numbers. It's a strong combo in high-accountability roles, but remember: not all impact is immediately measurable.`,
    
    People: `You're focused on hitting targets, but know you can't get there alone. This balance lets you lead with clarity while keeping your team engaged. The challenge is making space for collaboration without losing forward momentum.`,
    
    Process: `You pair vision with structure — a powerful combo for execution. You likely break goals down into clear plans and milestones. Be careful not to get too locked into a path; flexibility still matters when outcomes shift.`
  },

  Options: {
    Outcomes: `You're a solution generator who doesn't get lost in ideas — you think broadly, but always with a goal in mind. This pairing gives you both creativity and direction. Just watch for over-optimization when the answer is already good enough.`,
    
    Risks: `You see multiple ways forward and can anticipate which ones might go off track. This combo helps you explore boldly, but with a safety net. The tension is real: don't let what might go wrong stop you from what could go right.`,
    
    Evidence: `You're an idea machine, but not reckless. You validate options with real data before acting. This combination keeps decisions imaginative but grounded — a strong fit for strategy, innovation, and research-heavy roles.`,
    
    People: `You don't just create ideas — you bounce them off others. This blend thrives in collaborative environments where brainstorming, feedback, and iteration are key. Just make sure decisions don't stall from too many opinions.`,
    
    Process: `You generate lots of possibilities, but you also know how to turn them into a repeatable plan. This gives you staying power — not just starting power. Just avoid locking into structure too early; some ideas need more room to evolve.`
  },

  Risks: {
    Outcomes: `You think ahead — not just about what might go wrong, but how to still hit the target. This combo makes you a strategic operator: cautious but driven. Just be mindful that risk-aversion doesn't cause missed opportunities.`,
    
    Options: `You see multiple futures — and their pitfalls. This combination helps you prepare for uncertainty with a flexible mindset. You're unlikely to get caught off guard, but watch for indecision if too many options feel risky.`,
    
    Evidence: `You back up your caution with data. This pairing is excellent for high-stakes calls where the consequences matter. Just be careful not to delay action while gathering "just one more" data point.`,
    
    People: `You're a trusted voice when it comes to protecting the group — anticipating what could impact others and helping teams avoid trouble. Just watch that protecting people doesn't turn into avoiding necessary conflict.`,
    
    Process: `You're the planner every team needs in stormy weather. You think long-term, anticipate issues, and build resilient processes. Just avoid over-engineering solutions to problems that haven't happened yet.`
  },

  Evidence: {
    Outcomes: `You're focused on results — but only when the facts stack up. You aim for measurable success and use data to make sure your efforts stay on track. Just remember: sometimes bold moves don't come with full certainty.`,
    
    Options: `You explore alternatives with a scientific mindset. You don't just throw out ideas — you test them. This approach brings both creativity and rigor, though it can help to loop others in earlier, before ideas feel fully proven.`,
    
    Risks: `You're cautious for good reason. You want to be sure. This combination is excellent in compliance-heavy or high-consequence settings. Just be aware that risk-avoidance can sometimes slow innovation.`,
    
    People: `You're the rare mix of analytical and human-aware. You value both facts and relationships, often helping teams separate emotion from evidence. Don't let empathy override facts — or vice versa.`,
    
    Process: `You bring discipline to the data. With this combo, you likely thrive in quality control, audits, or anywhere structure meets scrutiny. Just make sure the process doesn't become the outcome.`
  },

  People: {
    Outcomes: `You centre people in every decision — but with a clear eye on results. You're great at aligning others to shared goals and helping the group stay motivated and accountable. Just remember that clarity of task matters too — not every conversation needs consensus.`,
    
    Options: `You bring people into the conversation early, knowing that more perspectives lead to better ideas. This combination helps you surface possibilities others miss — but be mindful not to lose momentum in endless discussion. Decision-making needs a close.`,
    
    Risks: `You assess risk through a human lens. You think about how decisions affect others — not just what could go wrong. This makes you highly attuned to group impact and ethical implications. Just be sure fear of conflict doesn't lead to indecision.`,
    
    Evidence: `You know decisions are better when both data and dialogue are considered. You gather facts and ask for feedback — creating trust and buy-in. Just make sure you don't dilute tough insights in an effort to keep everyone comfortable.`,
    
    Process: `You value inclusive, fair processes that give people a voice. Structure helps you ensure that everyone is heard — and that collaboration is consistent, not chaotic. Just keep outcomes in sight: process is a tool, not the destination.`
  },

  Process: {
    Outcomes: `You create order out of ambition. Clear goals don't scare you — they guide your planning. Your structured approach helps teams break big ideas into actionable steps. Just be mindful that a flexible mindset can sometimes unlock faster progress.`,
    
    Options: `You bring structure to brainstorming. While others might throw ideas at the wall, you know how to evaluate and prioritize them. This pairing helps teams move from possibility to plan — but don't let the search for the "perfect" process delay action.`,
    
    Risks: `You don't just plan for success — you plan for what could go wrong. You build safeguards into decisions and help others feel prepared, not panicked. Just be careful not to over-engineer — too much caution can limit experimentation.`,
    
    Evidence: `You're rigorous. You don't just value process — you validate it with data. This makes your decisions repeatable and trusted. Just remember that not every variable can be controlled. Sometimes momentum matters more than precision.`,
    
    People: `You know that collaboration works best when it's well-structured. You give people clarity, consistency, and a process they can trust. That's a major strength — just be sure to leave room for improvisation when the moment calls for it.`
  }
};

/**
 * Get dynamic insight based on the top trait and second highest trait
 * @param topTrait - The highest scoring trait
 * @param secondTrait - The second highest scoring trait
 * @returns The dynamic insight text, or a fallback message if combination not found
 */
export const getDynamicInsight = (topTrait: string, secondTrait: string): string => {
  // Check if the combination exists
  if (traitCombinationInsights[topTrait] && traitCombinationInsights[topTrait][secondTrait]) {
    return traitCombinationInsights[topTrait][secondTrait];
  }
  
  // Fallback if combination doesn't exist
  return `Your combination of ${topTrait} and ${secondTrait} creates a unique decision-making style that balances these complementary strengths.`;
};

import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendDrawResultsEmail(
  to: string, 
  fullName: string, 
  month: string, 
  drawnNumbers: number[], 
  userScores: number[], 
  matchCount: number
) {
  const content = `
    <h1>Monthly Draw Results: ${month}</h1>
    <p>Hi ${fullName}, the monthly draw for ${month} is officially complete. Here is the summary of your results:</p>
    <p><strong>Official Numbers:</strong> ${drawnNumbers.join(', ')}</p>
    <p><strong>Your Current Scores:</strong> ${userScores.join(', ')}</p>
    <p><strong>Match Count:</strong> You matched ${matchCount} ${matchCount === 1 ? 'number' : 'numbers'}.</p>
    
    ${matchCount >= 3 
      ? `<p style="color: #22C55E; font-weight: 800;">Congratulations! You've won a prize. Check your dashboard to see the amount.</p>`
      : `<p>Better luck next time. Don't forget to keep your scores updated to stay eligible for next month!</p>`
    }

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">View Winning Details</a>
  `;

  return sendEmail({
    to,
    subject: `Monthly Draw Results - ${month}`,
    html: emailWrapper(content),
  });
}

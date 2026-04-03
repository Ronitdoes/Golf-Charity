// Serverside route for administrative reports and platform performance tracking
import { 
  getSubscriberStats, 
  getPrizePoolStats, 
  getCharityStats, 
  getDrawStats 
} from '@/lib/analytics';
import ReportsDashboard from './ReportsDashboard';

export default async function Page() {
  const [subscriberStats, prizeStats, charityStats, drawStats] = await Promise.all([
    getSubscriberStats(),
    getPrizePoolStats(),
    getCharityStats(),
    getDrawStats()
  ]);

  return (
    <ReportsDashboard 
       subscriberStats={subscriberStats} 
       prizeStats={prizeStats} 
       charityStats={charityStats} 
       drawStats={drawStats} 
    />
  );
}

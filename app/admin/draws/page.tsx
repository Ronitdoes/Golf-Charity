// Serverside route for draw management list view
import { getDraws } from '@/app/actions/draws';
import AdminDrawsPage from './AdminDrawsPage';

export default async function Page() {
  const draws = await getDraws();
  
  const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM
  const currentMonthDraw = draws.find(d => d.month.startsWith(currentMonth)) || null;

  return <AdminDrawsPage draws={draws} currentMonthDraw={currentMonthDraw} />;
}

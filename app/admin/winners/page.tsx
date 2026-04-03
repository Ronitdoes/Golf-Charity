// Serverside route for administrative winner registry overview
import { getWinnersByStatus } from '@/app/actions/admin/winners';
import WinnersRegistryPage from './WinnersRegistryPage';

export default async function Page({ searchParams }: { searchParams: { status?: 'pending' | 'paid' } }) {
  const winners = await getWinnersByStatus(searchParams.status);
  return <WinnersRegistryPage winners={winners} />;
}

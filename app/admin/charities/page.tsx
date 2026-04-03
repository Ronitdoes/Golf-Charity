// Serverside route for administrative charity registry overview
import { getAllCharitiesAdmin } from '@/app/actions/admin/charities';
import AdminCharitiesPage from './AdminCharitiesPage';

export default async function Page() {
  const charities = await getAllCharitiesAdmin();
  return <AdminCharitiesPage charities={charities} />;
}

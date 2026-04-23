// Serverside route for modifying existing charity metadata and activations agenda
import { createServerSupabaseClient } from '@/lib/supabase';
import CharityFormPage from '../../CharityFormPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  
  const [charityRes, eventsRes] = await Promise.all([
    supabase.from('charities').select('*').eq('id', params.id).single(),
    supabase.from('charity_events').select('*').eq('charity_id', params.id).order('event_date', { ascending: true })
  ]);

  if (charityRes.error) return notFound();

  return (
    <CharityFormPage 
       charity={charityRes.data} 
       events={eventsRes.data || []} 
    />
  );
}

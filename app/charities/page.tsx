'use client';

// Navigable external-facing registry aggregating verified organizations relying sequentially on explicit client-side caching integrations 
import { useState, useEffect, useMemo } from 'react';
import CharityCard from '@/components/charities/CharityCard';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { selectCharity } from '@/app/actions/charities';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export default function CharitiesDirectoryPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interactive Filter States securely mutating visual payload purely locally natively
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'featured'>('all');
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  useEffect(() => {
    async function loadDirectory() {
      const supabase = createBrowserSupabaseClient();
      
      // Parallel unblocking request ensuring rapid display while simultaneously verifying auth bindings
      const [authRes, charitiesRes] = await Promise.all([
         supabase.auth.getUser(),
         supabase.from('charities').select('*').eq('is_active', true).order('name')
      ]);

      if (authRes.data.user) setUserId(authRes.data.user.id);
      if (charitiesRes.data) setCharities(charitiesRes.data);
      
      setIsLoading(false);
    }
    
    loadDirectory();
  }, []);

  const filteredCharities = useMemo(() => {
    return charities.filter(charity => {
      // Name/Description mapping
      const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            charity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Explicit Flag boundary isolation
      const matchesFlag = filterType === 'all' || (filterType === 'featured' && charity.is_featured);
      
      return matchesSearch && matchesFlag;
    });
  }, [charities, searchQuery, filterType]);

  const handleSelect = async (id: string) => {
     if (!userId) {
        // Redirection implicitly handled or user theoretically shouldn't logically see select buttons natively 
        window.location.href = '/login';
        return;
     }

     setIsSelecting(id);
     const res = await selectCharity(id);
     setIsSelecting(null);

     if (res?.success) {
        alert('Charity firmly secured. Your upcoming interactions are routing successfully.');
        window.location.href = '/dashboard/charity';
     } else {
        alert(res?.error || 'Underlying configuration fault triggering mapping error.');
     }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">Make an Impact.</h1>
          <p className="text-neutral-400 text-lg">Browse meticulously vetted organizations deploying verified funding actively. Select your destination globally natively.</p>
        </div>

        {/* Universal Filter Architecture */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
           
           <div className="relative flex-1 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search charities logically natively..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
           </div>

           <div className="flex bg-neutral-950 border border-neutral-800 p-1 rounded-xl shrink-0 w-full md:w-auto">
             <button 
                onClick={() => setFilterType('all')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-colors ${filterType === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
                All Organizations
             </button>
             <button 
                onClick={() => setFilterType('featured')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${filterType === 'featured' ? 'bg-green-500 w text-neutral-950' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
                Featured
             </button>
           </div>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="animate-pulse bg-neutral-900 border border-neutral-800 rounded-2xl h-96 w-full" />
              ))}
           </div>
        ) : filteredCharities.length === 0 ? (
           <div className="text-center py-20 px-4 bg-neutral-900 border border-neutral-800 border-dashed rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">No Verified Alignment Configured</h3>
              <p className="text-neutral-500">We couldn&apos;t inherently intersect your filtering parameters securely.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCharities.map((charity) => (
                 <CharityCard 
                    key={charity.id} 
                    charity={charity} 
                    isLoggedIn={!!userId} 
                    onSelect={handleSelect}
                    isSelecting={isSelecting}
                 />
              ))}
           </div>
        )}

      </div>
    </div>
  );
}

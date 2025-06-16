import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication services
export const authService = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { user: null, coachData: null };
    
    // Get coach data based on auth_uid
    const { data: coachData, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('auth_uid', session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching coach data:', error);
      return { user: session.user, coachData: null };
    }
    
    return { user: session.user, coachData };
  }
};

// Data services
export const dataService = {
  // Players
  getPlayers: async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('last_name', { ascending: true });
    return { data, error };
  },
  
  getPlayerById: async (id) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },
  
  // Observations
  getObservations: async (limit = 100) => {
    const { data, error } = await supabase
      .from('observations')
      .select(`
        *,
        players(id, first_name, last_name, position),
        coaches(id, first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },
  
  getObservationsByPlayerId: async (playerId) => {
    const { data, error } = await supabase
      .from('observations')
      .select(`
        *,
        coaches(id, first_name, last_name)
      `)
      .eq('player_id', playerId)
      .order('observation_date', { ascending: false });
    return { data, error };
  },
  
  addObservation: async (observation) => {
    const { data, error } = await supabase
      .from('observations')
      .insert([observation])
      .select();
    return { data, error };
  },
  
  // PDPs
  getPDPs: async (active = true) => {
    const { data, error } = await supabase
      .from('pdp')
      .select(`
        *,
        players(id, first_name, last_name, position),
        coaches(id, first_name, last_name)
      `)
      .eq('active', active)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  getPDPsByPlayerId: async (playerId) => {
    const { data, error } = await supabase
      .from('pdp')
      .select(`
        *,
        coaches(id, first_name, last_name)
      `)
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  addPDP: async (pdp) => {
    const { data, error } = await supabase
      .from('pdp')
      .insert([pdp])
      .select();
    return { data, error };
  },
  
  updatePDP: async (id, updates) => {
    const { data, error } = await supabase
      .from('pdp')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },
  
  // Activity Log
  getActivityLog: async (limit = 50) => {
    const { data, error } = await supabase
      .from('activity_log')
      .select(`
        *,
        coaches(id, first_name, last_name),
        observations(id, content),
        pdp(id, content)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  }
}; 
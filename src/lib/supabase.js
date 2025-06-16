import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClientForDev(); // Only used if env vars are missing

// Table names as constants to avoid typos and make changes easier
export const TABLES = {
  PLAYERS: 'players',
  COACHES: 'coaches',
  OBSERVATIONS: 'observations',
  PDP: 'pdp',
  ACTIVITY_LOG: 'activity_log'
};

/**
 * Create a mock client for development if environment variables are missing
 * This prevents runtime errors but logs a warning
 */
function createMockClientForDev() {
  console.warn(
    'Supabase URL or Anonymous Key missing. Using mock client. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
  
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          then: (callback) => callback({ data: [], error: null })
        }),
        order: () => ({
          then: (callback) => callback({ data: [], error: null })
        }),
        limit: () => ({
          then: (callback) => callback({ data: [], error: null })
        }),
        then: (callback) => callback({ data: [], error: null })
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [], error: null })
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        select: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    }),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
}

/**
 * Base Data Service class - provides CRUD operations for any table
 */
class DataService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Get all records from the table
   * @returns {Promise<Array>} Array of records
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return [];
    }
  }

  /**
   * Get a single record by ID
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data || null;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      return null;
    }
  }

  /**
   * Create a new record
   * @param {Object} item - Record to create
   * @returns {Promise<Object|null>} Created record or null on error
   */
  async create(item) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([item])
        .select();
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }
  }

  /**
   * Update a record by ID
   * @param {string} id - Record ID
   * @param {Object} item - Updated fields
   * @returns {Promise<Object|null>} Updated record or null on error
   */
  async update(id, item) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(item)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }
  }

  /**
   * Delete a record by ID
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      return false;
    }
  }
}

/**
 * Player Service - extends DataService with player-specific operations
 */
class PlayerService extends DataService {
  constructor() {
    super(TABLES.PLAYERS);
  }

  /**
   * Get players with their active PDPs
   * @returns {Promise<Array>} Players with PDPs
   */
  async getPlayersWithActivePDPs() {
    try {
      const { data: players, error: playersError } = await supabase
        .from(TABLES.PLAYERS)
        .select('*');
      
      if (playersError) throw playersError;
      
      const { data: pdps, error: pdpsError } = await supabase
        .from(TABLES.PDP)
        .select('*')
        .eq('active', true);
      
      if (pdpsError) throw pdpsError;
      
      // Map active PDPs to players
      return (players || []).map(player => {
        const activePDP = (pdps || []).find(pdp => pdp.player_id === player.id);
        return {
          ...player,
          activePDP: activePDP || null
        };
      });
    } catch (error) {
      console.error('Error fetching players with PDPs:', error);
      return [];
    }
  }
}

/**
 * Coach Service - extends DataService with coach-specific operations
 */
class CoachService extends DataService {
  constructor() {
    super(TABLES.COACHES);
  }

  /**
   * Get coach by email
   * @param {string} email - Coach email
   * @returns {Promise<Object|null>} Coach or null if not found
   */
  async getByEmail(email) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching coach by email:', error);
      return null;
    }
  }

  /**
   * Get coaches with admin role
   * @returns {Promise<Array>} Admin coaches
   */
  async getAdmins() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('is_admin', true);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching admin coaches:', error);
      return [];
    }
  }
}

/**
 * PDP Service - extends DataService with PDP-specific operations
 */
class PDPService extends DataService {
  constructor() {
    super(TABLES.PDP);
  }

  /**
   * Get all PDPs for a player
   * @param {string} playerId - Player ID
   * @returns {Promise<Array>} PDPs for the player
   */
  async getForPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching PDPs for player:', error);
      return [];
    }
  }

  /**
   * Get active PDP for a player
   * @param {string} playerId - Player ID
   * @returns {Promise<Object|null>} Active PDP or null
   */
  async getActivePDP(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('player_id', playerId)
        .eq('active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching active PDP:', error);
      return null;
    }
  }

  /**
   * Create a new PDP and deactivate any existing active PDPs for the player
   * @param {Object} pdp - PDP to create
   * @returns {Promise<Object|null>} Created PDP or null on error
   */
  async createAndDeactivateOthers(pdp) {
    try {
      // First deactivate any existing active PDPs
      const { error: updateError } = await supabase
        .from(this.tableName)
        .update({ 
          active: false,
          end_date: new Date().toISOString()
        })
        .eq('player_id', pdp.player_id)
        .eq('active', true);
      
      if (updateError) throw updateError;
      
      // Then create the new PDP
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{
          ...pdp,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error creating PDP:', error);
      return null;
    }
  }
}

/**
 * Observation Service - extends DataService with observation-specific operations
 */
class ObservationService extends DataService {
  constructor() {
    super(TABLES.OBSERVATIONS);
  }

  /**
   * Get all observations for a player
   * @param {string} playerId - Player ID
   * @returns {Promise<Array>} Observations for the player
   */
  async getForPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('player_id', playerId)
        .order('observation_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching observations for player:', error);
      return [];
    }
  }

  /**
   * Get recent observations (last 7 days)
   * @param {number} limit - Maximum number of observations to return
   * @returns {Promise<Array>} Recent observations
   */
  async getRecent(limit = 10) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gte('observation_date', sevenDaysAgo.toISOString())
        .order('observation_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent observations:', error);
      return [];
    }
  }
}

/**
 * Activity Log Service - extends DataService with activity log operations
 */
class ActivityLogService extends DataService {
  constructor() {
    super(TABLES.ACTIVITY_LOG);
  }

  /**
   * Log an activity
   * @param {string} activityType - Type of activity
   * @param {string} summary - Summary of activity
   * @param {string} coachId - ID of coach performing activity
   * @param {Object} relatedIds - Related IDs (observation_id, pdp_id, etc.)
   * @returns {Promise<Object|null>} Created activity log or null on error
   */
  async logActivity(activityType, summary, coachId, relatedIds = {}) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{
          activity_type: activityType,
          summary,
          coach_id: coachId,
          ...relatedIds,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error logging activity:', error);
      return null;
    }
  }

  /**
   * Get activity logs for a coach
   * @param {string} coachId - Coach ID
   * @param {number} limit - Maximum number of logs to return
   * @returns {Promise<Array>} Activity logs
   */
  async getForCoach(coachId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity logs for coach:', error);
      return [];
    }
  }
}

/**
 * VoiceService - Wrapper around Web Speech API for voice dictation
 */
export class VoiceService {
  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognition = 
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    
    this.isSupported = !!SpeechRecognition;
    this.recognizer = this.isSupported ? new SpeechRecognition() : null;
    
    if (this.recognizer) {
      this.recognizer.continuous = true;
      this.recognizer.interimResults = true;
      this.recognizer.lang = 'en-US';
    }
  }

  /**
   * Start voice recognition
   * @param {Function} callback - Callback function with transcript and isFinal flag
   */
  start(callback) {
    if (!this.isSupported || !this.recognizer) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }
    
    this.recognizer.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;
      
      callback({ transcript, isFinal });
    };
    
    this.recognizer.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    try {
      this.recognizer.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }

  /**
   * Stop voice recognition
   */
  stop() {
    if (this.recognizer) {
      try {
        this.recognizer.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }
}

// Create service instances
export const playerService = new PlayerService();
export const coachService = new CoachService();
export const pdpService = new PDPService();
export const observationService = new ObservationService();
export const activityLogService = new ActivityLogService();

// Export all services in a single object
export const services = {
  players: playerService,
  coaches: coachService,
  observations: observationService,
  pdps: pdpService,
  activityLog: activityLogService
};

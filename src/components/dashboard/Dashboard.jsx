import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Alert, useMediaQuery, useTheme } from '@mui/material';
import { supabase, playerService, observationService } from '../../lib/supabase';
import { useAuth } from '../../App';
import { format, subDays } from 'date-fns';

// Import components
import TopSection from '../dashboard/TopSection';
import PlayerList from '../dashboard/PlayerList';
import ObservationList from '../dashboard/ObservationList';

// Import modals
import AddPlayerModal from '../dashboard/modals/AddPlayerModal';
import AddObservationModal from '../dashboard/modals/AddObservationModal';
import AddPDPModal from '../dashboard/modals/AddPDPModal';
import UpdatePDPModal from '../dashboard/modals/UpdatePDPModalNew';
import PDPHistoryModal from '../dashboard/PDPHistoryModal';

/**
 * Dashboard - Main dashboard component showing stats, players, and observations
 */
const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Data states
  const [players, setPlayers] = useState([]);
  const [observations, setObservations] = useState([]);
  const [pdps, setPdps] = useState([]);
  const [stats, setStats] = useState({
    playerCount: 0,
    observationsThisWeek: 0
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
  const [addObservationModalOpen, setAddObservationModalOpen] = useState(false);
  const [addPDPModalOpen, setAddPDPModalOpen] = useState(false);
  const [updatePDPModalOpen, setUpdatePDPModalOpen] = useState(false);
  const [pdpHistoryModalOpen, setPDPHistoryModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';
  
  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Fetch all data needed for the dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get one week ago date for weekly observations
      const oneWeekAgo = subDays(new Date(), 7).toISOString();
      
      // Fetch data in parallel for better performance
      const [
        playersData,
        observationsData,
        pdpsData,
        weeklyObservationsData
      ] = await Promise.all([
        playerService.getAll(),
        observationService.getAll(),
        supabase.from('pdp').select('*'),
        supabase.from('observations')
          .select('*')
          .gte('created_at', oneWeekAgo)
      ]);
      
      // Handle any errors
      if (pdpsData.error) throw pdpsData.error;
      if (weeklyObservationsData.error) throw weeklyObservationsData.error;
      
      // Set state with fetched data
      setPlayers(playersData || []);
      setObservations(observationsData || []);
      setPdps(pdpsData.data || []);
      
      // Calculate stats
      setStats({
        playerCount: playersData.length,
        observationsThisWeek: weeklyObservationsData.data?.length || 0
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a player
  const handleAddPlayer = () => {
    setAddPlayerModalOpen(true);
  };
  
  // Handle adding an observation
  const handleAddObservation = (player = null) => {
    setSelectedPlayer(player);
    setAddObservationModalOpen(true);
  };
  
  // Handle adding a PDP
  const handleAddPDP = (player = null) => {
    setSelectedPlayer(player);
    setAddPDPModalOpen(true);
  };
  
  // Handle updating a PDP
  const handleUpdatePDP = (player) => {
    setSelectedPlayer(player);
    setUpdatePDPModalOpen(true);
  };
  
  // Handle viewing PDP history
  const handleViewPDPHistory = (player) => {
    setSelectedPlayer(player);
    setPDPHistoryModalOpen(true);
  };
  
  // Handle player submission
  const handlePlayerSubmit = async (playerData) => {
    try {
      const newPlayer = await playerService.create({
        first_name: playerData.first_name,
        last_name: playerData.last_name,
        position: playerData.position || '',
        name: `${playerData.first_name} ${playerData.last_name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (newPlayer) {
        setPlayers([...players, newPlayer]);
        setAddPlayerModalOpen(false);
        fetchDashboardData(); // Refresh all data
      }
    } catch (err) {
      console.error('Error creating player:', err);
      setError('Failed to create player');
    }
  };
  
  // Handle observation submission
  const handleObservationSubmit = async (observationData) => {
    try {
      const newObservation = await observationService.create({
        player_id: observationData.player_id,
        content: observationData.content,
        observation_date: observationData.observation_date,
        coach_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (newObservation) {
        setObservations([...observations, newObservation]);
        setAddObservationModalOpen(false);
        fetchDashboardData(); // Refresh all data
      }
    } catch (err) {
      console.error('Error creating observation:', err);
      setError('Failed to create observation');
    }
  };
  
  // Handle PDP submission
  const handlePDPSubmit = async (pdpData) => {
    try {
      // First, mark any existing active PDPs for this player as inactive
      const { data: existingPdps, error: fetchError } = await supabase
        .from('pdp')
        .select('*')
        .eq('player_id', pdpData.player_id)
        .eq('active', true);
      
      if (fetchError) throw fetchError;
      
      // Update any existing active PDPs to be inactive
      if (existingPdps && existingPdps.length > 0) {
        const { error: updateError } = await supabase
          .from('pdp')
          .update({ 
            active: false, 
            end_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('player_id', pdpData.player_id)
          .eq('active', true);
        
        if (updateError) throw updateError;
      }
      
      // Create the new PDP
      const { data: newPdp, error: createError } = await supabase
        .from('pdp')
        .insert([{
          player_id: pdpData.player_id,
          content: pdpData.content,
          active: true,
          coach_id: user?.id,
          start_date: pdpData.start_date || new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) throw createError;
      
      setPdps([...pdps, ...(newPdp || [])]);
      setAddPDPModalOpen(false);
      fetchDashboardData(); // Refresh all data
    } catch (err) {
      console.error('Error creating PDP:', err);
      setError('Failed to create PDP');
    }
  };
  
  // Handle PDP update
  const handlePDPUpdate = async (player, pdpData) => {
    try {
      // Similar to handlePDPSubmit but for updates
      // First, mark any existing active PDPs for this player as inactive
      const { data: existingPdps, error: fetchError } = await supabase
        .from('pdp')
        .select('*')
        .eq('player_id', player.id)
        .eq('active', true);
      
      if (fetchError) throw fetchError;
      
      // Update any existing active PDPs to be inactive
      if (existingPdps && existingPdps.length > 0) {
        const { error: updateError } = await supabase
          .from('pdp')
          .update({ 
            active: false, 
            end_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('player_id', player.id)
          .eq('active', true);
        
        if (updateError) throw updateError;
      }
      
      // Create new PDP as an update
      const { data: newPdp, error: createError } = await supabase
        .from('pdp')
        .insert([{
          player_id: player.id,
          content: pdpData.content,
          active: true,
          coach_id: user?.id,
          start_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (createError) throw createError;
      
      setPdps([...pdps, ...(newPdp || [])]);
      setUpdatePDPModalOpen(false);
      fetchDashboardData(); // Refresh all data
    } catch (err) {
      console.error('Error updating PDP:', err);
      setError('Failed to update PDP');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}
      >
        <CircularProgress sx={{ color: oldGold }} />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: 'rgba(211, 47, 47, 0.1)', 
            color: '#fff',
            '& .MuiAlert-icon': { color: '#f44336' }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Top section with stats */}
      <TopSection 
        playerCount={stats.playerCount}
        observationsThisWeek={stats.observationsThisWeek}
        onAddPlayer={handleAddPlayer}
        onAddObservation={handleAddObservation}
        onAddPDP={handleAddPDP}
      />
      
      {/* Main content - responsive grid */}
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          mt: 1,
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        {/* Left panel - Players */}
        <Grid item xs={12} md={8}>
          <PlayerList 
            players={players}
            pdps={pdps}
            onAddObservation={handleAddObservation}
            onUpdatePDP={handleUpdatePDP}
            onViewPDPHistory={handleViewPDPHistory}
          />
        </Grid>
        
        {/* Right panel - Observations */}
        <Grid item xs={12} md={4}>
          <ObservationList 
            observations={observations}
            players={players}
            limit={10}
          />
        </Grid>
      </Grid>
      
      {/* Modals */}
      <AddPlayerModal
        open={addPlayerModalOpen}
        onClose={() => setAddPlayerModalOpen(false)}
        onSubmit={handlePlayerSubmit}
      />
      
      <AddObservationModal
        open={addObservationModalOpen}
        onClose={() => setAddObservationModalOpen(false)}
        onSubmit={handleObservationSubmit}
        players={players}
        selectedPlayer={selectedPlayer}
        currentUser={user}
      />
      
      <AddPDPModal
        open={addPDPModalOpen}
        onClose={() => setAddPDPModalOpen(false)}
        onSubmit={handlePDPSubmit}
        players={players}
        selectedPlayer={selectedPlayer}
        currentUser={user}
      />
      
      <UpdatePDPModal
        open={updatePDPModalOpen}
        onClose={() => setUpdatePDPModalOpen(false)}
        onSubmit={handlePDPUpdate}
        player={selectedPlayer}
        currentUser={user}
      />
      
      <PDPHistoryModal
        open={pdpHistoryModalOpen}
        onClose={() => setPDPHistoryModalOpen(false)}
        player={selectedPlayer}
        pdps={pdps.filter(pdp => selectedPlayer && pdp.player_id === selectedPlayer.id)}
      />
    </Box>
  );
};

export default Dashboard;

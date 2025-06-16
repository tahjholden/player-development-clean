import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Collapse,
  Divider,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PersonOutline as PersonIcon
} from '@mui/icons-material';

/**
 * PlayerList - Displays a list of players with their active PDPs
 * 
 * @param {Object} props
 * @param {Array} props.players - List of player objects
 * @param {Array} props.pdps - List of PDP objects
 * @param {Function} props.onAddObservation - Callback when Add Observation button is clicked
 * @param {Function} props.onUpdatePDP - Callback when Edit PDP button is clicked
 * @param {Function} props.onViewPDPHistory - Callback when View History button is clicked
 */
const PlayerList = ({ 
  players = [], 
  pdps = [], 
  onAddObservation, 
  onUpdatePDP, 
  onViewPDPHistory 
}) => {
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';
  
  // Get active PDP for a player
  const getActivePDP = (playerId) => {
    return pdps.find(pdp => pdp.player_id === playerId && pdp.active === true);
  };
  
  // Handle player expansion toggle
  const handleExpandPlayer = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };
  
  // Format player name
  const formatPlayerName = (player) => {
    if (player.name) return player.name;
    return `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Unnamed Player';
  };
  
  // Extract PDP summary (first 100 chars)
  const getPDPSummary = (pdp) => {
    if (!pdp || !pdp.content) return 'No active development plan';
    return pdp.content.length > 100 
      ? `${pdp.content.substring(0, 100)}...` 
      : pdp.content;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: oldGold }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={2}>
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
    <Card sx={{ 
      backgroundColor: '#000', 
      color: '#fff', 
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Players
        </Typography>
        
        {players && players.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {players.map((player) => {
              if (!player || !player.id) return null;
              
              const activePDP = getActivePDP(player.id);
              const isExpanded = expandedPlayer === player.id;
              const playerName = formatPlayerName(player);
              
              return (
                <React.Fragment key={player.id}>
                  <ListItem 
                    button 
                    onClick={() => handleExpandPlayer(player.id)}
                    sx={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': { 
                        backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                          {playerName}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                          {player.position || 'No position specified'}
                        </Typography>
                      }
                    />
                    {isExpanded ? 
                      <ExpandLessIcon sx={{ color: oldGold }} /> : 
                      <ExpandMoreIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    }
                  </ListItem>
                  
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <Typography variant="subtitle1" sx={{ color: oldGold, mb: 1 }}>
                        Development Plan
                      </Typography>
                      
                      {activePDP ? (
                        <>
                          <Typography sx={{ color: '#fff', mb: 1, fontSize: '0.9rem' }}>
                            {getPDPSummary(activePDP)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 2 }}>
                            Created: {formatDate(activePDP.created_at)}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, fontStyle: 'italic' }}>
                          No active development plan
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddObservation && onAddObservation(player);
                          }}
                          sx={{ 
                            borderColor: 'rgba(255, 255, 255, 0.3)', 
                            color: '#fff',
                            '&:hover': { 
                              borderColor: oldGold, 
                              backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                            }
                          }}
                        >
                          Add Observation
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePDP && onUpdatePDP(player);
                          }}
                          sx={{ 
                            borderColor: oldGold, 
                            color: oldGold,
                            '&:hover': { 
                              borderColor: oldGold, 
                              backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                            }
                          }}
                        >
                          {activePDP ? 'Edit PDP' : 'Create PDP'}
                        </Button>
                        
                        <Tooltip title="View PDP history">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewPDPHistory && onViewPDPHistory(player);
                            }}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': { 
                                color: oldGold 
                              }
                            }}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              px: 2,
              textAlign: 'center'
            }}
          >
            <PersonIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              No players found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Add players using the "Add Player" button
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerList;

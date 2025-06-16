import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

/**
 * TopSection - Displays key statistics and action buttons at the top of the dashboard
 * 
 * @param {Object} props
 * @param {number} props.playerCount - Total number of players
 * @param {number} props.observationsThisWeek - Number of observations made this week
 * @param {function} props.onAddPlayer - Callback when Add Player button is clicked
 * @param {function} props.onAddObservation - Callback when Add Observation button is clicked
 * @param {function} props.onAddPDP - Callback when Add PDP button is clicked
 */
const TopSection = ({ 
  playerCount = 0, 
  observationsThisWeek = 0, 
  onAddPlayer, 
  onAddObservation,
  onAddPDP
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';
  
  return (
    <Box sx={{ mb: 4 }}>
      {/* Title and action buttons */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#fff',
            mb: { xs: 2, sm: 0 }
          }}
        >
          Dashboard
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddPlayer}
            sx={{ 
              backgroundColor: oldGold,
              color: '#000',
              '&:hover': { backgroundColor: '#BFA52B' }
            }}
          >
            Add Player
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={onAddObservation}
            sx={{ 
              borderColor: oldGold,
              color: oldGold,
              '&:hover': { 
                borderColor: oldGold,
                backgroundColor: 'rgba(207, 181, 59, 0.1)'
              }
            }}
          >
            Add Observation
          </Button>
          
          {onAddPDP && (
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              onClick={onAddPDP}
              sx={{ 
                borderColor: oldGold,
                color: oldGold,
                '&:hover': { 
                  borderColor: oldGold,
                  backgroundColor: 'rgba(207, 181, 59, 0.1)'
                }
              }}
            >
              Add PDP
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Stats cards */}
      <Grid container spacing={3}>
        {/* Total Players */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              backgroundColor: '#121212',
              color: '#fff',
              border: `1px solid ${oldGold}`,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: oldGold, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Total Players
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: oldGold
                }}
              >
                {playerCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Observations This Week */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              backgroundColor: '#121212',
              color: '#fff',
              border: `1px solid ${oldGold}`,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ color: oldGold, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Observations This Week
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: oldGold
                }}
              >
                {observationsThisWeek}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopSection;

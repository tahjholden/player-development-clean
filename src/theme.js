import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define the Old Gold color
const oldGold = '#CFB53B';

// Create the base theme
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: oldGold,
      light: '#DFC76B',
      dark: '#BFA52B',
      contrastText: '#000',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    action: {
      active: oldGold,
      hover: 'rgba(207, 181, 59, 0.08)',
      selected: 'rgba(207, 181, 59, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          scrollbarColor: `${oldGold} #121212`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#121212',
            width: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: oldGold,
            minHeight: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: oldGold,
          color: '#000000',
          '&:hover': {
            backgroundColor: '#BFA52B',
          },
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: oldGold,
          color: oldGold,
          '&:hover': {
            backgroundColor: 'rgba(207, 181, 59, 0.08)',
            borderColor: oldGold,
          },
        },
        text: {
          color: oldGold,
          '&:hover': {
            backgroundColor: 'rgba(207, 181, 59, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: oldGold,
          '&:hover': {
            backgroundColor: 'rgba(207, 181, 59, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: oldGold,
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: oldGold,
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          borderRadius: 12,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          color: '#FFFFFF',
          fontWeight: 600,
        },
        subheader: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(207, 181, 59, 0.15)',
            color: oldGold,
          },
        },
        icon: {
          color: 'inherit',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          border: `1px solid ${oldGold}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121212',
          borderRadius: 12,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: oldGold,
          fontWeight: 600,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(207, 181, 59, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(207, 181, 59, 0.24)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(207, 181, 59, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(207, 181, 59, 0.24)',
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: oldGold,
        },
      },
    },
    // Custom styles for voice input components
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root.voice-active': {
            color: oldGold,
            animation: 'pulse 1.5s infinite',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: oldGold,
          color: '#000000',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#FFFFFF',
        },
        secondary: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardError: {
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#f44336',
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#4caf50',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          color: '#ff9800',
        },
        standardInfo: {
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          color: '#2196f3',
        },
      },
    },
  },
});

// Add responsive typography
theme = responsiveFontSizes(theme);

// Add custom keyframes for voice recording animation
theme.components.MuiCssBaseline.styleOverrides = {
  ...theme.components.MuiCssBaseline.styleOverrides,
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 rgba(207, 181, 59, 0.4)`,
    },
    '70%': {
      boxShadow: `0 0 0 10px rgba(207, 181, 59, 0)`,
    },
    '100%': {
      boxShadow: `0 0 0 0 rgba(207, 181, 59, 0)`,
    },
  },
  '.voice-recording-indicator': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 8px',
    backgroundColor: 'rgba(207, 181, 59, 0.1)',
    borderRadius: '16px',
    color: oldGold,
    fontSize: '0.75rem',
    fontWeight: 500,
    gap: '4px',
  },
  '.voice-recording-dot': {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: oldGold,
    animation: 'pulse 1.5s infinite',
  },
  '.voice-tooltip': {
    position: 'absolute',
    bottom: '100%',
    right: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      right: '10px',
      border: '5px solid transparent',
      borderTopColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
};

export default theme;

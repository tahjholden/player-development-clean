import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { supabase } from './lib/supabase';
import theme from './theme';

// Main components
import Layout from './components/Layout';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';

// Player related components
import PlayerList from './components/players/PlayerList';
import PlayerDetail from './components/players/PlayerDetail';

// Observation related components
import ObservationList from './components/observations/ObservationList';
import ObservationDetail from './components/observations/ObservationDetail';

// PDP related components
import PDPList from './components/pdps/PDPList';
import PDPDetail from './components/pdps/PDPDetail';

// Auth components
import Login from './components/auth/Login';

// Auth context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth provider component
const AuthProvider = ({ children }) => {
  console.log('AuthProvider mounted');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('AuthProvider getSession:', { session, error });
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        // Get user role from coaches table
        const { data: coachData } = await supabase
          .from('coaches')
          .select('is_admin')
          .eq('email', session.user.email)
          .single();
        setUserRole(coachData?.is_admin ? 'admin' : 'coach');
        console.log('AuthProvider coachData:', coachData);
      }
      setLoading(false);
      console.log('AuthProvider loading (after getSession):', false);
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider onAuthStateChange:', { session });
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        // Get user role from coaches table
        const { data: coachData } = await supabase
          .from('coaches')
          .select('is_admin')
          .eq('email', session.user.email)
          .single();
        setUserRole(coachData?.is_admin ? 'admin' : 'coach');
        console.log('AuthProvider coachData (onAuthStateChange):', coachData);
      } else {
        setUserRole(null);
      }
      setLoading(false);
      console.log('AuthProvider loading (after onAuthStateChange):', false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('AuthProvider state:', { user, session, loading, userRole });
  }, [user, session, loading, userRole]);

  // Fallback: if loading is false and user is null, redirect to login
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const value = {
    user,
    session,
    loading,
    userRole,
    isAdmin: userRole === 'admin',
    isAuthenticated: !!user,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#000'
          }}
        >
          <CircularProgress sx={{ color: '#CFB53B' }} />
        </Box>
      )}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: location.pathname } });
      } else if (requiredRole && requiredRole === 'admin' && userRole !== 'admin') {
        // Redirect to dashboard if role doesn't match required role
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, location, userRole, requiredRole]);
  
  if (loading) return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#000'
      }}
    >
      <CircularProgress sx={{ color: '#CFB53B' }} />
    </Box>
  );
  
  // Only render children if user exists and role matches (if required)
  if (user && (!requiredRole || requiredRole === userRole)) {
    return children;
  }
  
  // Return null while redirecting
  return null;
};

function App() {
  console.log('App.jsx loaded');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Players */}
              <Route path="players" element={<PlayerList />} />
              <Route path="players/:id" element={<PlayerDetail />} />
              <Route path="players/new" element={<PlayerDetail isNew={true} />} />
              
              {/* Observations */}
              <Route path="observations" element={<ObservationList />} />
              <Route path="observations/:id" element={<ObservationDetail />} />
              <Route path="observations/new" element={<ObservationDetail isNew={true} />} />
              
              {/* PDPs */}
              <Route path="pdps" element={<PDPList />} />
              <Route path="pdps/:id" element={<PDPDetail />} />
              <Route path="pdps/new" element={<PDPDetail isNew={true} />} />
              
              {/* Admin-only routes */}
              <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Box p={3}>
                    <h1>Admin Dashboard</h1>
                    <p>This area is only accessible to administrators.</p>
                  </Box>
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

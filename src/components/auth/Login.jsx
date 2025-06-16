import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#1a1a1a',
          color: '#fff'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#CFB53B',
                },
                '&:hover fieldset': {
                  borderColor: '#CFB53B',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#CFB53B',
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#CFB53B',
                },
                '&:hover fieldset': {
                  borderColor: '#CFB53B',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#CFB53B',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: '#CFB53B',
              '&:hover': {
                backgroundColor: '#b39b2e',
              },
            }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 
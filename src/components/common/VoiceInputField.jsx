import React, { useState, useRef, useEffect } from 'react';
import { VoiceService } from '../../lib/supabase';
import { 
  TextField, 
  IconButton, 
  Tooltip, 
  Box, 
  Typography,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon
} from '@mui/icons-material';

/**
 * VoiceInputField - A reusable component for text input with voice dictation support
 * 
 * @param {Object} props
 * @param {string} props.type - 'text' or 'textarea'
 * @param {string} props.value - Current value of the input
 * @param {function} props.onChange - Function to handle value changes
 * @param {string} props.label - Label for the input field
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether the field is required
 * @param {number} props.rows - Number of rows (for textarea)
 * @param {string} props.error - Error message
 * @param {boolean} props.fullWidth - Whether the field takes full width
 * @param {Object} props.inputProps - Additional props for the input element
 * @param {Object} props.sx - Additional styles
 * @param {string} props.id - ID for the input element
 * @param {string} props.name - Name for the input element
 * @param {function} props.onBlur - Function to handle blur event
 */
const VoiceInputField = ({
  type = 'text',
  value = '',
  onChange,
  label,
  placeholder = '',
  required = false,
  rows = 4,
  error = '',
  fullWidth = true,
  inputProps = {},
  sx = {},
  id,
  name,
  onBlur,
  ...rest
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle', 'recording', 'processing'
  const voiceService = useRef(null);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';
  
  // Initialize voice service
  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceService.current = new VoiceService();
      setIsVoiceSupported(voiceService.current.isSupported);
    }
    
    // Cleanup on unmount
    return () => {
      if (voiceService.current) {
        voiceService.current.stop();
      }
    };
  }, []);
  
  const handleVoiceToggle = () => {
    if (!voiceService.current || !isVoiceSupported) return;
    
    if (isRecording) {
      // Stop recording
      voiceService.current.stop();
      setIsRecording(false);
      setRecordingStatus('idle');
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingStatus('recording');
      
      voiceService.current.start(({ transcript, isFinal }) => {
        if (isFinal) {
          setRecordingStatus('processing');
          
          // Append transcript to current value
          const newValue = value ? `${value} ${transcript}` : transcript;
          onChange({ target: { value: newValue, name } });
          
          // Reset status after a short delay
          setTimeout(() => {
            setRecordingStatus('recording');
          }, 500);
        }
      });
    }
  };
  
  // Determine microphone button color based on status
  const getMicColor = () => {
    if (!isVoiceSupported) return 'text.disabled';
    if (isRecording) {
      return recordingStatus === 'processing' ? 'success.main' : oldGold;
    }
    return 'action.active';
  };
  
  // Get tooltip text based on voice support and recording status
  const getTooltipText = () => {
    if (!isVoiceSupported) return 'Voice dictation is not supported in your browser';
    if (isRecording) return 'Click to stop voice dictation';
    return 'Tap the mic to dictate, or type manually';
  };
  
  // Determine if we should show the recording animation
  const showRecordingAnimation = isRecording && recordingStatus === 'recording';
  
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        type={type === 'textarea' ? 'text' : type}
        multiline={type === 'textarea'}
        rows={type === 'textarea' ? rows : undefined}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        error={!!error}
        helperText={error}
        fullWidth={fullWidth}
        id={id}
        name={name}
        onBlur={onBlur}
        InputProps={{
          ...inputProps,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={getTooltipText()}>
                <span>
                  <IconButton
                    onClick={handleVoiceToggle}
                    disabled={!isVoiceSupported}
                    className={isRecording ? 'voice-active' : ''}
                    sx={{ 
                      color: getMicColor(),
                      '&.voice-active': {
                        animation: 'pulse 1.5s infinite'
                      }
                    }}
                    aria-label={isRecording ? "Stop dictation" : "Start dictation"}
                  >
                    {isRecording ? <MicIcon /> : <MicOffIcon />}
                  </IconButton>
                </span>
              </Tooltip>
              {recordingStatus === 'processing' && (
                <CircularProgress size={16} sx={{ ml: 1, color: 'success.main' }} />
              )}
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': { 
            backgroundColor: '#1a1a1a', 
            color: 'white',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: oldGold
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.7)'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: oldGold
          },
          ...sx
        }}
        {...rest}
      />
      
      {/* Recording overlay animation */}
      {showRecordingAnimation && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 2,
              borderRadius: '4px',
              boxShadow: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                className="voice-recording-dot" 
                sx={{ 
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: oldGold,
                  animation: 'pulse 1.5s infinite'
                }} 
              />
              <Typography variant="caption" sx={{ color: oldGold, fontWeight: 'medium' }}>
                Listening...
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VoiceInputField;

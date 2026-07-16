import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Link,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import apiService from '../../services/api';

const OfferResponsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const responseType = searchParams.get('response');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token && responseType) {
      handleAutoResponse();
    }
  }, [token, responseType]);

  const handleAutoResponse = async () => {
    if (!token) {
      setError('Invalid or missing token');
      return;
    }

    const validResponse = responseType?.toUpperCase();
    if (validResponse !== 'ACCEPT' && validResponse !== 'DECLINE') {
      setError('Invalid response type');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.respondToOffer(
        token,
        validResponse as 'ACCEPT' | 'DECLINE'
      );
      setSuccess(true);
      setMessage(result.message);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to process your response. The link may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Processing your response...
        </Typography>
      </Box>
    );
  }

  if (success) {
    const isAccepted = responseType?.toUpperCase() === 'ACCEPT';
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ py: 4 }}>
            {isAccepted ? (
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            ) : (
              <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            )}
            <Typography variant="h5" gutterBottom>
              {isAccepted ? 'Offer Accepted!' : 'Offer Declined'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            {isAccepted && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You will receive further instructions via email regarding the admission
                process.
              </Alert>
            )}
            <Link component={RouterLink} to="/login">
              <Button variant="contained">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login">
            <Button variant="outlined">Go to Login</Button>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Invalid Request
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please use the link provided in your email.
      </Typography>
      <Link component={RouterLink} to="/login">
        <Button variant="outlined">Go to Login</Button>
      </Link>
    </Box>
  );
};

export default OfferResponsePage;
// src/components/LoginModal.tsx
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void; // optional callback after successful login
}

// TypeScript interface for the mutation response
interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

// GraphQL login mutation
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export default function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);

  // Use mutation with typed response
  const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);

    try {
      const { data } = await loginMutation({ variables: { email, password } });
      const token = data?.login?.token;

      if (token) {
        localStorage.setItem('token', token); // save token to localStorage
        if (onLoginSuccess) onLoginSuccess(); // notify parent about login
        onClose(); // close the modal
      }
    } catch (err: any) {
      setLoginError(err);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loginLoading}
        >
          {loginLoading ? 'Logging in...' : 'Login'}
        </Button>

        {loginError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {loginError.message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

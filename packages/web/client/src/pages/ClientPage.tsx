// // src/pages/ClientsPage.tsx
// import { useQuery } from '@apollo/client/react';
// import { gql } from '@apollo/client';
// import { 
//   Grid, 
//   Typography, 
//   Paper, 
//   Box, 
//   Divider, 
//   Chip, 
//   Stack,
//   Skeleton,
//   useTheme,
//   useMediaQuery,
//   Button
// } from '@mui/material';
// import ClientCard from '../components/ClientCard';
// import { useState } from 'react';
// import AddClientForm from '../components/AddClientForm';

// interface Project {
//   id: number;
//   name: string;
// }

// interface Client {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   projects: Project[];
// }

// interface GetClientsData {
//   clients: Client[];
// }

// const GET_CLIENTS = gql`
//   query GetClients {
//     clients {
//       id
//       name
//       email
//       phone
//       projects { id name }
//     }
//   }
// `;

// export default function ClientsPage() {
//   const { data, loading, error, refetch } = useQuery<GetClientsData>(GET_CLIENTS);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <Box sx={{ 
//       p: isMobile ? 2 : 3, 
//       background: 'linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 30%, #f8f9ff 100%)',
//       minHeight: '100vh'
//     }}>
//       <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
//         {/* Header */}
//         <Box sx={{ textAlign: 'center', mb: 5 }}>
//           <Typography 
//             variant="h3" 
//             sx={{ 
//               fontWeight: 800, 
//               background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 30%, #60A5FA 100%)',
//               backgroundClip: 'text',
//               textFillColor: 'transparent',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               fontSize: isMobile ? '2rem' : '3rem',
//               letterSpacing: '-0.5px',
//               mb: 1
//             }}
//           >
//             Client Portfolio
//           </Typography>
//           <Typography 
//             variant="subtitle1" 
//             sx={{ 
//               color: 'secondary.main',
//               fontWeight: 500,
//               fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
//               fontStyle: 'italic',
//               letterSpacing: '0.5px',
//               maxWidth: 600,
//               mx: 'auto',
//               fontSize: isMobile ? '1rem' : '1.2rem',
//               textShadow: '0 1px 3px rgba(156, 39, 176, 0.4)'
//             }}
//           >
//             Manage all your client relationships and projects in one place
//           </Typography>
//         </Box>

//         {/* Error */}
//         {error && (
//           <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
//             <Typography variant="h6" color="error" align="center">
//               Error: {error.message}
//             </Typography>
//           </Box>
//         )}

//         {/* Loading */}
//         {loading && !error && (
//           <Grid container spacing={isMobile ? 2 : 3}>
//             {[...Array(6)].map((_, index) => (
//               <Grid key={index}>
//                 <Skeleton 
//                   variant="rounded" 
//                   width="100%" 
//                   height={320} 
//                   sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)' }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         )}

//         {/* Clients Grid */}
//         {!loading && !error && data?.clients && (
//           <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
//             {data?.clients?.map((client) => (
//               <Grid key={client.id} sx={{ display: 'flex' }}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     borderRadius: 3,
//                     background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
//                     boxShadow: '0 10px 35px rgba(37, 99, 235, 0.1), 0 4px 15px rgba(0, 0, 0, 0.05)',
//                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                     border: '1px solid rgba(255, 255, 255, 0.7)',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     width: '100%',
//                     position: 'relative',
//                     overflow: 'hidden',
//                     '&:before': {
//                       content: '""',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       height: 4,
//                       background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
//                     },
//                     '&:hover': {
//                       transform: 'translateY(-8px) scale(1.01)',
//                       boxShadow: '0 15px 45px rgba(37, 99, 235, 0.2), 0 5px 20px rgba(0, 0, 0, 0.08)',
//                       background: 'linear-gradient(145deg, #f8faff 0%, #f0f4ff 100%)',
//                       borderColor: 'rgba(37, 99, 235, 0.2)',
//                     },
//                   }}
//                 >
//                   <ClientCard client={client} onRemoved={() => refetch()} />

//                   <Divider sx={{ my: 2, background: 'linear-gradient(to right, transparent, rgba(37, 99, 235, 0.2), transparent)', height: '1px', border: 'none' }} />

//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
//                     <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
//                       {client?.projects?.length}
//                     </Box>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
//                       Active Projects
//                     </Typography>
//                   </Box>

//                   <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, '& .MuiChip-root': { m: 0 } }}>
//                     {client?.projects?.map((project) => (
//                       <Chip key={project.id} label={project.name} size="small" sx={{ fontWeight: 500, background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)', color: 'white', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)', '&:hover': { background: 'linear-gradient(45deg, #1D4ED8 0%, #2563EB 100%)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }, transition: 'all 0.2s ease' }} />
//                     ))}
//                     {client?.projects?.length === 0 && (
//                       <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//                         No projects assigned yet
//                       </Typography>
//                     )}
//                   </Stack>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         )}

//         {/* Add Client Button */}
//         <Box sx={{ textAlign: 'center', mb: 5, py: 9 }}>
//           <Button variant="contained" onClick={() => setShowForm(!showForm)}>
//             {showForm ? 'Cancel' : '+ Add Client'}
//           </Button>
//         </Box>

//         {/* Add Client Form */}
//         {showForm && <AddClientForm onAdded={() => refetch()} />}
//       </Box>
//     </Box>
//   );
// }
// src/pages/ClientsPage.tsx
import { useMutation, useQuery } from '@apollo/client/react';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Chip, 
  Stack,
  Skeleton,
  useTheme,
  useMediaQuery,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ClientCard from '../components/ClientCard';
import { useState } from 'react';
import AddClientForm from '../components/AddClientForm';
import { gql } from '@apollo/client';

interface Project {
  id: number;
  name: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  projects: Project[];
}

interface GetClientsData {
  clients: Client[];
}

// Queries & Mutations
const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
      phone
      projects { id name }
    }
  }
`;

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
    }
  }
`;

export default function ClientsPage() {
  const { data, loading, error, refetch } = useQuery<GetClientsData>(GET_CLIENTS);
  const [deleteClient] = useMutation(DELETE_CLIENT);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showForm, setShowForm] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' }>({ open: false, message: '', severity: 'success' });

  // Delete confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; clientId: string | number; clientName: string }>({ open: false, clientId: 0, clientName: '' });

  // Handle delete button click
  const handleDeleteClick = (clientId: string | number, clientName: string) => {
    setConfirmDialog({ open: true, clientId, clientName });
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    const { clientId } = confirmDialog;
    setConfirmDialog({ ...confirmDialog, open: false });

    try {
      await deleteClient({ variables: { id: clientId } });
      setSnackbar({ open: true, message: 'Client deleted successfully!', severity: 'success' });
      refetch();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete client', severity: 'error' });
    }
  };

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 3, 
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 30%, #f8f9ff 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 30%, #60A5FA 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: isMobile ? '2rem' : '3rem',
              letterSpacing: '-0.5px',
              mb: 1
            }}
          >
            Client Portfolio
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'secondary.main',
              fontWeight: 500,
              fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              fontStyle: 'italic',
              letterSpacing: '0.5px',
              maxWidth: 600,
              mx: 'auto',
              fontSize: isMobile ? '1rem' : '1.2rem',
              textShadow: '0 1px 3px rgba(156, 39, 176, 0.4)'
            }}
          >
            Manage all your client relationships and projects in one place
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography variant="h6" color="error" align="center">
              Error: {error.message}
            </Typography>
          </Box>
        )}

        {/* Loading */}
        {loading && !error && (
          <Grid container spacing={isMobile ? 2 : 3}>
            {[...Array(6)].map((_, index) => (
              <Grid key={index}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={320} 
                  sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)' }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Clients Grid */}
        {!loading && !error && data?.clients && (
          <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
            {data?.clients?.map((client) => (
              <Grid key={client.id} sx={{ display: 'flex' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                    boxShadow: '0 10px 35px rgba(37, 99, 235, 0.1), 0 4px 15px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.01)',
                      boxShadow: '0 15px 45px rgba(37, 99, 235, 0.2), 0 5px 20px rgba(0, 0, 0, 0.08)',
                      background: 'linear-gradient(145deg, #f8faff 0%, #f0f4ff 100%)',
                      borderColor: 'rgba(37, 99, 235, 0.2)',
                    },
                  }}
                >
                  <ClientCard 
                    client={client} 
                    onRemoved={() => refetch()} 
                    onDelete={() => handleDeleteClick(client.id, client.name)}
                  />

                  <Divider sx={{ my: 2, background: 'linear-gradient(to right, transparent, rgba(37, 99, 235, 0.2), transparent)', height: '1px', border: 'none' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                      {client?.projects?.length}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Active Projects
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, '& .MuiChip-root': { m: 0 } }}>
                    {client?.projects?.map((project) => (
                      <Chip key={project.id} label={project.name} size="small" sx={{ fontWeight: 500, background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)', color: 'white', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)', '&:hover': { background: 'linear-gradient(45deg, #1D4ED8 0%, #2563EB 100%)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }, transition: 'all 0.2s ease' }} />
                    ))}
                    {client?.projects?.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No projects assigned yet
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Client Button */}
        <Box sx={{ textAlign: 'center', mb: 5, py: 9 }}>
          <Button variant="contained" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Client'}
          </Button>
        </Box>

        {/* Add Client Form */}
        {showForm && <AddClientForm onAdded={() => refetch()} />}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{confirmDialog.clientName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

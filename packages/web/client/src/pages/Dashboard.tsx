
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Skeleton, useTheme, useMediaQuery, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ClientCard from '../components/ClientCard';
import ProjectCard from '../components/ProjectCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import LoginModal from '../components/LoginModal';

// ----------------------- Types -----------------------
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  client: { id: number; name: string };
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  projects: { id: number; name: string }[];
}

interface GetDashboardData {
  clients: Client[];
  projects: Project[];
}

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

// ----------------------- GraphQL -----------------------
const GET_DASHBOARD = gql`
  query GetDashboard {
    clients {
      id
      name
      email
      phone
      projects {
      id
      name
    }
      
    }
    projects {
      id
      name
      description
      status
      
    }
  }
`;

// ----------------------- Component -----------------------
export default function DashboardPage() {
  const { data, loading, error, refetch } = useQuery<GetDashboardData>(GET_DASHBOARD);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const client = useApolloClient(); // <-- Call hook at top level

  // ----------------------- Refetch on mount -----------------------
  useEffect(() => {
    refetch();
  }, [refetch]);

  // ----------------------- Login modal state -----------------------
  const [loginOpen, setLoginOpen] = useState(false);

  // ----------------------- Called after login success -----------------------
  const handleLoginSuccess = () => {
    client.resetStore(); // Reset Apollo cache to reflect authenticated user
    setLoginOpen(false); // Close login modal
    navigate('/clients'); // Redirect after login
    console.log('Login successful, token saved, Apollo store reset.');
  };

  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
      <Typography variant="h6">Error: {error.message}</Typography>
    </Box>
  );

  // ----------------------- PieChart data -----------------------
  const pieData = [
    { name: 'Not Started', value: data?.projects.filter(p => p.status === 'Not Started').length ?? 0 },
    { name: 'In Progress', value: data?.projects.filter(p => p.status === 'In Progress').length ?? 0 },
    { name: 'Completed', value: data?.projects.filter(p => p.status === 'Completed').length ?? 0 },
  ];
  const COLORS = ['#FFBB28', '#0088FE', '#00C49F'];

  return (
    <Box sx={{ p: isMobile ? 2 : 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 30%, #f8f9ff 100%)' }}>
      
      {/* Login Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setLoginOpen(true)}>
          Login
        </Button>
      </Box>

      {/* Login Modal */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* ----------------------- Header ----------------------- */}
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Dashboard
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
              textShadow: '0 1px 3px rgba(156, 39, 176, 0.4)',
            }}
          >
            Manage clients, projects, and performance at a glance
          </Typography>
        </Box>

        {/* ----------------------- Stats & PieChart ----------------------- */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: 'Total Clients', value: data?.clients.length },
            { label: 'Total Projects', value: data?.projects.length },
            { label: 'Not Started Projects', value: data?.projects.filter(p => p.status === 'Not Started').length },
            { label: 'In Progress Projects', value: data?.projects.filter(p => p.status === 'In Progress').length },
            { label: 'Completed Projects', value: data?.projects.filter(p => p.status === 'Completed').length },
          ].map((stat, i) => (
            <Grid key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {loading ? <Skeleton width={80} /> : stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}

          <Grid>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                height: 300,
                width: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Project Status Distribution
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      label={(props: any) => {
                        const { name, percent } = props;
                        return `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`;
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value}`, name]}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {pieData.map((entry, index) => (
                  <Stack key={index} direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 14, height: 14, backgroundColor: COLORS[index], borderRadius: '50%' }} />
                    <Typography variant="caption">{entry.name}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* ----------------------- Clients Section ----------------------- */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
            Clients
          </Typography>
          <Grid container spacing={3}>
            {loading
              ? [...Array(4)].map((_, i) => (
                  <Grid key={i}><Skeleton variant="rounded" height={170} sx={{ borderRadius: 3 }} /></Grid>
                ))
              : data?.clients.map(client => (
                  <Grid key={client.id}>
                    <ClientCard
                      client={{ ...client, email: client.email ?? '', phone: client.phone ?? '' }}
                      showDelete={false}
                      onRemoved={() => refetch()}
                    />
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* ----------------------- Projects Section ----------------------- */}
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
            Projects
          </Typography>
          <Grid container spacing={3}>
            {loading
              ? [...Array(4)].map((_, i) => (
                  <Grid key={i}><Skeleton variant="rounded" height={170} sx={{ borderRadius: 3 }} /></Grid>
                ))
              : data?.projects.map(project => (
                  <Grid key={project.id}>
                    <ProjectCard
                      project={{ ...project, description: project.description ?? '' }}
                      showDelete={false}
                      onRemoved={() => refetch()}
                    />
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

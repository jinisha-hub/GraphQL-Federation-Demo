import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { 
  Grid, Typography, Box, Paper, Divider, Chip, Stack, Skeleton, useTheme, useMediaQuery, 
  Button
} from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import { useEffect, useState } from 'react';
import AddProjectForm from '../components/AddProjectForm';

interface ClientType {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  client: ClientType;
}

interface GetProjectsData {
  projects: Project[];
}

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      client {
        id
        name
      }
    }
  }
`;

export default function ProjectsPage() {
  // ----------------------- Hooks at the top -----------------------
  const { data, loading, error, refetch } = useQuery<GetProjectsData>(GET_PROJECTS);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // ----------------------- Early return for error -----------------------
  if (error) return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Typography variant="h6" color="error" align="center">
        Error: {error.message}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 3, 
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 30%, #f8f9ff 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        {/* ----------------------- Header ----------------------- */}
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
            Projects Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'secondary.main',
              fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '0.5px',
              maxWidth: 600,
              mx: 'auto',
              fontSize: isMobile ? '1rem' : '1.2rem',
              textShadow: '0 1px 3px rgba(156, 39, 176, 0.4)'
            }}
          >
            Manage all your projects and associated clients in one place
          </Typography>
        </Box>

        {/* ----------------------- Projects Grid ----------------------- */}
        {loading ? (
          <Grid container spacing={isMobile ? 2 : 3}>
            {[...Array(6)].map((_, index) => (
              <Grid key={index} >
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={320} 
                  sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)' }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
            {data?.projects.map((project) => (
              <Grid key={project.id} sx={{ display: 'flex' }}>
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
                  {/* Project Card Component */}
                  <ProjectCard 
                    project={project} 
                    onRemoved={() => refetch()}   // 🔥 refetch after edit/delete
                  />

                  <Divider sx={{ 
                    my: 2, 
                    background: 'linear-gradient(to right, transparent, rgba(37, 99, 235, 0.2), transparent)',
                    height: '1px',
                    border: 'none'
                  }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Client:{" "}
                      <Box component="span" sx={{ color: 'primary.main' }}>
                        {project.client.name}
                      </Box>
                    </Typography>
                  </Box>

                  <Chip 
                    label={project.status} 
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: project.status === "Completed" 
                        ? 'linear-gradient(45deg, #16A34A 0%, #22C55E 100%)'
                        : project.status === "In Progress"
                        ? 'linear-gradient(45deg, #F59E0B 0%, #FBBF24 100%)'
                        : 'linear-gradient(45deg, #EF4444 0%, #F87171 100%)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>


<Box sx={{ textAlign: 'center', mb: 5, py: 9 }}>
          <Button variant="contained" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Project'}
          </Button>
        </Box>

      {/* ----------------------- Add Project Form ----------------------- */}
      {showForm && <AddProjectForm onAdded={() => refetch()} />}
    </Box>
  );
}

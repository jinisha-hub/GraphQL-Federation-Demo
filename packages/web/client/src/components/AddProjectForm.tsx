import { Box, TextField, Button, Stack, MenuItem, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

interface Client {
  id: number;
  name: string;
}

interface GetClientsNoProjectsData {
  clientsWithoutProjects: Client[];
}

const GET_CLIENTS_NO_PROJECTS = gql`
  query GetClientsNoProjects {
    clientsWithoutProjects {
      id
      name
    }
  }
`;

const ADD_PROJECT = gql`
  mutation AddProject($name: String!, $description: String!, $status: String!, $clientId: ID!) {
    addProject(name: $name, description: $description, status: $status, clientId: $clientId) {
      name
      description
      status
      client { name }
    }
  }
`;

export default function AddProjectForm({ onAdded }: { onAdded: () => void }) {
  const { data, loading ,refetch} = useQuery<GetClientsNoProjectsData>(GET_CLIENTS_NO_PROJECTS);
  const [form, setForm] = useState({ name: '', description: '', status: 'Active', clientId: '' });
  const [addProject] = useMutation(ADD_PROJECT);
  // inside your ProjectsPage component, after useQuery
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.status || !form.clientId) return;
  
    await addProject({
      variables: { ...form, clientId: Number(form.clientId) },
    });
  
    setForm({ name: '', description: '', status: 'Not Started', clientId: '' });
    onAdded();
  
    // Refetch clients without projects to update dropdown
    refetch();
  };
  

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack spacing={1}>
        <TextField
          label="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          size="small"
          fullWidth
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          size="small"
          fullWidth
        />
        <TextField
  select
  label="Status"
  value={form.status}
  onChange={e => setForm({ ...form, status: e.target.value })}
  size="small"
  fullWidth
>
  <MenuItem value="Not Started">Not Started</MenuItem>
  <MenuItem value="In Progress">In Progress</MenuItem>
  <MenuItem value="Completed">Completed</MenuItem>
</TextField>
        <TextField
          select
          label="Select Client"
          value={form.clientId}
          onChange={e => setForm({ ...form, clientId: e.target.value })}
          size="small"
          fullWidth
        >
          {data?.clientsWithoutProjects.map(client => (
            <MenuItem key={client.id} value={client.id}>
              {client.name} (ID: {client.id})
            </MenuItem>
          ))}
          {data?.clientsWithoutProjects.length === 0 && (
            <MenuItem disabled>No clients available</MenuItem>
          )}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>Add Project</Button>
      </Stack>
    </Box>
  );
}

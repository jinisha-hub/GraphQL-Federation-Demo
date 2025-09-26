import { Box, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const ADD_CLIENT = gql`
  mutation AddClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) { id name email phone projects { id name } }
  }
`;

export default function AddClientForm({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [addClient] = useMutation(ADD_CLIENT);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    await addClient({ variables: { ...form } });
    setForm({ name: '', email: '', phone: '' });
    onAdded(); // callback to refresh
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack spacing={1}>
        <TextField label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} size="small" fullWidth />
        <TextField label="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} size="small" fullWidth />
        <TextField label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} size="small" fullWidth />
        <Button variant="contained" onClick={handleSubmit}>Add Client</Button>
      </Stack>
    </Box>
  );
}

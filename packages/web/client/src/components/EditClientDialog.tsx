import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { gql } from '@apollo/client';
import {  useMutation } from '@apollo/client/react';

interface EditClientDialogProps {
  open: boolean;
  client: { id: number; name: string; email: string; phone: string };
  onClose: () => void;
  onUpdated: () => void;
}

const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $name: String, $email: String, $phone: String) {
    updateClient(id: $id, name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export default function EditClientDialog({ open, client, onClose, onUpdated }: EditClientDialogProps) {
  const [form, setForm] = useState({ name: client.name, email: client.email, phone: client.phone });
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const handleSubmit = async () => {
    await updateClient({
      variables: { id: client.id, ...form },
    });
    onUpdated(); // refresh parent
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Client</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, width: 400 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

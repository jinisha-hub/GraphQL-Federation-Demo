import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Stack,
  } from "@mui/material";
  import { useState } from "react";
  import { gql } from '@apollo/client';
import {  useQuery,useMutation } from '@apollo/client/react';
  
  interface ClientType {
    id: number;
    name: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    client?: ClientType;
  }
  
  interface EditProjectDialogProps {
    project: Project;
    onClose: () => void;
    onUpdated: () => void;
  }
  
  const UPDATE_PROJECT = gql`
    mutation UpdateProject(
      $id: ID!
      $name: String
      $description: String
      $status: String
      $clientId: ID
    ) {
      updateProject(
        id: $id
        name: $name
        description: $description
        status: $status
        clientId: $clientId
      ) {
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
  
  const GET_CLIENTS = gql`
    query GetClients {
      clients {
        id
        name
      }
    }
  `;
  
  export default function EditProjectDialog({
    project,
    onClose,
    onUpdated,
  }: EditProjectDialogProps) {
    const { data } = useQuery<{ clients: ClientType[] }>(GET_CLIENTS);
  
    const [form, setForm] = useState({
      name: project.name,
      description: project.description,
      status: project.status,
      clientId: project.client?.id?.toString() || "", // ensure always string
    });
  
    const [updateProject] = useMutation(UPDATE_PROJECT);
  
    const handleSubmit = async () => {
      await updateProject({
        variables: {
          id: project.id,
          name: form.name,
          description: form.description,
          status: form.status,
          clientId: form.clientId === "" ? null : Number(form.clientId), // null if none selected
        },
      });
      onUpdated(); // refetch parent
      onClose();
    };
  
    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              fullWidth
            >
              {["Not Started", "In Progress", "Completed"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
  
            <TextField
              select
              label="Client"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {data?.clients?.map((client) => (
                <MenuItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
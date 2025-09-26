
import { Card, CardContent, Typography, Stack } from '@mui/material';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import EditProjectDialog from './EditProjectDialog';
import EditIcon from '@mui/icons-material/Edit';

interface ClientType {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  client: ClientType;
  //client: { id: number; name: string }; 
}

interface ProjectCardProps {
  project: Project;
  onRemoved?: () => void;
  showDelete?: boolean;
}

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export default function ProjectCard({ project, onRemoved, showDelete = true }: ProjectCardProps) {
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [editOpen, setEditOpen] = useState(false);

  // Refetch when component mounts
  useEffect(() => {
    onRemoved?.();
  }, [onRemoved]);

  const handleDelete = async () => {
    await deleteProject({ variables: { id: project.id } });
    onRemoved?.();
  };

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          p: 1,
          width: 300,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {project.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {project.description}
          </Typography>
        </CardContent>
        

        {/* Actions */}
        {showDelete && (
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}
              onClick={handleEditOpen}
            >
              <EditIcon fontSize="small" sx={{ mr: 0.5 }} /> Edit
            </Typography>

            <Typography
              variant="body2"
              color="error"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={handleDelete}
            >
              Delete
            </Typography>
          </Stack>
        )}
      </Card>

      {/* Edit Dialog */}
      {editOpen && (
        <EditProjectDialog
          project={project}
          onClose={handleEditClose}
          onUpdated={onRemoved ?? (() => {})} // fallback to empty function if undefined
        />
      )}
    </>
  );
}



// import { Card, CardContent, Typography, Stack, Grid } from '@mui/material';
// import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';
// import WorkIcon from '@mui/icons-material/Work';
// import EditIcon from '@mui/icons-material/Edit';
// import { gql } from '@apollo/client';
// import { useMutation } from '@apollo/client/react';
// import { useState, useEffect } from 'react';
// import EditClientDialog from './EditClientDialog';

// interface Project { id: number; name: string; }
// interface Client { id: number; name: string; email: string; phone: string; projects: Project[]; }

// const DELETE_CLIENT = gql`
//   mutation DeleteClient($id: ID!) {
//     deleteClient(id: $id) { id }
//   }
// `;

// export default function ClientCard({
//   client,
//   onRemoved,
//   showDelete = true
// }: { client: Client; onRemoved?: () => void; showDelete?: boolean }) {
//   const [deleteClient] = useMutation(DELETE_CLIENT);
//   const [openEdit, setOpenEdit] = useState(false);

//   const handleDelete = async () => {
//     await deleteClient({ variables: { id: client.id } });
//     onRemoved?.(); // trigger parent refetch
//   };

//   // Refetch on mount
//   useEffect(() => {
//     onRemoved?.();
//   }, [onRemoved]);
  
//   return (
//     <>
//       <Card sx={{ borderRadius: 3, boxShadow: 3, p: 1, width: 300, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//         <CardContent sx={{ flexGrow: 1 }}>
//           <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>{client.name}</Typography>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <EmailIcon fontSize="small" sx={{ color: 'secondary.main' }} />
//             <Typography variant="body2" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>{client.email}</Typography>
//           </Stack>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <PhoneIcon fontSize="small" sx={{ color: 'success.main' }} />
//             <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>{client.phone}</Typography>
//           </Stack>

//           <Grid container spacing={1} sx={{ mt: 1 }}>
//             {client?.projects?.map(project => (
//               <Grid key={project.id}>
//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <WorkIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//                   <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{project.name}</Typography>
//                 </Stack>
//               </Grid>
//             ))}
//           </Grid>
//         </CardContent>
        

//         {showDelete && (
//           <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}
//               onClick={() => setOpenEdit(true)}
//             >
//               <EditIcon fontSize="small" sx={{ mr: 0.5 }} /> Edit
//             </Typography>

//             <Typography
//               variant="body2"
//               color="error"
//               sx={{ cursor: 'pointer', fontWeight: 600 }}
//               onClick={handleDelete}
//             >
//               Delete
//             </Typography>
//           </Stack>
//         )}
//       </Card>

//       {/* Edit Client Popup */}
//       {openEdit && (
//         <EditClientDialog
//           open={openEdit}
//           client={client}
//           onClose={() => setOpenEdit(false)}
//           onUpdated={onRemoved ?? (() => {})}
//         />
//       )}
//     </>
//   );
// }
import { Card, CardContent, Typography, Stack, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import EditClientDialog from './EditClientDialog';

interface Project { id: number; name: string; }
interface Client { id: number; name: string; email: string; phone: string; projects: Project[]; }

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) { id }
  }
`;

interface ClientCardProps {
  client: Client;
  onRemoved?: () => void;
  onDelete?: () => void;       // <-- add this
  showDelete?: boolean;
}

export default function ClientCard({
  client,
  onRemoved,
  onDelete,
  showDelete = true
}: ClientCardProps) {
  const [deleteClient] = useMutation(DELETE_CLIENT);
  const [openEdit, setOpenEdit] = useState(false);

  // If parent provided an onDelete, call it; else fallback to internal delete
  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
      return;
    }

    try {
      await deleteClient({ variables: { id: client.id } });
      onRemoved?.(); // trigger parent refetch
    } catch (err: any) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 1, width: 300, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>{client.name}</Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon fontSize="small" sx={{ color: 'secondary.main' }} />
            <Typography variant="body2" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>{client.email}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon fontSize="small" sx={{ color: 'success.main' }} />
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>{client.phone}</Typography>
          </Stack>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            {client?.projects?.map(project => (
              <Grid key={project.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{project.name}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>

        {showDelete && (
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}
              onClick={() => setOpenEdit(true)}
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

      {/* Edit Client Popup */}
      {openEdit && (
        <EditClientDialog
          open={openEdit}
          client={client}
          onClose={() => setOpenEdit(false)}
          onUpdated={onRemoved ?? (() => {})}
        />
      )}
    </>
  );
}

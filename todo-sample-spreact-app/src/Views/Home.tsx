import React, { useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Box, Fab, IconButton, Paper, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserContext from '../AppContext/UserContext';
import { INote } from '../Models/INote';
import DeleteIcon from '@mui/icons-material/Delete';

function Home() {
    const [__notes, __setNotes] = useState<INote[]>([]);
    const context = React.useContext(UserContext);

    useEffect(() => {
        context.DefaultSPListProvider.getNotes().then((n) => {
            if (n != null) {
                __setNotes(n);
            }
        });
    }, [context.DefaultSPListProvider]);

    return <AppLayout>
        <Fab
            onClick={(e) => {
                window.location.hash = "/notes/new";
                e.preventDefault();
            }}
            color="secondary"
            sx={{
                position: 'absolute',
                bottom: 40,
                right: (theme) => theme.spacing(5),
            }}
        >
            <AddIcon />
        </Fab>
        <Stack flexDirection={'row'} flexWrap={'wrap'}> 
        {__notes.map((note, index) => (
                    <Paper key={note.title} sx={{cursor:'pointer', backgroundColor:'#b2d9ff',  margin:'10px', padding:'10px', minWidth:{ xs: '90%', md : '200px' }}}>
                        <Box
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.hash = '/notes/' + note.id;
                            }}
                        >
                            <Typography>{note.title}</Typography>
                            <IconButton sx={{float:'right'}} onClick={(e) => {
                                context.AppNotificationService.postToastMessage('Note Deleted!');
                                e.preventDefault();
                                context.DefaultSPListProvider.deleteNote(note.id).then((v) => {
                                    if (v) {
                                        context.DefaultSPListProvider.getNotes().then((n) => {
                                            if (n != null) {
                                                __setNotes(n);
                                            }
                                        });
                                    }
                                })
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
        </Stack>
    </AppLayout>
}

export default Home;
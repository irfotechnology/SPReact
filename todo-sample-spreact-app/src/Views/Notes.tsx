import React, { useContext, useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { useParams } from 'react-router-dom';
import { Box, Fab, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save'
import { INote } from '../Models/INote';
import UserContext from '../AppContext/UserContext';

function Notes() {
    const __id = useParams()['id'];
    const [__note, __setNote] = useState<INote>({ id: -1, title: '', content: '' });
    const [__title, __setTitle] = useState('');
    const [__content, __setContent] = useState('');
    const context = useContext(UserContext);

    useEffect(() => {
        if (__id === 'new') {
            __setNote({ id: -1, title: '', content: '' });
            __setTitle('');
            __setContent('');
        }
        else if (__id !== 'new' && !isNaN(Number(__id))) {
            context.AppNotificationService.isLoading(true);
            context.DefaultSPListProvider.getNoteById(Number(__id)).then((n) => {
                if (n != null) {
                    __setNote(n);
                    __setTitle(n.title);
                    __setContent(n.content);
                    context.AppNotificationService.isLoading(false);
                }
            });
        }
    }, [__id,context.AppNotificationService,context.DefaultSPListProvider]);

    return <AppLayout>
        <Box position='sticky' top={'100px'} zIndex={100} >
            <Fab
                onClick={(e) => {
                    if (__note.id === -1) {
                        context.AppNotificationService.isLoading(true);
                        context.DefaultSPListProvider.addNote(__note).then((n) => {
                            context.AppNotificationService.isLoading(false);
                            context.AppNotificationService.postToastMessage('Note Saved!');
                            window.location.hash = '/notes/' + n;
                        });
                    }
                    else {
                        context.AppNotificationService.isLoading(true);
                        context.DefaultSPListProvider.updateNote((__note as INote)).then((n) => {
                            context.AppNotificationService.isLoading(false);
                            context.AppNotificationService.postToastMessage('Note Saved!');
                        });
                    }
                    e.preventDefault();
                }}
                color="primary"
                sx={{
                    position: 'absolute',
                    //top: "120px",
                    right: (theme) => theme.spacing(__id === 'new' ? '0px' : '60px'),
                }}
            >
                <SaveIcon />
            </Fab>
            {__id !== 'new' ? <Fab
                onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '/notes/new';
                    window.location.reload();
                }}
                color="secondary"
                sx={{
                    position: 'absolute',
                    //top: "120px",
                    right: (theme) => theme.spacing('0px'),
                }}
            >
                <AddIcon />
            </Fab>
                : <></>}
        </Box>
        <Box sx={{ width: '100%', minHeight: (window.innerHeight - 110) + 'px' }}>
            <TextField size='medium' InputProps={{ sx: { fontSize: 40 } }} minRows={1} placeholder='Title'
                fullWidth multiline id="txt_title" defaultValue={__title} variant="standard" onChange={(e) => {
                    __note.title = e.target.value;
                    __setTitle(__note.title);
                    __setNote(__note);
                }} />
            <Paper sx={{ padding: 2 }} elevation={12}>
                <TextField size='small' InputProps={{ disableUnderline: true, sx: { minHeight: (window.innerHeight - 240) + 'px', alignItems: 'baseline' } }}
                    fullWidth multiline id="txt_content" defaultValue={__content} variant='standard' onChange={(e) => {
                        __note.content = e.target.value;
                        __setContent(__note.content);
                        __setNote(__note);
                    }} />
            </Paper>
        </Box>
    </AppLayout>;
}

export default Notes;

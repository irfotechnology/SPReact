import React, { useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { useParams } from 'react-router-dom';
import { Box, Fab, Paper, TextField } from '@mui/material';
import NoteProvider from '../Providers/NoteProvider';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save'
import { INote } from '../Models/INote';
import BaseView from './BaseView';


function Notes() {
    const __id = useParams()['id'];
    const [__note, __setNote] = useState<INote>({ id: -1, title: '', content: '' });
    const [__title, __setTitle] = useState('');
    const [__content, __setContent] = useState('');
    const [__isLoading, __setIsLoading] = useState(false);

    const [__showMessage, __setShowMessage] = React.useState(false);
    const [__message, __setMessage] = React.useState('');

    useEffect(() => {
        if (__id === 'new') {
            __setNote({ id: -1, title: '', content: '' });
            __setTitle('');
            __setContent('');
        }
        else if (__id !== 'new' && !isNaN(Number(__id))) {
            __setIsLoading(true);
            (new NoteProvider()).getNoteById(Number(__id)).then((n) => {
                if (n != null) {
                    __setNote(n);
                    __setTitle(n.title);
                    __setContent(n.content);
                    __setIsLoading(false);
                }
            });
        }
    }, [__id]);

    return <AppLayout>
        <BaseView isLoading={__isLoading} message={__message} showMessage={__showMessage}>
            <Box>
                <TextField size='medium' InputProps={{ sx: { fontSize: 40 } }} minRows={1} placeholder='Title'
                    fullWidth multiline id="txt_title" defaultValue={__title} variant="standard" onChange={(e) => {
                        __note.title = e.target.value;
                        __setTitle(__note.title);
                        __setNote(__note);
                    }} />
                <Paper sx={{ padding: 2 }} elevation={12}>
                    <TextField size='small' InputProps={{ disableUnderline: true }} minRows={16}
                        fullWidth multiline id="txt_content" defaultValue={__content} variant='standard' onChange={(e) => {
                            __note.content = e.target.value;
                            __setContent(__note.content);
                            __setNote(__note);
                        }} />
                </Paper>
                <Fab
                    onClick={(e) => {
                        if (__note.id === -1) {
                            __setIsLoading(true);
                            (new NoteProvider()).addNote(__note).then((n) => {
                                __setIsLoading(false);
                                __setMessage('Note Saved!');
                                __setShowMessage(true);
                                window.location.hash = '/notes/' + n;
                            });
                        }
                        else {
                            __setIsLoading(true);
                            (new NoteProvider()).updateNote((__note as INote)).then((n) => {
                                //show message saved
                                __setIsLoading(false);
                                __setMessage('Note Saved!');
                                __setShowMessage(true);
                            });
                        }
                        e.preventDefault();
                    }}
                    color="primary"
                    sx={{
                        position: 'absolute',
                        top: 100,
                        right: (theme) => theme.spacing(__id === 'new' ? 5 : 15),
                    }}
                >
                    <SaveIcon />
                </Fab>
                {__id !== 'new' ? <Fab
                    onClick={(e) => {
                        window.location.hash = '/notes/new';
                        e.preventDefault();
                    }}
                    color="secondary"
                    sx={{
                        position: 'absolute',
                        top: 100,
                        right: (theme) => theme.spacing(5),
                    }}
                >
                    <AddIcon />
                </Fab> : <></>}
            </Box>
        </BaseView>
    </AppLayout>;
}

export default Notes;

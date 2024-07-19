import {  Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteProvider from '../Providers/NoteProvider';
import { INote } from '../Models/INote';

function LeftNavBar(props: { drawerOpen: boolean, onDrawerOpen: (isOpen: boolean) => void }) {
    const [isClosing, setIsClosing] = React.useState(false);
    const [__notes, __setNotes] = useState<INote[]>([]);

    useEffect(() => {
        (new NoteProvider()).getNotes().then((n) => {
            if (n != null) {
                __setNotes(n);
            }
        });
    }, []);


    const handleDrawerToggle = () => {
        if (!isClosing) {
            //setMobileOpen(!mobileOpen);
            props.onDrawerOpen(!props.drawerOpen);
        }
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        //setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    // Remove this const when copying and pasting into your project.
    //const container = window !== undefined ? () => window.document.body : undefined;
    const drawerWidth = 240;
    const drawer = (
        <div>
            <List style={{ height: 50 }}>
                <ListItem key={'drawer'} disablePadding>
                    <ListItemButton onClick={handleDrawerToggle} >
                        <ListItemIcon>
                            <MenuIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                {__notes.map((note, index) => (
                    <ListItem key={note.title} disablePadding>
                        <ListItemButton
                            onClick={(e) => {
                                window.location.hash = '/notes/' + note.id;
                                handleDrawerToggle();
                                e.preventDefault();
                            }}
                        >
                            <ListItemText primary={note.title} />
                            <ListItemIcon onClick={(e) => {
                                e.preventDefault();
                                (new NoteProvider()).deleteNote(note.id).then((v) => {
                                    if (v) {
                                        //props.showMessage('Note Deleted!');
                                        (new NoteProvider()).getNotes().then((n) => {
                                            if (n != null) {
                                                __setNotes(n);
                                                window.location.hash = '/';
                                                window.location.reload();
                                                handleDrawerToggle();
                                            }
                                        });
                                    }
                                })
                            }}>
                                <DeleteIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return <Box
        component="nav"
        sx={{ width: { sm: props.drawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
    >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
            //container={container}
            variant="temporary"
            open={props.drawerOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: props.drawerOpen ? { sm: 'block' } : { xs: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
        >
            {drawer}
        </Drawer>
        <Drawer
            //container={container}
            variant="permanent"
            open={props.drawerOpen}
            sx={{
                display: props.drawerOpen ? { sm: 'block' } : { xs: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
        >
            {drawer}
        </Drawer>
    </Box>;
}

export default LeftNavBar;

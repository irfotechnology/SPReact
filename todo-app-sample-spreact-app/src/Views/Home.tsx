import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Home() {
    return <AppLayout>
        <Fab
            onClick={(e) => {
                window.location.hash = "/notes/new";
                window.location.reload();
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
    </AppLayout>
}

export default Home;
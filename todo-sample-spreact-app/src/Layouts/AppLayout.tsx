import React from 'react';
import ResponsiveAppBar from './AppBar';
import { Box, Stack } from '@mui/material';
import LeftNavBar from './LeftNavBar';


function AppLayout({ children }: any) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    return <Box id="AppLayout">
        <ResponsiveAppBar onIconClick={() => {
            setDrawerOpen(!drawerOpen)
        }}></ResponsiveAppBar>
        <Stack direction="row">
            <LeftNavBar drawerOpen={drawerOpen} onDrawerOpen={(isOpen) => { setDrawerOpen(isOpen); }}></LeftNavBar>
            {children}
        </Stack>
    </Box>;
}

export default AppLayout;

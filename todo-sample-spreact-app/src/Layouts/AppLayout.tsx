import React, { useContext } from 'react';
import ResponsiveAppBar from '../CommonComponents/AppBar';
import LeftNavBar from '../CommonComponents/LeftNavBar';
import { Stack, Alert, Backdrop, Box, CircularProgress, Snackbar } from '@mui/material';
import UserContext from '../AppContext/UserContext';

function AppLayout(props: any) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [__message, __setMessage] = React.useState('');
    const [__showMessage, __setShowMessage] = React.useState(false);
    const [__isLoading, __setIsLoading] = React.useState(false);

    const context = useContext(UserContext);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        __setShowMessage(false);
    };

    context.AppNotificationService.onPostToastMessage = (message: string) => {
        __setMessage(message);
        __setShowMessage(true);
    };

    context.AppNotificationService.onIsLoading  = (value:boolean)=>{
        __setIsLoading(value);
    }



    return <Box id="AppLayout">
            {__isLoading ? <Box>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={__isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box> :
                <Box>
                    <ResponsiveAppBar onIconClick={() => {
                        setDrawerOpen(!drawerOpen)
                    }}></ResponsiveAppBar>
                    <Stack direction="row">
                        <LeftNavBar drawerOpen={drawerOpen} onDrawerOpen={(isOpen) => { setDrawerOpen(isOpen); }}></LeftNavBar>
                        <Box id="ViewContainer" sx={{ width: '100%', minHeight: (window.innerHeight - 110) + 'px', margin: '0px 40px', padding: '20px' }}>
                            {props.children}
                        </Box>
                    </Stack>
                    <Snackbar open={__showMessage} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >{__message}
                        </Alert>
                    </Snackbar>
                </Box>}
        </Box>;
}

export default AppLayout;

import React, { useMemo } from 'react';
import { Alert, Backdrop, Box, CircularProgress, Snackbar } from '@mui/material';


function BaseView(props:any) {
    const [__showMessage, __setShowMessage] = React.useState(props.showMessage);
    
    useMemo(()=>{
        __setShowMessage(props.showMessage)
    },[props.showMessage])

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        __setShowMessage(false);
    };

    return <Box sx={{ width: '100%', minHeight: window.innerHeight - 80, margin: '0px 5px', padding: '0px 20px', border: '1px solid lightgray' }}>
        {props.isLoading ? <Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box> :
            <Box>
                {props.children}
            </Box>}
        <Snackbar open={__showMessage} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >{props.message}
            </Alert>
        </Snackbar>
    </Box>;
}

export default BaseView;

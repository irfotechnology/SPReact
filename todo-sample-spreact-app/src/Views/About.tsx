import React, { useContext, useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Card, Divider, Grid, Stack, Typography } from '@mui/material';
import styles from '../App.module.scss';
import UserContext from '../AppContext/UserContext';
import { IAppInfo } from '../Models/IAppInfo';
import logo from '../Media/images/logo.svg'; 

function About() {
    const context = useContext(UserContext);
    const [__app, __setApp] = useState<IAppInfo>();
    useEffect(() => {
        context.AppNotificationService.isLoading(true);
        context.DefaultSPListProvider.getAppInfo().then((app) => {
            context.AppNotificationService.isLoading(false);
            __setApp(app);
        })
    }, [context.AppNotificationService, context.DefaultSPListProvider])
    return <AppLayout>
        <Card className={styles.AppInfo} variant="outlined">
            <Stack direction={'row'}>
                <img width={'100px'} src={logo} alt='logo'></img>
                <Typography style={{lineHeight:'100px'}} variant='h4'> About App:</Typography>
            </Stack>
            <Divider></Divider>
            <Grid style={{ marginTop: 20 }} container spacing={2}>
                <Grid item xs={4}>
                    <Typography>Name:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{__app?.name}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>ID:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{__app?.id}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>Description:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{__app?.description}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>Version:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{__app?.version}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>Publisher:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{__app?.publisher}</Typography>
                </Grid>
            </Grid>
        </Card>
    </AppLayout>
}

export default About;

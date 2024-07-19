import React, { useEffect, useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import NoteProvider, { IAppInfo } from '../Providers/NoteProvider';
import { Card, Divider, Grid, Typography } from '@mui/material';
import BaseView from './BaseView';

function About() {
    const [__isLoading, __setIsLoading] = useState(false);
    const [__app, __setApp] = useState<IAppInfo>();
    useEffect(() => {
        __setIsLoading(true);
        NoteProvider.getAppInfo().then((app) => {
            __setIsLoading(false);
            __setApp(app);
        })
    }, [])
    return <AppLayout>;
        <BaseView isLoading={__isLoading}>
            <Card style={{ margin: 40, padding: 20, maxWidth: 500 }} variant="outlined">
                <Typography variant='h4'>App Info:</Typography>
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
        </BaseView>
    </AppLayout>
}

export default About;

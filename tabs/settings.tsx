import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CssBaseline } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from "react";
import { Notification } from '~notes';
import { ApiKey, storage } from "~constants";


const defaultTheme = createTheme();

function SettingsForm() {
    const [notification, setNotification] = useState({ severity: "", text: "" })
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        storage.get(ApiKey).then((apiKey) => {
            setApiKey(apiKey);
        });
    }, [apiKey]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newApiKey = Object.fromEntries(data)["api_key"];
        await storage.set(ApiKey, newApiKey);
        setNotification({ severity: "success", text: "Successfully updated API key." });
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <SettingsIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Modify settings
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField
                            autoComplete="api_key"
                            name="api_key"
                            required
                            fullWidth
                            id="api_key"
                            label={apiKey}
                            autoFocus
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Save
                </Button>
            </Box>
            <Notification severity={notification.severity} text={notification.text} />
        </Box>
    )
}

function SettingsPage() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <SettingsForm />
            </Container>
        </ThemeProvider>
    );
}

export default SettingsPage;
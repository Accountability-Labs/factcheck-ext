import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { Storage } from "@plasmohq/storage"
import { apiRequest, isAuthenticated } from '~util';
import { ApiKey, api } from "~constants";
import { Notification } from '~notes';

const defaultTheme = createTheme();
const storage = new Storage()
const overlayStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function isValidInput({ data }, setNotification): boolean {
    if (data.email === "" || data.password === "" || data?.username === "") {
        setNotification({
            severity: "error",
            "text": "Please fill out all fields."
        });
        return false;
    }
    // The password must be all ASCII characters.
    if (!/^[\x00-\x7F]*$/.test(data.password as string)) {
        setNotification({
            severity: "error",
            "text": "Password must only contain ASCII characters."
        })
        return false;
    }
    return true;
}

function handleRequest(endpoint, data, setNotification, setIsLoggedIn) {
    apiRequest(endpoint, data).then(async (resp) => {
        if ("error" in resp) {
            setNotification({
                severity: "error",
                "text": resp["error"]
            });
            return;
        }

        await storage.set(ApiKey, resp.data[ApiKey]);
        setNotification({ severity: "success", text: "You are now logged in!" });
        setTimeout(() => { setIsLoggedIn(true) }, 1000);
    }).catch((err) => {
        setNotification({ severity: "error", text: err });
    });
}

function getSubmitHandler(apiEndpoint, setNotification, setIsLoggedIn) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        if (!isValidInput({ data }, setNotification)) {
            return;
        }
        handleRequest(apiEndpoint, data, setNotification, setIsLoggedIn);
    }
    return handleSubmit;
}

function LogoutSection({ setIsLoggedIn }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5">
                You are logged in.
            </Typography>
            <Button fullWidth
                type="submit"
                variant="contained"
                color="error"
                onClick={() => {
                    storage.remove(ApiKey);
                    setIsLoggedIn(false); // Force re-render.
                }}
                sx={{ mt: 3, mb: 2 }}>
                Log out
            </Button>
            <Notification severity="info" text={
                < Typography >
                    Visit&nbsp;
                    <Link href="https://www.nytimes.com/2017/08/15/us/politics/trump-charlottesville-white-nationalists.html">
                        this link
                    </Link>
                    &nbsp;to see the extension in action.
                </Typography >}
            />
        </Box>
    )
}

function LoginSection({ setIsLoggedIn }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5">
                Please sign in to continue.
            </Typography>
            <SignInOverlay setIsLoggedIn={setIsLoggedIn} />
            <SignUpOverlay setIsLoggedIn={setIsLoggedIn} />
        </Box>
    )
}

function SignInOverlay({ setIsLoggedIn }) {
    const [notification, setNotification] = useState({ severity: "", text: "" })
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        getSubmitHandler(api.signinUser, setNotification, setIsLoggedIn)(event);
    }

    return (
        <Box m={2}>
            <Button fullWidth
                type="submit"
                variant="contained"
                onClick={handleOpen}>
                Sign in
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" noValidate onSubmit={handleSubmit} sx={overlayStyle}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required
                                fullWidth
                                autoComplete="password"
                                name="password"
                                id="password"
                                label="Password"
                            />
                        </Grid>
                    </Grid>
                    <Button fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Sign in
                    </Button>
                    <Notification severity={notification.severity} text={notification.text} />
                </Box>
            </Modal>
        </Box>
    )
}

function SignUpOverlay({ setIsLoggedIn }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [notification, setNotification] = useState({ severity: "", text: "" })
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        getSubmitHandler(api.signupUser, setNotification, setIsLoggedIn)(event);
    }

    return (
        <Box>
            <Typography variant="body1">
                Don't have an account yet?&nbsp;
                <Link onClick={handleOpen} style={{ cursor: 'pointer' }}>
                    Sign up
                </Link>
            </Typography>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" noValidate onSubmit={handleSubmit} sx={overlayStyle}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField required
                                autoFocus
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField required
                                fullWidth
                                autoComplete="password"
                                name="password"
                                id="password"
                                label="Password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Sign up
                    </Button>
                    <Notification severity={notification.severity} text={notification.text} />
                </Box>
            </Modal>
        </Box>
    )
}

function RegistrationForm() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loadAuthState = async () => {
            setIsLoggedIn(await isAuthenticated());
        }
        loadAuthState();
    }, [])

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                {isLoggedIn ? <RocketLaunchIcon /> : <LockOutlinedIcon />}
            </Avatar>
            {isLoggedIn ?
                <LogoutSection setIsLoggedIn={setIsLoggedIn} />
                :
                <LoginSection setIsLoggedIn={setIsLoggedIn} />
            }
        </Box>
    )
}

function RegistrationPage() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <RegistrationForm />
            </Container>
        </ThemeProvider>
    );
}

export default RegistrationPage;
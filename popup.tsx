import { useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Link } from "@mui/material";
import { Divider } from '@mui/material';
import { IconButton } from '@mui/material';
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import { PostNote, Notification, ShowNotes } from "~notes";
import { isAuthenticated } from "~util";
import { extName } from "~constants";
import "~css/style.css";

const theme = createTheme({});

function App() {
  const [notes, setNotes] = useState(null)
  const [notification, setNotification] = useState({ severity: "", text: "" })

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    chrome.runtime.sendMessage({
      contentScriptQuery: "getNotes",
    }, function (response) {
      if ("error" in response) {
        setNotification({ severity: "error", text: response.error });
        return
      }
      setNotes(response);
      return response
    });
  };

  return (
    <div>
      <Box m={1}>
        <ControlIcons />
      </Box>

      <Divider />

      <Box m={1}>
        <PostNote />
        {Array.isArray(notes) && <ShowNotes notes={notes} />}
        <Notification severity={notification.severity} text={notification.text} />
      </Box>
    </div>
  )
}

function ControlIcons() {
  return (
    <Grid container>
      <Grid item xs={10}>
        <Typography variant="h6">
          {extName}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          aria-label="Sign in or sign up"
          size="small"
          onClick={() => chrome.tabs.create({ url: "tabs/auth.html" })}
        >
          <LoginIcon />
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          aria-label="Settings"
          size="small"
          onClick={() => chrome.tabs.create({ url: "tabs/settings.html" })}
        >
          <SettingsIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

function IndexPopup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadAuthState = async () => {
      setIsLoggedIn(await isAuthenticated());
    }
    loadAuthState();
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="popup">
        {isLoggedIn ?
          <App />
          :

          <Notification severity="info" text={
            < Typography >
              <Link href="/tabs/auth.html" target="_blank">
                Log in
              </Link>
              &nbsp;to use this extension.
            </Typography >}
          />
        }
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup

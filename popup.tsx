import { useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Link } from "@mui/material";
import { Divider } from '@mui/material';
import { IconButton } from '@mui/material';
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import ExploreIcon from '@mui/icons-material/Explore';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
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
      <Grid item xs={9}>
        <Typography variant="h6">
          {extName}
        </Typography>
      </Grid>
      <Tooltip title="Explore notes">
        <Grid item xs={1}>
          <IconButton
            aria-label="Explore notes"
            size="small"
            onClick={() => chrome.tabs.create({ url: "https://factcheck-web.nymity.ch" })}
          >
            <ExploreIcon />
          </IconButton>
        </Grid>
      </Tooltip>
      <Tooltip title="Sign in/up">
        <Grid item xs={1}>
          <IconButton
            aria-label="Sign in or sign up"
            size="small"
            onClick={() => chrome.tabs.create({ url: "tabs/auth.html" })}
          >
            <LoginIcon />
          </IconButton>
        </Grid>
      </Tooltip>
      <Grid item xs={1}>
        <Tooltip title="Extension settings">
          <IconButton
            aria-label="Settings"
            size="small"
            onClick={() => chrome.tabs.create({ url: "tabs/settings.html" })}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
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

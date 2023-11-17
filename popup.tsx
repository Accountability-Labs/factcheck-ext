import { useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { PostNote, Notification, ShowNotes } from "~notes";
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
    <div className="popup">
      <PostNote />
      {Array.isArray(notes) && <ShowNotes notes={notes} />}
      <Notification severity={notification.severity} text={notification.text} />
    </div>
  )
}

function IndexPopup() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

export default IndexPopup

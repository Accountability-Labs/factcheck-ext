import { useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { NoNotes, Note, PostNote, Notification } from "~notes";
import "~css/style.css";

const theme = createTheme({});

function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    chrome.runtime.sendMessage({
      contentScriptQuery: "getNotes",
    }, function (response) {
      if ("error" in response) {
        setError(response.error);
        return
      }
      setNotes(response);
      return response
    });
  };

  return (
    <div className="popup">
      <PostNote />
      {
        notes === null ?
          <NoNotes />
          :
          notes.length > 0 && notes.map((note) => (
            <Note
              note_id={note.id}
              vote={note.vote}
              text={note.note}
              createdBy={note.user_name}
              createdAt={note.created_at}
              updatedAt={note.updated_at.Time}
            />
          ))
      }
      {
        error !== ""
          ?
          <Notification severity="error" text={error} />
          :
          <></>
      }
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

import { useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { NoNotes, Note, PostNote } from "~notes";
import "~css/style.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ffA400',
    },
  },
});

function App() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    chrome.runtime.sendMessage({
      contentScriptQuery: "getNotes",
    }, function (response) {
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
              text={note.note}
              createdBy={note.email}
              createdAt={note.created_at}
              updatedAt={note.updated_at.Time}
            />
          ))
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

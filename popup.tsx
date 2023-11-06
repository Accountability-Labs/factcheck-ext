import { useState, useEffect } from "react"
import "~css/style.css";
import { postNote } from "~util";

function Note({ text, updatedAt, createdAt, createdBy }) {
  return (
    <div className="note">
      <p className="author">🧑‍💻 {createdBy}</p>
      <p className="created-at">✍️ {fmtTime(createdAt)}</p>
      {
        updatedAt && updatedAt !== createdAt && <p>🤚 {fmtTime(updatedAt)}</p>
      }
      <p className="note-text">{text}</p>
    </div>
  )
}

function PostNote() {
  const [submitted, setSubmitted] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.info(tabs);
      postNote(tabs[0].url, e.target[0].value).then((success) => {
        setSubmitted(success ? "✅" : "❌");
      });
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Write a note..." />
        <button type="submit">Submit</button>
        <span>{submitted}</span>
      </form>
    </div>
  )
}

function fmtTime(dateTime: string): string {
  let parsedDateTime = new Date(Date.parse(dateTime));
  return parsedDateTime.toDateString();
}

function IndexPopup() {
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
      {
        notes === null ?
          <h3>There are no notes for this page.</h3>
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
      <PostNote />
    </div >
  )
}

export default IndexPopup

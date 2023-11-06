import { useState, useEffect } from "react"
import "./css/style.css";

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

function fmtTime(dateTime: string): string {
  let parsedDateTime = new Date(Date.parse(dateTime));
  return parsedDateTime.toDateString();
}

function IndexPopup() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    chrome.runtime.sendMessage({
      contentScriptQuery: "getNotes",
      url: 'https://jsonplaceholder.typicode.com/todos/1'
    }, function (response) {
      setNotes(response);
      return response
    });
  });

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

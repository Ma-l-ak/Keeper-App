import Note from "../Components/Note.jsx";
import CreateArea from "../Components/CreateArea.jsx";
import { useState, useEffect, useContext } from "react";
// import { useAuth } from "../Context/AuthContext.jsx";
import axios from "axios";

function NotePages() {
  const [notes, setNotes] = useState([]);
  // const { user } = useAuth();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userId = user?.id;
  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    // if (!userId) return;
    async function fetchNotes() {
        if (!token || !userId) return;
      try {
        // const token = localStorage.getItem("token");
        // const res = await axios.get(`http://localhost:5000/notes/${userId}`);
        //   const res = await axios.get("http://localhost:5000/notes", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const token = localStorage.getItem("token");
        // if (!token) {
        //   console.warn("No token found, skipping fetchNotes");
        //   return;
        // }
        const res = await axios.get("http://localhost:5000/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        alert("Failed to load notes.");
      }
    }
    fetchNotes();
  }, []);

  async function addNote(newNote) {
      if (!token || !userId) return;
    try {
      // const res = await axios.post("http://localhost:5000/notes", {
      //   userId,
      //   title: newNote.title,
      //   content: newNote.content
      // });
      const res = await axios.post(
        "http://localhost:5000/notes",
        {
          title: newNote.title,
          content: newNote.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(prevNotes => [...prevNotes, res.data]);
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  }
  async function deleteNote(id) {
      if (!token || !userId) return;
    try {
      // await axios.delete(`http://localhost:5000/notes/${id}`);
      await axios.delete(`http://localhost:5000/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  }

  async function editNote(id, updatedNote) {
      if (!token || !userId) return;
    try {
      // const res = await axios.put(`http://localhost:5000/notes/${id}`, updatedNote);
      const res = await axios.put(
        `http://localhost:5000/notes/${id}`,
        updatedNote,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          //note.id === id ? res.data : note
          Number(note.id) === Number(id) ? res.data : note
        )
      );
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note.");
    }
  }
  return (
    <div className="main-container">
      <CreateArea onAdd={addNote} token={token} />
      <div className="notes-container">
        {notes.map((noteItem) => {
          return (
            <Note
              key={noteItem.id}
              id={noteItem.id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
              onEdit={editNote}
            />
          );
        })}
      </div>
    </div>
  );
}
export default NotePages;

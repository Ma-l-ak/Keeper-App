import Note from "../Components/Note.jsx";
import CreateArea from "../Components/CreateArea.jsx";
import { useState, useEffect, useContext } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import axios from "axios";

function NotePages() {
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();
  const userId = user?.id;
  
  useEffect(() => {
    if (!userId) return;
    async function fetchNotes() {
      try {
        const res = await axios.get(`http://localhost:5000/notes/${userId}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        alert("Failed to load notes.");
      }
    }
    fetchNotes();
  }, [userId]);
  
  async function addNote(newNote) {
    if (!userId) return;
    try {
      const res = await axios.post("http://localhost:5000/notes", {
        userId,
        title: newNote.title,
        content: newNote.content
      });
      setNotes(prevNotes => [...prevNotes, res.data]);
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  }
  async function deleteNote(id) {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  }

  async function editNote(id, updatedNote) {
  try {
    const res = await axios.put(`http://localhost:5000/notes/${id}`, updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        //note.id === id ? res.data : note
    Number(note.id) === Number(id)? res.data : note
      )
    );
  } catch (err) {
    console.error("Error updating note:", err);
    alert("Failed to update note.");
  }
}
  return (
    <div className="main-container">
      <CreateArea onAdd={addNote} userId={userId} />
      <div className="notes-container">
      {notes.map((noteItem) => {
        return(
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

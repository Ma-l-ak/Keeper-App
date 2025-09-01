import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import axios from "axios";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });
  const[expand,setExpand]=useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

async function submitNote(event) {
    event.preventDefault();
    if (!props.userId) return;
    try {
      const res = await axios.post("http://localhost:5000/notes", {
        userId: props.userId,
        title: note.title,
        content: note.content
      });
      props.onAdd(res.data);
      setNote({ title: "", content: "" });
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  }
 function handleExpand(){
     setExpand(true);
 }
  return (
    <div>
      <form className="create-note">
       { expand ? <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        /> :""}
        <textarea
          onClick={handleExpand}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows= {expand ? "3" :"1"}
        />
        <Zoom in={expand}>
        <Fab onClick={submitNote}><AddIcon/></Fab>
        </Zoom>
      </form>
    </div>
  );
}
export default CreateArea;

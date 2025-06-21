import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

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

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
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

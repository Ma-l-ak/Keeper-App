import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(props.title);
  const [newContent, setNewContent] = useState(props.content);
  useEffect(() => {
    setNewTitle(props.title);
    setNewContent(props.content);
  }, [props.title, props.content]);

  function handleClick() {
    props.onDelete(props.id);
  }

  function handleSave() {
    props.onEdit(props.id, { title: newTitle, content: newContent });
    setIsEditing(false);
  }

  return (
    <div className="note">
      {isEditing ? (
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleSave}>
            <SaveIcon />
          </button>
        </>
      ) : (
        <>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <div className="btn">
          <button onClick={() => setIsEditing(true)}>
            <EditIcon />
          </button>
          <button onClick={handleClick}>
            <DeleteIcon />
          </button>
          </div>
        </>
      )}
    </div>
  );
}
export default Note;

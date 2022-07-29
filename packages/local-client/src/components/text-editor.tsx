import "../style/text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell } from "../store";
import { useActions } from "../hooks/use-actions";

interface TextEditorProps {
  cell: Cell;
}

export const TextEditor: React.FC<TextEditorProps> = (props) => {
  const { cell } = props;
  const { updateCell } = useActions();
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    //listen for click event to switch from preview mode to editing mode
    const listener = (event: MouseEvent) => {
      //if ref.current exists and event.target is contained within the ref.current
      //if it is inside the editor will not close
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        //console.log("element clicked is inside editor");
        return;
      }
      //console.log(/* event.target */ "element clicked is NOT inside editor");
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || "")}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "# Click to edit"} />
      </div>
    </div>
  );
};

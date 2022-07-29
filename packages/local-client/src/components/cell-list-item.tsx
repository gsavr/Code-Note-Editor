import "../style/cell-list-item.css";
import { Cell } from "../store";
import { CodeCell } from "./code-cell";
import { TextEditor } from "./text-editor";
import { ActionBar } from "./action-bar";

interface CellListItemProps {
  cell: Cell;
}

export const CellListItem: React.FC<CellListItemProps> = (props) => {
  const { cell } = props;

  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }

  return <div className="cell-list-item">{child}</div>;
};

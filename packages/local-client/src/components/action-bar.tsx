import "../style/action-bar.css";
import { useActions } from "../hooks/use-actions";
import { ActionBarButton } from "./action-bar-button";

interface ActionBarProps {
  id: string;
}

export const ActionBar: React.FC<ActionBarProps> = (props) => {
  const { id } = props;
  const { moveCell, deleteCell } = useActions();

  const moveUp = () => {
    moveCell(id, "up");
  };
  const moveDown = () => {
    moveCell(id, "down");
  };
  const deleteCurrent = () => {
    deleteCell(id);
  };

  return (
    <div className="action-bar">
      <ActionBarButton icon={"arrow-up"} color={"success"} action={moveUp} />

      <ActionBarButton icon={"arrow-down"} color={"link"} action={moveDown} />

      <ActionBarButton
        icon={"times"}
        color={"primary"}
        action={deleteCurrent}
      />
    </div>
  );
};

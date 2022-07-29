import { useActions } from "../hooks/use-actions";
import "../style/add-cell.css";

interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

export const AddCell: React.FC<AddCellProps> = (props) => {
  const { previousCellId, forceVisible } = props;
  const { insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, "code")}
        >
          <span className="icon">
            <i className="fa-solid fa-plus"></i>
          </span>
          <span> Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, "text")}
        >
          <span className="icon">
            <i className="fa-solid fa-plus"></i>
          </span>
          <span> Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

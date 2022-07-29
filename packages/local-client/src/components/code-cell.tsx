import "../style/code-cell.css";
import { useEffect } from "react";
import { CodeEditor } from "./code-editor";
import { Preview } from "./preview";
import { Resizable } from "./resizable";
import { Cell } from "../store";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

interface CodeCellProps {
  cell: Cell;
}

export const CodeCell: React.FC<CodeCellProps> = (props) => {
  const { cell } = props;
  const { updateCell, createBundle } = useActions();
  // @ts-ignore
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      //send cell.id and cell.content(now all content as cumulative)
      createBundle(cell.id, cumulativeCode);
      return;
    }
    //wait 1.2 sec after user stops typing to bundle code
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1250);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="preview-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-link" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}{" "}
        </div>
      </div>
    </Resizable>
  );
};

//pre element make code look like code in html
//<pre>{code}</pre>

/* document.querySelector("#root").innerHTML = "12324" */

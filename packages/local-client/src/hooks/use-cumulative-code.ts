import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    // @ts-ignore
    const { data, order } = state.cells;
    const orderedCells = order.map((id: string) => data[id]);

    const showFunc =
      //start with some html code that will allow the user to show something on the preview without having to write out innerHTML selector every time
      //if object - change to string
      //if(value.$$typeof && value.props) -- React element
      //_React in case user imports react on their own
      //use var so it can be redeclared in next const
      `
          import _React from 'react';
          import _ReactDOM from 'react-dom/client';
    
          var show = (value) =>{
            const root = document.querySelector("#root")
    
            if(typeof value === "object") {
              if(value.$$typeof && value.props){
                _ReactDOM.createRoot(root).render(value)
              }else{
                root.innerHTML = JSON.stringify(value)
              }
            } else{
            root.innerHTML = value
            }
          }
        `;
    const showFunNoOp = `var show = () => {}`;

    //store all code in one place
    const cumulativeCode = [];
    for (let c of orderedCells) {
      //cells with type code will be stored
      if (c.type === "code") {
        //if cell is the one we are trying to execute then push showFunc to run code
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFunNoOp);
        }
        cumulativeCode.push(c.content);
      } //when in the ordered cells array from state we reach the current cell--break
      if (c.id === cellId) break;
    }
    return cumulativeCode;
  }).join("\n");
};

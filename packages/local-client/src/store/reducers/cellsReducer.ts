import produce from "immer";
import { ActionType } from "../actions/action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce(
  (state: CellsState = initialState, action: Action) => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        //acc - accumulator
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState["data"]);
        state.loading = false;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;

        state.data[id].content = content;

        return state;
      //
      case ActionType.DELETE_CELL:
        //delete data cell
        delete state.data[action.payload];
        //delete from array of cells in order
        state.order = state.order.filter((id) => id !== action.payload);

        return state;
      //
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;
      //
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: "",
          type: action.payload.type,
          id: randomId(),
        };
        //put in data object
        state.data[cell.id] = cell;

        //take a look at id in payload
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          //if index is null ---  place cell at beginning of array
          state.order.unshift(cell.id);
        } else {
          //add new cell after the one clicked on
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;
      //
      default:
        return state;
    }
  }
);

const randomId = () => {
  //will develop a series of random numbers and letter base(36) --- //substring(splice index, end index)
  return Math.random().toString(36).substring(2, 7);
};

export default cellsReducer;

/* UPDATE CELL reducer without immer -- return statement
 //return all the state
        return{...state,
        //for the data property...
        data: {
          //..return all data except for
          ...state.data,
          //the id being updated
          [id]: {
            //for this id, return all data except for ..
            ...state.data[id],
            //content which is being updated
            content: content,
          },
        },
     } */

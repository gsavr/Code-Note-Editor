import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../store";

export const useActions = () => {
  const dispatch = useDispatch();

  //use useMemo to memoize so we do not bundle the actions every time the component reloads
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};

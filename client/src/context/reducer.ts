import { ActionType, InitialState, SET_ERROR, SET_GAME_STATE, SET_HAS_INTERACTIVE_PARAMS } from "./types";

const globalReducer = (state: InitialState, action: ActionType) => {
  const { type, payload } = action;
  console.log("🚀 ~ reducer.ts:5 ~ type:", type);
  console.log("🚀 ~ reducer.ts:5 ~ payload:", payload);
  switch (type) {
    case SET_HAS_INTERACTIVE_PARAMS:
      return {
        ...state,
        hasInteractiveParams: true,
      };
    case SET_GAME_STATE:
      return {
        ...state,
        isAdmin: payload.isAdmin,
        visitorData: payload.visitorData,
        error: "",
      };
    case SET_ERROR:
      return {
        ...state,
        error: payload.error,
      };

    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

export { globalReducer };

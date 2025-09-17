import {
  ActionType,
  InitialState,
  SET_ERROR,
  SET_GAME_STATE,
  SET_HAS_INTERACTIVE_PARAMS,
  SET_SELECTED_PLOT,
  SET_SELECTED_SEED,
  SET_AVAILABLE_SEEDS,
  SET_PROFILE_ID,
} from "./types";

const globalReducer = (state: InitialState, action: ActionType) => {
  const { type, payload } = action;
  switch (type) {
    case SET_HAS_INTERACTIVE_PARAMS:
      return {
        ...state,
        hasInteractiveParams: true,
      };
    case SET_GAME_STATE:
      return {
        ...state,
        ...payload,
        error: "",
      };
    case SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case SET_SELECTED_PLOT:
      return {
        ...state,
        selectedPlotId: payload,
      };
    case SET_SELECTED_SEED:
      return {
        ...state,
        selectedSeedId: payload,
      };
    case SET_AVAILABLE_SEEDS:
      return {
        ...state,
        availableSeeds: payload,
      };
    case SET_PROFILE_ID:
      return {
        ...state,
        profileId: payload,
      };
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

export { globalReducer };

import { ActionType, InitialState, SET_GAME_STATE } from "@/context/types";
import { Dispatch } from "react";

export const setGameState = (dispatch: Dispatch<ActionType> | null, gameState: Record<string, unknown>) => {
  if (!dispatch || !gameState) return;

  // Ensure droppedPlants is properly handled
  const payload: InitialState = {
    ...(gameState as InitialState),
    error: "",
    droppedPlants: Array.isArray(gameState.droppedPlants) ? (gameState.droppedPlants as string[]) : [],
  };

  dispatch({
    type: SET_GAME_STATE,
    payload,
  });
};

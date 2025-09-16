import { Dispatch } from "react";
import { ActionType, SET_PLANTING_MODE, SET_SELECTED_SEED, UPDATE_GARDEN_STATE } from "../context/types";
import { GameState } from "./types";

/**
 * Updates the garden state in the global context
 * @param dispatch The global dispatch function
 * @param gameState The garden game state from the API
 */
export const updateGardenState = (dispatch: Dispatch<ActionType>, gameState: GameState) => {
  dispatch({
    type: UPDATE_GARDEN_STATE,
    payload: {
      gardenState: {
        visitorData: gameState.visitorData,
        worldData: gameState.worldData,
        plants: gameState.plants,
        availableSeeds: gameState.availableSeeds,
      },
    },
  });
};

/**
 * Sets the selected seed for planting
 * @param dispatch The global dispatch function
 * @param seedType The type of seed to select
 */
export const setSelectedSeed = (dispatch: Dispatch<ActionType>, seedType: string | null) => {
  dispatch({
    type: SET_SELECTED_SEED,
    payload: {
      selectedSeed: seedType,
    },
  });
};

/**
 * Toggles planting mode on/off
 * @param dispatch The global dispatch function
 * @param isPlanting Whether planting mode is active
 */
export const setPlantingMode = (dispatch: Dispatch<ActionType>, isPlanting: boolean) => {
  dispatch({
    type: SET_PLANTING_MODE,
    payload: {
      plantingMode: isPlanting,
    },
  });
};

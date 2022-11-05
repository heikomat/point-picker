import { createContext } from "react";
import { Player } from "./contracts";

export const PlayerSelectionContext = createContext<{
  selectedPlayers: Array<Player>,
  inactivePlayers: Array<Player>,
  addPlayer?: (player: Player) => void;
  removePlayer?: (player: Player) => void;
  makePlayerActive?: (player: Player) => void;
  makePlayerInactive?: (player: Player) => void;
}>({
  selectedPlayers: [],
  inactivePlayers: [],
});

import { createContext } from "react";
import { Player } from "./contracts";

export const PlayerSelectionContext = createContext<{
  selectedPlayers: Array<Player>,
  addPlayer?: (player: Player) => void;
  removePlayer?: (player: Player) => void;
}>({
  selectedPlayers: []
});

import { createContext } from "react";
import { Game } from "./components/picker-page";

export const GameTransitionContext = createContext<{
  startTransition?: (currentGame: Game) => void;
  applyTransition?: (gameId?: string, selectedPlayerNumbers?: Array<number>) => void;
  lastAppliedTransition?: {
    gameId: string;
    selectedPlayerNumbers: Array<number>; 
  };
}>({});

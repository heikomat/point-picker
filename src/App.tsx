import { Flex } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { PlayerOverview } from "./components/player-overview/player-overview";
import { SelectedPlayers } from "./components/selected-players/selected-players";
import { Player, playerCanBeSelected } from "./contracts";
import { PlayerSelectionContext } from "./player-selection-context";
import './app.css';
import { InactivePlayers } from "./components/inactive-players/inactive-players";

function App() {

  const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);
  const [inactivePlayers, setInactivePlayers] = useState<Array<Player>>([]);

  const addPlayer = useCallback((player: Player) => {
    setSelectedPlayers((selectedPlayers) => {
      if (!playerCanBeSelected(selectedPlayers, player)) {
        return selectedPlayers
      }

      return [...selectedPlayers, player];
    })
  }, []);
  
  const removePlayer = useCallback((player: Player) => {
    setSelectedPlayers((selectedPlayers) => {
      return selectedPlayers.slice(0).filter((selectedPlayer) => {
        return selectedPlayer.number !== player.number
      })
    })
  }, []);

  const makePlayerInactive = useCallback((player: Player) => {
    removePlayer(player);
    setInactivePlayers((inactivePlayers) => {
      const alreadyInactivePlayers = inactivePlayers.find((inactivePlayer) => {
        return inactivePlayer.number === player.number;
      })
      if (alreadyInactivePlayers !== undefined) {
        return inactivePlayers
      }

      return [...inactivePlayers, player];
    })
  }, [removePlayer]);
  
  const makePlayerActive = useCallback((player: Player) => {
    setInactivePlayers((inactivePlayers) => {
      return inactivePlayers.slice(0).filter((inactivePlayer) => {
        return inactivePlayer.number !== player.number
      })
    })
  }, []);

  const playerSelectionContext = useMemo(() => {
    return {
      selectedPlayers: selectedPlayers,
      inactivePlayers: inactivePlayers,
      makePlayerActive: makePlayerActive,
      makePlayerInactive: makePlayerInactive,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
    }
  }, [addPlayer, inactivePlayers, makePlayerActive, makePlayerInactive, removePlayer, selectedPlayers]);

  return (
    <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
      <Flex
        borderRadius="10px"
        boxShadow="0px 0px 8px 0px #B9B9B9"
        backgroundColor="gray.50"
        width="100%"
        maxWidth="500px"
        height="100%"
        maxHeight="1200px"
        overflow="auto"
        direction="column"
        userSelect="none"
      >
        <PlayerSelectionContext.Provider value={playerSelectionContext}>
          <InactivePlayers />
          <PlayerOverview />
          <SelectedPlayers />
        </PlayerSelectionContext.Provider>
      </Flex>
    </Flex>
  );
}

export default App;

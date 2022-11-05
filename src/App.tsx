import { Box, Flex } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { PlayerOverview } from "./components/player-overview";
import { SelectedPlayers } from "./components/selected-players";
import { Player, playerCanBeSelected } from "./contracts";
import { PlayerSelectionContext } from "./player-selection-context";
import './app.css';

function App() {

  const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);
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

  const playerSelectionContext = useMemo(() => {
    return {
      selectedPlayers: selectedPlayers,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
    }
  }, [addPlayer, removePlayer, selectedPlayers]);

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
      >
        <PlayerSelectionContext.Provider value={playerSelectionContext}>
          <PlayerOverview />
          <Box position="sticky" bottom="0">
            <SelectedPlayers />
          </Box>
        </PlayerSelectionContext.Provider>
      </Flex>
    </Flex>
  );
}

export default App;

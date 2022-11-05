import { Flex } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { PlayerOverview } from "./components/player-overview/player-overview";
import { SelectedPlayers } from "./components/selected-players/selected-players";
import { Player, playerCanBeSelected, players } from "./contracts";
import { PlayerSelectionContext } from "./player-selection-context";
import './app.css';
import { InactivePlayers } from "./components/inactive-players/inactive-players";

const initialSetup = localStorage.getItem('pickedPlayers');
let initialSelectedPlayers: Array<Player> = [];
let initialInactivePlayers: Array<Player> = [];
if (initialSetup !== undefined && initialSetup !== null && initialSetup !== '') {
  const {selectedPlayerNumbers, inactivePlayerNumbers} = JSON.parse(initialSetup);
  const playersByNumber: {[key: string]: Player} = {};
  for (const player of players) {
    playersByNumber[player.number] = player;
  }

  initialSelectedPlayers = selectedPlayerNumbers.map((playerNumber: number) => {
    return playersByNumber[playerNumber]
  });
  initialInactivePlayers = inactivePlayerNumbers.map((playerNumber: number) => {
    return playersByNumber[playerNumber]
  });
}

console.log(initialSelectedPlayers, initialInactivePlayers);

function App() {

  const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>(initialSelectedPlayers);
  const [inactivePlayers, setInactivePlayers] = useState<Array<Player>>(initialInactivePlayers);

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
    localStorage.setItem('pickedPlayers', JSON.stringify({
      selectedPlayerNumbers: selectedPlayers.map((player) => {
        return player.number;
      }),
      inactivePlayerNumbers: inactivePlayers.map((player) => {
        return player.number;
      }),
    }));

    return {
      selectedPlayers: selectedPlayers,
      inactivePlayers: inactivePlayers,
      makePlayerActive: makePlayerActive,
      makePlayerInactive: makePlayerInactive,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
    }
  }, [addPlayer, inactivePlayers, makePlayerActive, makePlayerInactive, removePlayer, selectedPlayers]);

  console.log(playerSelectionContext)
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
          <Flex grow="1" minHeight="0">
            <PlayerOverview />
          </Flex>
          <SelectedPlayers />
        </PlayerSelectionContext.Provider>
      </Flex>
    </Flex>
  );
}

export default App;

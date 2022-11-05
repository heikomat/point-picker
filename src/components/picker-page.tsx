import { Flex } from "@chakra-ui/react";
import { memo, useCallback, useMemo, useState } from "react";
import { PlayerOverview } from "./player-overview/player-overview";
import { SelectedPlayers } from "./selected-players/selected-players";
import { Player, playerCanBeSelected, players } from "../contracts";
import { PlayerSelectionContext } from "../player-selection-context";
import { InactivePlayers } from "./inactive-players/inactive-players";

type Props = {
  page: number
}

function PickerPageComponent(props: Props) {
  const {page} = props;

  const [{initialSelectedPlayers, initialInactivePlayers}] = useState(() => {
    const initialSetup = localStorage.getItem(`pickedPlayers-${page}`);
    if (initialSetup === undefined || initialSetup === null || initialSetup === '') {
      return {initialSelectedPlayers: [], initialInactivePlayers: []};
    }

    const {selectedPlayerNumbers, inactivePlayerNumbers} = JSON.parse(initialSetup);
    const playersByNumber: {[key: string]: Player} = {};
    for (const player of players) {
      playersByNumber[player.number] = player;
    }
  
    return {
      initialSelectedPlayers: selectedPlayerNumbers.map((playerNumber: number) => {
        return playersByNumber[playerNumber]
      }),
      initialInactivePlayers: inactivePlayerNumbers.map((playerNumber: number) => {
        return playersByNumber[playerNumber]
      }),
    }
  })

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
    localStorage.setItem(`pickedPlayers-${page}`, JSON.stringify({
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
  }, [addPlayer, inactivePlayers, makePlayerActive, makePlayerInactive, removePlayer, selectedPlayers, page]);

  console.log(playerSelectionContext)
  return (
    <Flex height="100%" direction="column">
      <PlayerSelectionContext.Provider value={playerSelectionContext}>
        <InactivePlayers />
        <Flex grow="1" minHeight="0">
          <PlayerOverview />
        </Flex>
        <SelectedPlayers />
      </PlayerSelectionContext.Provider>
    </Flex>
  );
}

export const PickerPage = memo(PickerPageComponent)

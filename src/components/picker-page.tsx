import { Button, Flex } from "@chakra-ui/react";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PlayerOverview } from "./player-overview/player-overview";
import { SelectedPlayers } from "./selected-players/selected-players";
import { Player, playerCanBeSelected, players } from "../contracts";
import { PlayerSelectionContext } from "../player-selection-context";
import { InactivePlayers } from "./inactive-players/inactive-players";
import { subtractPlayer, addPlayer as toolsAddPlayer, playerFromNumber, numberFromPLayer } from "../tools";
import { GameTransitionContext } from "../game-transition-context";

export type Game = {
  id: string;
  title: string;
  selectedPlayerNumbers: Array<number>;
  inactivePlayerNumbers: Array<number>;
}

type Props = {
  page: string;
  title: string;
}

function PickerPageComponent(props: Props) {
  const {page, title} = props;

  const {startTransition, lastAppliedTransition} = useContext(GameTransitionContext);

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

  useEffect(() => {
    if (lastAppliedTransition?.gameId === page) {
      setSelectedPlayers(lastAppliedTransition?.selectedPlayerNumbers.map(playerFromNumber))
    }
  }, [lastAppliedTransition, page])

  const addPlayer = useCallback((player: Player) => {
    setSelectedPlayers((selectedPlayers) => {
      if (!playerCanBeSelected(selectedPlayers, player)) {
        return selectedPlayers
      }

      return toolsAddPlayer(selectedPlayers, player);
    })
  }, []);
  
  const removePlayer = useCallback((player: Player) => {
    setSelectedPlayers((selectedPlayers) => {
      return subtractPlayer(selectedPlayers, player);
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

  const currentGame = useMemo(() => {
    return {
      id: page,
      title: title,
      selectedPlayerNumbers: selectedPlayers.map(numberFromPLayer),
      inactivePlayerNumbers: inactivePlayers.map(numberFromPLayer),
    }
  }, [page, title, selectedPlayers, inactivePlayers]);

  const playerSelectionContext = useMemo(() => {
    localStorage.setItem(`pickedPlayers-${page}`, JSON.stringify(currentGame));

    return {
      selectedPlayers: selectedPlayers,
      inactivePlayers: inactivePlayers,
      makePlayerActive: makePlayerActive,
      makePlayerInactive: makePlayerInactive,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
    }
  }, [page, currentGame, selectedPlayers, inactivePlayers, makePlayerActive, makePlayerInactive, addPlayer, removePlayer]);

  const handleTransitionClick = useCallback(() => {
    startTransition?.(currentGame)
  }, [currentGame, startTransition]);

  console.log(playerSelectionContext)
  return (
    <Flex height="100%" direction="column">
      <PlayerSelectionContext.Provider value={playerSelectionContext}>
        <Flex>
          <InactivePlayers inactivePlayers={inactivePlayers} makePlayerActive={makePlayerActive}/>
          <Button onClick={handleTransitionClick}>Transition</Button>
        </Flex>
        <Flex grow="1" minHeight="0">
          <PlayerOverview />
        </Flex>
        <SelectedPlayers selectedPlayers={selectedPlayers} removePlayer={removePlayer} />
      </PlayerSelectionContext.Provider>
    </Flex>
  );
}

export const PickerPage = memo(PickerPageComponent)

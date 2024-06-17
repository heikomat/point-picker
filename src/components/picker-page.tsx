import { Button, Flex } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PlayerOverview } from "./player-overview/player-overview";
import { SelectedPlayers } from "./selected-players/selected-players";
import { Player, playerCanBeSelected, players } from "../contracts";
import { PlayerSelectionContext } from "../player-selection-context";
import { InactivePlayers } from "./inactive-players/inactive-players";
import { subtractPlayer, addPlayer as toolsAddPlayer, playerFromNumber, numberFromPLayer } from "../tools";
import { GameTransitionContext } from "../game-transition-context";
import { MotionConfig } from "framer-motion"

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

const initialMotionConfig = {
  duration: 0,
};

const motionConfig = {
  duration: 0.175,
  ease: 'easeInOut',
};

export function PickerPage(props: Props) {
  const {page, title} = props;

  const {startTransition, lastAppliedTransition} = useContext(GameTransitionContext);

  const [{initialSelectedPlayers, initialInactivePlayers, initialIsLocked}] = useState(() => {
    const initialSetup = localStorage.getItem(`pickedPlayers-${page}`);
    if (initialSetup === undefined || initialSetup === null || initialSetup === '') {
      return {initialSelectedPlayers: [], initialInactivePlayers: [], initialIsLocked: false};
    }

    const {selectedPlayerNumbers, inactivePlayerNumbers, isLocked} = JSON.parse(initialSetup);
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
      initialIsLocked: isLocked,
    };
  })

  const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>(initialSelectedPlayers);
  const [inactivePlayers, setInactivePlayers] = useState<Array<Player>>(initialInactivePlayers);
  const [isLocked, setIsLocked] = useState<boolean>(initialIsLocked);

  useEffect(() => {
    if (lastAppliedTransition?.gameId === page) {
      setSelectedPlayers(lastAppliedTransition?.selectedPlayerNumbers.map(playerFromNumber))
    }
  }, [lastAppliedTransition, page])

  const addPlayer = (player: Player) => {
    if (isLocked) {
      return;
    }

    setSelectedPlayers((selectedPlayers) => {
      if (!playerCanBeSelected(selectedPlayers, player)) {
        return selectedPlayers
      }

      return toolsAddPlayer(selectedPlayers, player);
    })
  };
  
  const removePlayer = (player: Player) => {
    if (isLocked) {
      return;
    }

    setSelectedPlayers((selectedPlayers) => {
      return subtractPlayer(selectedPlayers, player);
    })
  };

  const makePlayerInactive = (player: Player) => {
    if (isLocked) {
      return;
    }

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
  };
  
  const makePlayerActive = (player: Player) => {
    if (isLocked) {
      return;
    }

    setInactivePlayers((inactivePlayers) => {
      return inactivePlayers.slice(0).filter((inactivePlayer) => {
        return inactivePlayer.number !== player.number
      })
    })
  };

  const currentGame = {
    id: page,
    title: title,
    selectedPlayerNumbers: selectedPlayers.map(numberFromPLayer),
    inactivePlayerNumbers: inactivePlayers.map(numberFromPLayer),
    isLocked: isLocked,
  };

  localStorage.setItem(`pickedPlayers-${page}`, JSON.stringify(currentGame));
  const playerSelectionContext = {
    selectedPlayers: selectedPlayers,
    inactivePlayers: inactivePlayers,
    makePlayerActive: makePlayerActive,
    makePlayerInactive: makePlayerInactive,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
  };

  const handleTransitionClick = () => {
    startTransition?.(currentGame)
  };

  const handleLockClick = () => {
    setIsLocked((isLocked) => {
      return !isLocked;
    })
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false)
  }, []);

  return (
    <MotionConfig transition={isFirstRender ? initialMotionConfig : motionConfig}>
      <Flex height="100%" direction="column">
        <PlayerSelectionContext.Provider value={playerSelectionContext}>
          <Flex padding="0.75rem" gap="0.75rem">
            <InactivePlayers inactivePlayers={inactivePlayers} makePlayerActive={makePlayerActive}/>
            <Button colorScheme={isLocked ? 'green' : 'orange'} onClick={handleLockClick}>{isLocked ? '🔒' : '🔓'}</Button>
            <Button colorScheme="teal" onClick={handleTransitionClick}>🔁</Button>
          </Flex>
          <Flex grow="1" minHeight="0" opacity={isLocked ? '0.2' : '1'} transition="opacity 0.2s">
            <PlayerOverview />
          </Flex>
          <Flex padding="0.5rem">
            <SelectedPlayers selectedPlayers={selectedPlayers} removePlayer={removePlayer} />
          </Flex>
        </PlayerSelectionContext.Provider>
      </Flex>
    </MotionConfig>
  );
}

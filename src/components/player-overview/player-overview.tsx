import { Player, playerCanBeSelected, players } from "../../contracts";
import { memo, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { OverviewPlayer, overviewPlayerWidth } from "./overview-player";
import { PlayerSelectionContext } from "../../player-selection-context";
import { numberFromPLayer } from "../../tools";
import { playerBlock } from "../../assets/styles";
import { MotionBox } from "../motion-box";
import { AnimatePresence } from "framer-motion";
import { scaleAnimation } from "../../contracts/scale-animation";
import { useScale } from "../../scale";

const playersByPoints: {[key: string]: Array<Player>} = {};
for (const player of players) {
  if (playersByPoints[player.totalPoints] === undefined) {
    playersByPoints[player.totalPoints] = [];
  }

  playersByPoints[player.totalPoints].push(player);
}

const PlayerOverviewComponent = (): ReactElement => {

  const {addPlayer, selectedPlayers, removePlayer, makePlayerInactive, inactivePlayers} = useContext(PlayerSelectionContext);

  const selectablePlayerNumbers = useMemo(() => {
    return new Set(players
      .filter((player) => {
        return playerCanBeSelected(selectedPlayers, player)
      })
      .map(numberFromPLayer)
    );
  }, [selectedPlayers]);

  const inactivePlayerNumbers = useMemo(() => {
    return new Set(inactivePlayers.map((inactivePlayer) => {
      return inactivePlayer.number;
    }))
  }, [inactivePlayers]);

  const playersToRender = useMemo(() => {
    return Object
      .entries(playersByPoints)
      .map(([points, players]): [string, Array<Player>] => {
        const nonInactivePlayers = players.filter((player) => {
          return !inactivePlayerNumbers.has(player.number);
        })
        return [points, nonInactivePlayers];
      })
      .filter(([points, players]) => {
        return players.length > 0;
      })
      .sort(([points1], [points2]) => {
        return parseFloat(points2) - parseFloat(points1);
      });
  }, [inactivePlayerNumbers]);

  const selectedPlayerNumbers = useMemo(() => {
    return new Set(selectedPlayers.map(numberFromPLayer))
  }, [selectedPlayers]);

  const handlePlayerClick = useCallback((player: Player) => {
    if (selectedPlayerNumbers.has(player.number)) {
      window.navigator.vibrate(10);
      removePlayer?.(player)
    } else if (selectablePlayerNumbers.has(player.number)) {
      window.navigator.vibrate(10);
      addPlayer?.(player);
    }
  }, [addPlayer, removePlayer, selectablePlayerNumbers, selectedPlayerNumbers]);


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // TODO: make number-groups only as large as necessary
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWindowWidth);
    return (): void => {
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  const scale = useScale();

  const currentWidth = windowWidth - 16;
  const fittingPlayers = Math.floor((currentWidth/(overviewPlayerWidth + 32)) / scale);

  const maxColumns = fittingPlayers > 5 ? 3 : 2;

  let remainingColumns = fittingPlayers;

  return (
    <Flex 
      overflow="auto"
      width="100%"
      height="100%"
      >
      <Flex
        direction="row"
        width="100%"
        padding="0.75rem"
        paddingTop="0"
        flexWrap="wrap"
        gap="0.75rem"
        height="min-content"
      >
        {playersToRender.map(([points, players], index) => {
          
          let columnsToOccupy = Math.min(players.length, maxColumns, remainingColumns);
          const currentRows = Math.ceil(players.length / columnsToOccupy);

          const nextBlockExists = index < playersToRender.length - 1;
          const nextBlockIsInCurrentRow = (remainingColumns - columnsToOccupy) > 0;
          if (nextBlockExists && nextBlockIsInCurrentRow) {
            const nextPlayerCount = playersToRender[index + 1][1].length;
            const nextColumnsToOccupy = Math.min(nextPlayerCount, maxColumns, remainingColumns);
            const nextRows = Math.ceil(nextPlayerCount / nextColumnsToOccupy);
            if (nextRows > currentRows && columnsToOccupy > 1) {
              columnsToOccupy -= 1;
            }
          }
      
          const blockWidth = columnsToOccupy * 100 / fittingPlayers;

          remainingColumns = remainingColumns - columnsToOccupy;
          if (remainingColumns <= 0) {
            remainingColumns = fittingPlayers
          }

          return (
            <AnimatePresence>
              <MotionBox display="flex" layout key={points} flexDirection="column" width={`calc(${blockWidth}% - 0.75rem)`} {...playerBlock} {...scaleAnimation} padding="5px" gap="0.5rem" >
                <Flex justifyContent="start" fontWeight="bold" width="100%">{points + ' Pt.'}</Flex>
                <Grid templateColumns={`repeat(${columnsToOccupy}, 1fr)`} rowGap="0.5rem" alignItems="start" justifyItems="center">
                  {players.map((player) => {
                    return <OverviewPlayer key={player.number} player={player} onClick={handlePlayerClick} displayDisabled={!selectablePlayerNumbers.has(player.number)} onLongPress={makePlayerInactive} isSelected={selectedPlayerNumbers.has(player.number)}/>
                  })}
                </Grid>
              </MotionBox>
            </AnimatePresence>
          )
        })}
      </Flex>
    </Flex>
  );
};

export const PlayerOverview = memo(PlayerOverviewComponent);

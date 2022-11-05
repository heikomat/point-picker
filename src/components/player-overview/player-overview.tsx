import { Player, playerCanBeSelected, players } from "../../contracts";
import { memo, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid } from "@chakra-ui/react";
import { OverviewPlayer, overviewPlayerWidth } from "./overview-player";
import { PlayerSelectionContext } from "../../player-selection-context";

const playersByPoints: {[key: string]: Array<Player>} = {};
const maxColumns = 2;
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
      .map((player) => {
        return player.number
      })
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
    return new Set(selectedPlayers.map((player) => {
      return player.number;
    }))
  }, [selectedPlayers]);

  const handlePlayerClick = useCallback((player: Player) => {
    if (selectedPlayerNumbers.has(player.number)) {
      removePlayer?.(player)
    } else if (selectablePlayerNumbers.has(player.number)) {
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
      window.removeEventListener('resite', updateWindowWidth);
    }
  });

  const currentWidth = Math.min(windowWidth, 500) - 16;
  const fittingPlayers = Math.floor(currentWidth/(overviewPlayerWidth + 32));
  const singleColumnWidth = 100/fittingPlayers;
  const multiColumnWidth = 200/fittingPlayers;

  let remainingColumns = fittingPlayers;

  return (
    <Flex direction="row" width="100%" padding="12px" paddingTop="0" flexWrap="wrap" gap="12px"  overflow="auto">
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
          <Flex key={points} direction="column" width={`calc(${blockWidth}% - 9px)`} backgroundColor="gray.100" boxShadow="1px 1px 3px 0px #c0c0c0" borderRadius="5px" padding="5px" gap="8px" >
            <Flex justifyContent="start" fontWeight="bold" width="100%">{points + ' Pt.'}</Flex>
            <Grid templateColumns={`repeat(${columnsToOccupy}, 1fr)`} rowGap="8px" alignItems="start" justifyItems="center">
              {players.map((player) => {
                return <OverviewPlayer key={player.number} player={player} onClick={handlePlayerClick} displayDisabled={!selectablePlayerNumbers.has(player.number)} onLongPress={makePlayerInactive} isSelected={selectedPlayerNumbers.has(player.number)}/>
              })}
            </Grid>
          </Flex>
        )
      })}
    </Flex>
  );
};

export const PlayerOverview = memo(PlayerOverviewComponent);

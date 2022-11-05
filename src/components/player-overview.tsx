import { Player, playerCanBeSelected, players } from "../contracts";
import { memo, ReactElement, useCallback, useContext, useMemo } from "react";
import { Box, Flex, Grid, VStack } from "@chakra-ui/react";
import { OverviewPlayer, overviewPlayerWidth } from "./overview-player";
import { PlayerSelectionContext } from "../player-selection-context";

const playersByPoints: {[key: string]: Array<Player>} = {};
for (const player of players) {
  if (playersByPoints[player.totalPoints] === undefined) {
    playersByPoints[player.totalPoints] = [];
  }

  playersByPoints[player.totalPoints].push(player);
}

console.log(Object
  .entries(playersByPoints))
const playersByPointsArray = Object
  .entries(playersByPoints)
  .sort(([points1], [points2]) => {
    return parseFloat(points2) - parseFloat(points1);
  });

const PlayerOverviewComponent = (): ReactElement => {

  const {addPlayer, selectedPlayers, removePlayer} = useContext(PlayerSelectionContext);

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


  // TODO: make number-groups only as large as necessary
  const currentWidth = Math.min(window.innerWidth, 500) - 16;
  const fittingPlayers = Math.floor(currentWidth/(overviewPlayerWidth + 24));
  const singleColumnWidth = 100/fittingPlayers;
  const multiColumnWidth = 200/fittingPlayers;

  let remainingColumns = fittingPlayers;
  console.log('fittingPlayers', fittingPlayers)

  return (
    <Flex direction="row" flexGrow="1" width="100%" padding="12px" flexWrap="wrap" gap="8px">
      {playersByPointsArray.map(([points, players]) => {
        
        const columnsToOccupy = Math.min(players.length, 2, remainingColumns);
        const width = columnsToOccupy === 1 ? singleColumnWidth : multiColumnWidth;
        console.log(columnsToOccupy, width)
        remainingColumns = remainingColumns - columnsToOccupy;
        if (remainingColumns <= 0) {
          remainingColumns = fittingPlayers
        }

        return <Flex key={points} direction="column" width={`calc(${width}% - 9px)`} border="1px solid #cecece" borderRadius="5px" padding="5px">
          <Flex justifyContent="start" fontWeight="bold" width="100%">{points + ' Punkte'}</Flex>
          <Grid templateColumns={`repeat(auto-fit, ${overviewPlayerWidth}px)`} gap="8px" width="100%" alignItems="start">
          {players.map((player) => {
            return <OverviewPlayer key={player.number} player={player} onClick={handlePlayerClick} displayDisabled={!selectablePlayerNumbers.has(player.number)}/>
          })}
        </Grid>
        </Flex>
      })}
    </Flex>
  );
};

export const PlayerOverview = memo(PlayerOverviewComponent);

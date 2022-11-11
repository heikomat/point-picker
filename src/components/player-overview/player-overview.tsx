import { Player, playerCanBeSelected, players } from "../../contracts";
import { memo, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { OverviewPlayer, overviewPlayerWidth } from "./overview-player";
import { PlayerSelectionContext } from "../../player-selection-context";
import { numberFromPLayer } from "../../tools";
import { playerBlock } from "../../assets/styles";

const maxColumns = 2;
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
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  const currentWidth = Math.min(windowWidth, 500) - 16;
  const fittingPlayers = Math.floor(currentWidth/(overviewPlayerWidth + 32));

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
          <Flex key={points} direction="column" width={`calc(${blockWidth}% - 9px)`} {...playerBlock} padding="5px" gap="8px" >
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

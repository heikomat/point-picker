import { Box, Flex } from "@chakra-ui/react";
import { memo, ReactElement, useMemo } from "react";
import { playerBlock } from "../../assets/styles";
import { Player } from "../../contracts";
import { SelectedPlayer } from "./selected-player";

type Props = {
  selectedPlayers: Array<Player>
  removePlayer?: (player: Player) => void;
  title?: string
  newPlayerNumbers?: Set<number>;
}

const SelectedPlayersComponent = (props: Props): ReactElement => {
  const {
    selectedPlayers,
    removePlayer,
    title="Kader",
    newPlayerNumbers,
  } = props;

  const sortedSelectedPlayers = useMemo(() => {
    return selectedPlayers.sort((player1, player2) => {
      return player2.totalPoints - player1.totalPoints;
    });
  }, [selectedPlayers])

  const totalPoints = useMemo(() => {
    let result = 0;
    for (const player of selectedPlayers) {
      result += player.totalPoints;
    }
    return result;
  }, [selectedPlayers]);

  const remainingPoints = 14.5 - totalPoints;
  return (
    <Flex
      {...playerBlock}
      direction="column"
      width="100%"
      height="114px"
      backgroundColor="blue.50"
      border="1px solid #e0e0e0"
      padding="8px"
      shrink="0"
    >
      <Box fontWeight="bold" paddingBottom="4px">{title}</Box>
      <Flex height="100%">
        <Flex gap="4px" alignItems="start">
          {sortedSelectedPlayers.map((player) => {
            return <SelectedPlayer key={player.number} player={player} onClick={removePlayer} isNew={newPlayerNumbers?.has(player.number)}/>
          })}
        </Flex>
        {
          (selectedPlayers.length > 0) && (
            <Flex paddingLeft="10px" width="60px" height="100%" alignItems="end" fontWeight="bold">
              {`= ${totalPoints}`}
            </Flex>
          )
        }
        <Flex
          direction="column"
          width="55px"
          flexGrow="1"
          alignItems="end"
          paddingRight="10px"
          justifyContent="end"
        >
          <Box>{'Übrig'}</Box>
          <Box
            fontWeight="bold"
            fontSize={remainingPoints < 0 ? '20px': '16px'}
            color={remainingPoints < 0 ? 'red': undefined}
          >
            {`${remainingPoints}`}
          </Box>
        </Flex>
      </Flex>
    </Flex>

  );
};

export const SelectedPlayers = memo(SelectedPlayersComponent);

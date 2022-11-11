import { Collapse, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import { memo, ReactElement, useContext } from "react";
import { Player } from "../../contracts";
import { PlayerSelectionContext } from "../../player-selection-context";
import { OverviewPlayer } from "../player-overview/overview-player";

const playerWidth = 50;

type Props = {
  inactivePlayers?: Array<Player>
  makePlayerActive?: (player: Player) => void;
}

const InactivePlayersComponent = (props: Props): ReactElement => {
  const {inactivePlayers = [], makePlayerActive} = props;
  const { isOpen, onToggle } = useDisclosure()

  return (
      <Flex width="100%" onClick={onToggle}>
        <Flex direction="column" width="100%" border="1px solid #cecece" borderRadius="5px" padding="5px"  backgroundColor="gray.200">
          <Flex justifyContent="start" fontWeight="bold" width="100%">{`Inaktiv (${inactivePlayers.length})`}</Flex>
            <Collapse in={isOpen} animateOpacity>
              <Grid templateColumns={`repeat(auto-fit, ${playerWidth}px)`} gap="8px" width="100%" alignItems="start">
                {inactivePlayers.map((player) => {
                  return <OverviewPlayer playerWidth={playerWidth} key={player.number} player={player} onLongPress={makePlayerActive} />
                })}
            </Grid>
          </Collapse>
        </Flex>
      </Flex>
  );
};

export const InactivePlayers = memo(InactivePlayersComponent);

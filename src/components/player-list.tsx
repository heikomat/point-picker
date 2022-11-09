import { Box, Flex } from "@chakra-ui/react";
import { memo, ReactElement } from "react";
import { Player } from "../contracts";

type Props = {
  players?: Array<Player>
}

const PlayerListComponent = (props: Props): ReactElement => {
  const {players = []} = props;

  return (
    <Box>
      {players.map((player) => {
        return <Flex>
          {player.displayName}
        </Flex>
      })}
    </Box>
  );
};

export const PlayerList = memo(PlayerListComponent);

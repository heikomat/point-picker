import { Box } from "@chakra-ui/react";
import { memo, ReactElement } from "react";
import { Player } from "../contracts";

type Props = {
}

const PlayerListComponent = (props: Props): ReactElement => {
  return (
    <Box>
      {'AA'}
    </Box>
  );
};

export const PlayerList = memo(PlayerListComponent);

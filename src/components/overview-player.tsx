import { Flex } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../contracts";
import { PlayerPicture } from "./player-picture";

type Props = {
  player: Player;
  onClick?: (player: Player) => void
  displayDisabled?: boolean;
}

const OverviewPlayerComponent = (props: Props): ReactElement => {
  const {player, onClick, displayDisabled} = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  // TODO: Show icon when in kader

  return (
    <Flex
      width="70px"
      direction="column"
      textAlign="center"
      fontSize="12px"
      whiteSpace="nowrap"
      opacity={displayDisabled ? 0.5 : 1}
      onClick={handleClick}
      flexGrow="1"
    >
      <PlayerPicture player={player} />
      {player.displayName}
    </Flex>
  );
};

export const OverviewPlayer = memo(OverviewPlayerComponent);

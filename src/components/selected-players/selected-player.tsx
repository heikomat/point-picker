import { Flex } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";

type Props = {
  player: Player;
  onClick?: (player: Player) => void
}

const SelectedPlayerComponent = (props: Props): ReactElement => {
  const {player, onClick} = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  return (
    <Flex
      width="50px"
      direction="column"
      textAlign="center"
      fontSize="16px"
      whiteSpace="nowrap"
      onClick={handleClick}
    >
      <PlayerPicture player={player}/>
      {`${player.totalPoints} pt`}
    </Flex>
  );
};

export const SelectedPlayer = memo(SelectedPlayerComponent);

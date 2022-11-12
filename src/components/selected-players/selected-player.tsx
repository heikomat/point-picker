import { Flex } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";

type Props = {
  player: Player;
  onClick?: (player: Player) => void
  isNew?: boolean;
}

const SelectedPlayerComponent = (props: Props): ReactElement => {
  const {player, onClick, isNew} = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  return (
    <Flex
      width="46px"
      direction="column"
      textAlign="center"
      fontSize="16px"
      whiteSpace="nowrap"
      onClick={handleClick}
    >
      <PlayerPicture player={player} isNew={isNew}/>
      {`${player.totalPoints} pt`}
    </Flex>
  );
};

export const SelectedPlayer = memo(SelectedPlayerComponent);

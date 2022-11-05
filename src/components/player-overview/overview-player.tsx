import { Flex } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";
import { useLongPress } from 'use-long-press';

type Props = {
  player: Player;
  onClick?: (player: Player) => void;
  onLongPress?: (player: Player) => void;
  displayDisabled?: boolean;
  playerWidth?: number
}

export const overviewPlayerWidth = 70;

const OverviewPlayerComponent = (props: Props): ReactElement => {
  const {player, onClick, displayDisabled, onLongPress, playerWidth = overviewPlayerWidth} = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  const bind = useLongPress((event) => {
    event.stopPropagation();
    event.preventDefault();
    onLongPress?.(player);
  }, {captureEvent: true});

  const fontSize = playerWidth < overviewPlayerWidth ? '10px' : '12px';
  // TODO: Show icon when in kader

  return (
    <Flex
      width={`${playerWidth}px`}
      userSelect="none"
      direction="column"
      textAlign="center"
      fontSize={fontSize}
      whiteSpace="nowrap"
      opacity={displayDisabled ? 0.5 : 1}
      onClick={handleClick}
      flexGrow="1"
      {...bind()}
    >
      <PlayerPicture player={player} />
      {player.displayName}
    </Flex>
  );
};

export const OverviewPlayer = memo(OverviewPlayerComponent);

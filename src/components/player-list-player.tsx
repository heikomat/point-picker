import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../contracts";
import { PlayerPicture } from "./player-picture";
import { MotionBox } from "./motion-box";
import { pxToRem } from "../scale";

type Props = BoxProps & {
  player: Player
  isGreyedOut?: boolean;
  showAsNew?: boolean;
  showAsOld?: boolean
  onPlayerClick?: (player: Player) => void;
}

const PlayerListPlayerComponent = (props: Props): ReactElement => {
  const {
    player,
    isGreyedOut = false,
    showAsNew,
    showAsOld,
    onPlayerClick,
  } = props;

  const handleClick = useCallback(() => {
    window.navigator.vibrate(10);
    onPlayerClick?.(player);
  }, [onPlayerClick, player]);

  return (
    <MotionBox
      display="grid"
      key={player.number}
      gridAutoRows="min-content"
      gridTemplateColumns={`${pxToRem(50)}rem 1fr max-content`}
      columnGap="0.375rem"
      width="100%"
      onClick={handleClick}
      layout="position"
      layoutId={`${player.number}`}
    >
      <PlayerPicture player={player} isNew={showAsNew} isOld={showAsOld}/>
      {/*<Flex alignItems="center">{`#${player.number}`}</Flex>*/}
      <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" lineHeight={`${pxToRem(50)}rem`}>{player.displayName}</Box>
      <Flex alignItems="center">{`${player.totalPoints}`}</Flex>
    </MotionBox>
  )
};

export const PlayerListPlayer = memo(PlayerListPlayerComponent);

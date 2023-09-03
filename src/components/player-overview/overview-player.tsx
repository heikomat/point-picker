import { Box } from "@chakra-ui/react";
import { memo, ReactElement, useCallback } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";
import { useLongPress } from 'use-long-press';
import { MotionBox } from "../motion-box";
import { AnimatePresence } from "framer-motion";
import { scaleAnimation } from "../../contracts/scale-animation";
import { pxToRem } from "../../scale";

type Props = {
  player: Player;
  onClick?: (player: Player) => void;
  onLongPress?: (player: Player) => void;
  displayDisabled?: boolean;
  playerWidth?: number;
  isSelected?: boolean;
}

export const overviewPlayerWidth = 64;

const OverviewPlayerComponent = (props: Props): ReactElement => {
  const {
    player,
    onClick,
    displayDisabled,
    onLongPress,
    playerWidth = overviewPlayerWidth,
    isSelected = false,
  } = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  const bind = useLongPress((event) => {
    event.stopPropagation();
    event.preventDefault();
    window.navigator.vibrate(10);
    onLongPress?.(player);
  }, {
    captureEvent: true,
    cancelOnMovement: 20,
    threshold: 1000,
  });

  const fontSize = playerWidth < overviewPlayerWidth ? '0.625rem' : '0.75rem';

  return (
    <AnimatePresence>
      <MotionBox
        width={`${pxToRem(playerWidth)}rem`}
        userSelect="none"
        display="flex"
        flexDirection="column"
        textAlign="center"
        fontSize={fontSize}
        whiteSpace="nowrap"
        onClick={handleClick}
        flexGrow="1"
        position="relative"
        {...scaleAnimation}
        layout
        {...bind()}
      >
        <Box opacity={displayDisabled ? 0.5 : 1}>
          <PlayerPicture player={player} />
          {player.displayName}
        </Box>
        
        {isSelected && (
          <Box
            fontSize={`${pxToRem(42)}rem`}
            fontWeight="bold"
            bottom="10.5rem"
            left="0"
            top="0"
            lineHeight={`${pxToRem(overviewPlayerWidth)}rem`}
            width="100%"
            position="absolute"
            textShadow="0px 0px 0.625rem rgb(255 255 255)"
            color="green.500"
          >
            {`✓`}
          </Box>
        )}
      </MotionBox>
    </AnimatePresence>
  );
};

export const OverviewPlayer = memo(OverviewPlayerComponent);

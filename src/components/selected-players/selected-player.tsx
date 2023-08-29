import { memo, ReactElement, useCallback } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";
import { AnimatePresence } from "framer-motion";
import { MotionBox } from "../motion-box";

type Props = {
  player: Player;
  onClick?: (player: Player) => void
  isNew?: boolean;
}

const variants = {
  visible: { scale: 1 },
  hidden: { scale: 0 },
};

const SelectedPlayerComponent = (props: Props): ReactElement => {
  const {player, onClick, isNew} = props;

  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  return (
    <AnimatePresence>
      <MotionBox
        display="flex"
        width="46px"
        flexDirection="column"
        textAlign="center"
        fontSize="16px"
        whiteSpace="nowrap"
        onClick={handleClick}
        initial="hidden"
        animate="visible"
        variants={variants}
        key={`selected_${player.number}`}
        layout
        layoutId={`selected_${player.number}`}
      >
        <PlayerPicture player={player} isNew={isNew}/>
        {`${player.totalPoints} pt`}
      </MotionBox>
    </AnimatePresence>
  );
};

export const SelectedPlayer = memo(SelectedPlayerComponent);

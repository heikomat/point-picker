import { ReactElement } from "react";
import { Player } from "../../contracts";
import { PlayerPicture } from "../player-picture";
import { AnimatePresence } from "framer-motion";
import { MotionBox } from "../motion-box";
import { scaleAnimation } from "../../contracts/scale-animation";

type Props = {
  player: Player;
  onClick?: (player: Player) => void
  isNew?: boolean;
}

export const SelectedPlayer = (props: Props): ReactElement => {
  const {player, onClick, isNew} = props;

  const handleClick = () => {
    onClick?.(player);
  };

  return (
    <AnimatePresence>
      <MotionBox
        display="flex"
        width="2.875rem"
        flexDirection="column"
        textAlign="center"
        fontSize="1rem"
        whiteSpace="nowrap"
        onClick={handleClick}
        {...scaleAnimation}
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

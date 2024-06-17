import { Box } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Player } from "../contracts";
import placeholder from '../assets/placeholder.webp';
import { pxToRem } from "../scale";

type Props = {
  player: Player
  showNumber?: boolean;
  isNew?: boolean;
  isOld?: boolean;
}

const imageStyle = {
  aspectRatio: 1,
}

export const PlayerPicture = (props: Props): ReactElement => {
  const {player, showNumber = true, isNew = false, isOld = false} = props;

  let borderStyle = isNew ? `${pxToRem(3)}rem solid #2ec61f` : `1px solid #7e8cef`;
  borderStyle = isOld ? `${pxToRem(3)}rem solid #c64b1f` : borderStyle;

  return (
    <Box
      backgroundImage={player.image ?? placeholder}
      width="100%"
      style={imageStyle}
      borderRadius={`${pxToRem(5)}rem`}
      border={borderStyle}
      backgroundSize="cover"
      position="relative"
      overflow="hidden"
    >
      {showNumber && (
        <Box
        backgroundColor="blue"
        paddingX={`${pxToRem(3)}rem`}
        fontSize="0.75rem"
        top="0px"
        right="0px"
        position="absolute"
        borderBottomLeftRadius={`${pxToRem(3)}rem`}
        color="white"
        >
        {`#${player.number}`}
        </Box>
      )}
      {!player.isDisabled && (
        <Box width="45%" height="45%" backgroundColor="red.600" transform="rotate(45deg)" right="-22.5%" bottom="-22.5%" position="absolute" />
      )}
    </Box>
  );
};

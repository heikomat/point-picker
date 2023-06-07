import { Box } from "@chakra-ui/react";
import { memo, ReactElement } from "react";
import { Player } from "../contracts";
import placeholder from '../assets/placeholder.webp';

type Props = {
  player: Player
  showNumber?: boolean;
  isNew?: boolean;
  isOld?: boolean;
}

const imageStyle = {
  aspectRatio: 1,
}

const PlayerPictureComponent = (props: Props): ReactElement => {
  const {player, showNumber = true, isNew = false, isOld = false} = props;

  let borderStyle = isNew ? '3px solid #2ec61f' : '1px solid #7e8cef';
  borderStyle = isOld ? '3px solid #c64b1f' : borderStyle;

  return (
    <Box
      backgroundImage={player.image ?? placeholder}
      width="100%"
      style={imageStyle}
      borderRadius="5px"
      border={borderStyle}
      backgroundSize="cover"
      position="relative"
      overflow="hidden"
    >
      {showNumber && (
        <Box
        backgroundColor="blue"
        paddingX="3px"
        fontSize="12px"
        top="0px"
        right="0px"
        position="absolute"
        borderBottomLeftRadius="3px"
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

export const PlayerPicture = memo(PlayerPictureComponent);

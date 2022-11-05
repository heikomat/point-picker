import { Box } from "@chakra-ui/react";
import { memo, ReactElement } from "react";
import { Player } from "../contracts";

type Props = {
  player: Player
}

const imageStyle = {
  aspectRatio: 1,
}

const PlayerPictureComponent = (props: Props): ReactElement => {
  const {player} = props;

  // TODO: numbers have spacing to bottom. remove it
  return (
    <Box
      backgroundImage={player.image}
      width="100%"
      style={imageStyle}
      borderRadius="5px"
      border="1px solid #7e8cef"
      backgroundSize="cover"
      position="relative"
      overflow="hidden"
    >
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
      {!player.isDisabled && (
        <Box width="45%" height="45%" backgroundColor="red.600" transform="rotate(45deg)" right="-22.5%" bottom="-22.5%" position="absolute">

        </Box>
      )}
    </Box>
  );
};

export const PlayerPicture = memo(PlayerPictureComponent);

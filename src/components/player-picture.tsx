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
        bottom="0px"
        position="absolute"
        borderRadius="2px"
        color="white"
      >
        {`#${player.number}`}
      </Box>
    </Box>
  );
};

export const PlayerPicture = memo(PlayerPictureComponent);

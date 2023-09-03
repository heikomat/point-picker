import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { memo, ReactElement, useMemo } from "react";
import { Player } from "../contracts";
import { PlayerPicture } from "./player-picture";
import { MotionBox } from "./motion-box";
import { pxToRem } from "../scale";

type Props = BoxProps & {
  players?: Array<Player>
  title: string;
  footer?: ReactElement;
  showPointSum?: boolean;
  onPlayerClick?: (player: Player) => void;
  greyedOutPlayers?: Set<number>;
  showAsNew?: boolean;
  showAsOld?: boolean
}

const PlayerListComponent = (props: Props): ReactElement => {
  const {
    title,
    players = [],
    footer,
    showPointSum = false,
    onPlayerClick,
    greyedOutPlayers = new Set(),
    showAsNew,
    showAsOld,
    ...boxProps
  } = props;

  const pointSum = useMemo(() => {
    let result = 0;
    for (const player of players) {
      result += player.totalPoints;
    }
    return result;
  }, [players]);

  return <Flex {...boxProps} minHeight="0" minWidth="0" direction="column">
      {/* HEADER */}
      <Flex px="0.5rem" py="0.25rem">
        <Flex fontWeight="bold" grow="1">{`${title} (${players.length})`}</Flex>
        <Box>{'PT'}</Box>
      </Flex>

      <Flex grow="1" shrink="1" overflow="hidden">
        <Flex
          gap="0.5rem"
          direction="column"
          overflow="auto"
          px="0.5rem"
          width="100%"
          paddingBottom="0.5rem"
        >
          {players.map((player) => {
            const playerIsGreyedOut = greyedOutPlayers.has(player.number);
            return <MotionBox
              display="grid"
              key={player.number}
              gridAutoRows="min-content"
              gridTemplateColumns={`${pxToRem(50)}rem 1fr max-content`}
              columnGap="0.375rem"
              width="100%"
              opacity={playerIsGreyedOut ? '0.5' : '1'}
              onClick={() => {
                window.navigator.vibrate(10);
                onPlayerClick?.(player);
              }}
              layout="position"
              layoutId={`${player.number}`}
            >
              <PlayerPicture player={player} isNew={showAsNew} isOld={showAsOld}/>
              {/*<Flex alignItems="center">{`#${player.number}`}</Flex>*/}
              <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" lineHeight={`${pxToRem(50)}rem`}>{player.displayName}</Box>
              <Flex alignItems="center">{`${player.totalPoints}`}</Flex>
            </MotionBox>
          })}
      </Flex>
    </Flex>
    {showPointSum && (
      <Flex borderTop="1px solid #cecece" justifyContent="end" px="0.5rem">
        {`= ${pointSum}`}
      </Flex>
    )}
  </Flex>
};

export const PlayerList = memo(PlayerListComponent);

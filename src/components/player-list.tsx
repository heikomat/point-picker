import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { memo, ReactElement, useMemo } from "react";
import { Player } from "../contracts";
import { MotionBox } from "./motion-box";
import { PlayerListPlayer } from "./player-list-player";

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

  if (greyedOutPlayers !== undefined) {
    console.log('greyedOutPlayers', greyedOutPlayers)
  }

  return <Flex {...boxProps} minHeight="0" minWidth="0" direction="column">
      {/* HEADER */}
      <Flex px="0.5rem" py="0.25rem">
        <Flex fontWeight="bold" grow="1">{`${title} (${players.length})`}</Flex>
        {showPointSum && (<Box>{`= ${pointSum}`}</Box>)}
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
            return (
              <MotionBox
                key={player.number}
                layout="position"
                layoutId={`${player.number}`}
              >
                <PlayerListPlayer
                  player={player}
                  isGreyedOut={greyedOutPlayers.has(player.number)}
                  showAsOld={showAsOld}
                  showAsNew={showAsNew}
                  onPlayerClick={onPlayerClick}
                />
              </MotionBox>
            );
          })}
      </Flex>
    </Flex>
  </Flex>
};

export const PlayerList = memo(PlayerListComponent);

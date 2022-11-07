import { Flex } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { Game } from "./picker-page";

type Props = {
  page: string
  game?: Game
}

function TransitionPageComponent(props: Props) {
  const {page, game} = props;

  useEffect(() => {
    console.log('game', game);
  }, [game]);

  return (
    <Flex height="100%" direction="column">
      {'AAAAAA'}
    </Flex>
  );
}

export const TransitionPage = memo(TransitionPageComponent)

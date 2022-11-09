import { Flex, Grid } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { Game } from "./picker-page";
import { PlayerList } from "./player-list";
import { SelectedPlayers } from "./selected-players/selected-players";

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
    <Grid height="100%" templateColumns={"1fr 1fr"} templateRows="1fr 150px min-content" templateAreas={`
      "current_game bench   "
      "out          in      "
      "new_game     new_game"
    `}>
      <Flex gridArea="current_game" direction="column">
        <PlayerList />
      </Flex>
      <Flex gridArea="bench" direction="column">
        <PlayerList />
      </Flex>
      <Flex gridArea="out" direction="column">
        <PlayerList />
      </Flex>
      <Flex gridArea="in" direction="column">
        <PlayerList />
      </Flex>
      <Flex gridArea="new_game" direction="column">
        <SelectedPlayers />
      </Flex>
    </Grid>
  );
}

export const TransitionPage = memo(TransitionPageComponent)

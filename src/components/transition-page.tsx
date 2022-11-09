import { Flex, Grid } from "@chakra-ui/react";
import { memo, useEffect, useMemo, useState } from "react";
import { Player, players, playersByNumber } from "../contracts";
import { Game } from "./picker-page";
import { PlayerList } from "./player-list";
import { SelectedPlayers } from "./selected-players/selected-players";

type Props = {
  page: string
  game?: Game
}

function TransitionPageComponent(props: Props) {
  const {page, game} = props;

  const currentGame = useMemo(() => {
    return game?.selectedPlayerNumbers.map((selectedPlayerNumber) => {
      return playersByNumber[selectedPlayerNumber]
    })
  }, [game]);

  const [playersIn, setPlayersIn] = useState<Array<Player>>([]);
  const [playersOut, setPlayersOut] = useState<Array<Player>>([]);

  const playersInNumbers = useMemo(() => {
    return new Set(playersIn.map((player) => {
      return player.number;
    }))
  }, [playersIn]);

  const playersOutNumbers = useMemo(() => {
    return new Set(playersIn.map((player) => {
      return player.number;
    }))
  }, [playersIn]);

  const newGame = useMemo(() => {
    return [
      ...(currentGame as Array<Player>)?.filter((player) => {
        return !playersOutNumbers.has(player.number)
      }),
      ...playersIn,
    ];
  }, [currentGame, playersIn, playersOutNumbers]);


  const benchPlayers = useMemo(() => {
    const inactivePlayerNumbers = new Set(game?.inactivePlayerNumbers);
    const oldSelectedPlayersNumbers = new Set(game?.selectedPlayerNumbers);
    return players
      .filter((player) => {
        const playerIsInactive = inactivePlayerNumbers.has(player.number)
        const playerIsAlreadyInGame = oldSelectedPlayersNumbers.has(player.number)
        const PlayerIsAlreadySelected = playersInNumbers.has(player.number)
        return !playerIsInactive && !playerIsAlreadyInGame && !PlayerIsAlreadySelected;
      });
  }, [game?.inactivePlayerNumbers, game?.selectedPlayerNumbers, playersInNumbers]);

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
        <PlayerList players={currentGame}/>
      </Flex>
      <Flex gridArea="bench" direction="column">
        <PlayerList players={benchPlayers}/>
      </Flex>
      <Flex gridArea="out" direction="column">
        <PlayerList players={playersOut} />
      </Flex>
      <Flex gridArea="in" direction="column">
        <PlayerList players={playersIn} />
      </Flex>
      <Flex gridArea="new_game" direction="column">
        <SelectedPlayers selectedPlayers={newGame} />
      </Flex>
    </Grid>
  );
}

export const TransitionPage = memo(TransitionPageComponent)

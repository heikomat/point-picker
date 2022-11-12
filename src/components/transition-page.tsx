import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { playerBlock } from "../assets/styles";
import { Player, playerCanBeSelected, players, playersAreValidTeam, playersByNumber } from "../contracts";
import { GameTransitionContext } from "../game-transition-context";
import { addPlayer, numberFromPLayer, playerFromNumber, sortByPoints, subtractPlayer } from "../tools";
import { InactivePlayers } from "./inactive-players/inactive-players";
import { Game } from "./picker-page";
import { PlayerList } from "./player-list";
import { SelectedPlayers } from "./selected-players/selected-players";

type Props = {
  page: string
  game?: Game
  onApply?: (newSelectedPlayersNumbers: Array<number>) => void;
}

function TransitionPageComponent(props: Props) {
  const {page, game, onApply} = props;

  const {applyTransition} = useContext(GameTransitionContext);

  const [playersIn, setPlayersIn] = useState<Array<Player>>([]);
  const [playersOut, setPlayersOut] = useState<Array<Player>>([]);

  const resetTransition = useCallback(() => {
    setPlayersIn([]);
    setPlayersOut([]);
  }, []);

  useEffect(() => {
    resetTransition();
  }, [game, resetTransition]);

  const inactivePlayers = useMemo(() => {
    return game?.inactivePlayerNumbers.map(playerFromNumber);
  }, [game?.inactivePlayerNumbers]);


  const removePlayerFromGame = useCallback((player: Player) => {
    setPlayersOut((playersOut) => {
      return sortByPoints(addPlayer(playersOut, player));
    });
  }, []);

  const readdPlayerToGame = useCallback((player: Player) => {
    setPlayersOut((playersOut) => {
      return sortByPoints(subtractPlayer(playersOut, player));
    });
  }, []);

  const addPlayerFromBench = useCallback((player: Player) => {
    setPlayersIn((playersIn) => {
      return sortByPoints(addPlayer(playersIn, player));
    });
  }, []);

  const readdPlayerToBench = useCallback((player: Player) => {
    setPlayersIn((playersIn) => {
      return sortByPoints(subtractPlayer(playersIn, player));
    });
  }, []);

  const playersInNumbers = useMemo(() => {
    return new Set(playersIn.map(numberFromPLayer))
  }, [playersIn]);

  const playersOutNumbers = useMemo(() => {
    return new Set(playersOut.map(numberFromPLayer))
  }, [playersOut]);

  const currentGame = useMemo(() => {
    return sortByPoints(game?.selectedPlayerNumbers
      .filter((playerNumber) => {
        return !playersOutNumbers.has(playerNumber);
      })
      .map(playerFromNumber) ?? [])
  }, [game?.selectedPlayerNumbers, playersOutNumbers]);

  const newGame = useMemo(() => {
    return [
      ...(currentGame as Array<Player>)?.filter((player) => {
        return !playersOutNumbers.has(player.number)
      }),
      ...playersIn,
    ];
  }, [currentGame, playersIn, playersOutNumbers]);

  const handleApplyGame = useCallback(() => {
    applyTransition?.(game?.id, newGame.map(numberFromPLayer))
    resetTransition();
  }, [applyTransition, game?.id, newGame, resetTransition]);

  const benchPlayers = useMemo(() => {
    const inactivePlayerNumbers = new Set(game?.inactivePlayerNumbers);
    const oldSelectedPlayersNumbers = new Set(game?.selectedPlayerNumbers);
    console.log(players);
    return sortByPoints(players
      .filter((player) => {
        const playerIsInactive = inactivePlayerNumbers.has(player.number)
        const playerIsAlreadyInGame = oldSelectedPlayersNumbers.has(player.number)
        const PlayerIsAlreadySelected = playersInNumbers.has(player.number)
        return !playerIsInactive && !playerIsAlreadyInGame && !PlayerIsAlreadySelected;
      }));
  }, [game?.inactivePlayerNumbers, game?.selectedPlayerNumbers, playersInNumbers]);

  const unselectablePlayerNumbers = useMemo(() => {
    return new Set(players
      .filter((player) => {
        return !playerCanBeSelected(newGame, player);
      })
      .map(numberFromPLayer));
  }, [newGame]);

  const transitionIsValid = useMemo(() => {
    return playersAreValidTeam(newGame);
  }, [newGame]);

  const handleRemovePlayerFromNewGame = useCallback((player: Player) => {
    if (playersInNumbers.has(player.number)) {
      readdPlayerToBench(player);
    } else {
      removePlayerFromGame(player);
    }
  }, [playersInNumbers, readdPlayerToBench, removePlayerFromGame])

  console.log('transitionIsValid', transitionIsValid)

  return (
    <Grid height="100%" templateColumns={"1fr 1fr"} templateRows="min-content 3fr 2fr min-content min-content" gap="8px" padding="8px" templateAreas={`
      "inactive     inactive"
      "current_game bench   "
      "out          in      "
      "new_game     new_game"
      "apply        apply   "
    `}>
      <Flex gridArea="inactive">
        <InactivePlayers inactivePlayers={inactivePlayers} />
      </Flex>
      <PlayerList
        gridArea="current_game"
        title="Altes Feld"
        players={currentGame}
        showPointSum
        onPlayerClick={removePlayerFromGame}
        {...playerBlock}
      />
      <PlayerList
        gridArea="bench"
        title="Bank"
        players={benchPlayers}
        onPlayerClick={addPlayerFromBench}
        greyedOutPlayers={unselectablePlayerNumbers}
        {...playerBlock}
      />
      <PlayerList
        gridArea="out"
        title="Raus"
        players={playersOut}
        showPointSum
        onPlayerClick={readdPlayerToGame}
        {...playerBlock}
      />
      <PlayerList
        gridArea="in"
        title="Rein"
        players={playersIn}
        showPointSum
        onPlayerClick={readdPlayerToBench}
        {...playerBlock}
      />
      <Flex gridArea="new_game" height="100%" minHeight="0">
        <SelectedPlayers selectedPlayers={newGame} title="Neues Feld" removePlayer={handleRemovePlayerFromNewGame} newPlayerNumbers={playersInNumbers}/>
      </Flex>
      <Button gridArea="apply" colorScheme="teal" width="100%" disabled={!transitionIsValid} onClick={handleApplyGame}>
        {`${game?.title} Übernehmen`}
      </Button>
    </Grid>
  );
}

export const TransitionPage = memo(TransitionPageComponent)

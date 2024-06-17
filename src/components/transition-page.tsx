import { Button, Flex, Grid } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { playerBlock } from "../assets/styles";
import { Player, playerCanBeSelected, players, playersAreValidTeam } from "../contracts";
import { GameTransitionContext } from "../game-transition-context";
import { addPlayer, numberFromPLayer, playerFromNumber, sortByPoints, subtractPlayer } from "../tools";
import { Game } from "./picker-page";
import { PlayerList } from "./player-list";
import { SelectedPlayers } from "./selected-players/selected-players";

type Props = {
  game?: Game
}

export function TransitionPage(props: Props) {
  const {game} = props;

  const {applyTransition} = useContext(GameTransitionContext);

  const [playersIn, setPlayersIn] = useState<Array<Player>>([]);
  const [playersOut, setPlayersOut] = useState<Array<Player>>([]);

  const resetTransition = () => {
    setPlayersIn([]);
    setPlayersOut([]);
  };

  useEffect(() => {
    resetTransition();
  }, [game, resetTransition]);


  const removePlayerFromGame = (player: Player) => {
    setPlayersOut((playersOut) => {
      return sortByPoints(addPlayer(playersOut, player));
    });
  };

  const readdPlayerToGame = (player: Player) => {
    setPlayersOut((playersOut) => {
      return sortByPoints(subtractPlayer(playersOut, player));
    });
  };

  const addPlayerFromBench = (player: Player) => {
    setPlayersIn((playersIn) => {
      return sortByPoints(addPlayer(playersIn, player));
    });
  };

  const readdPlayerToBench = (player: Player) => {
    setPlayersIn((playersIn) => {
      return sortByPoints(subtractPlayer(playersIn, player));
    });
  };

  const playersInNumbers = new Set(playersIn.map(numberFromPLayer));
  const playersOutNumbers = new Set(playersOut.map(numberFromPLayer));

  const currentGame = sortByPoints(game?.selectedPlayerNumbers
    .filter((playerNumber) => {
      return !playersOutNumbers.has(playerNumber);
    })
    .map(playerFromNumber) ?? []);

  const newGame = [
    ...(currentGame as Array<Player>)?.filter((player) => {
      return !playersOutNumbers.has(player.number)
    }),
    ...playersIn,
  ];

  const handleApplyGame = () => {
    applyTransition?.(game?.id, newGame.map(numberFromPLayer))
    resetTransition();
  };

  const inactivePlayerNumbers = new Set(game?.inactivePlayerNumbers);
  const oldSelectedPlayersNumbers = new Set(game?.selectedPlayerNumbers);
  const benchPlayers = sortByPoints(players
    .filter((player) => {
      const playerIsInactive = inactivePlayerNumbers.has(player.number)
      const playerIsAlreadyInGame = oldSelectedPlayersNumbers.has(player.number)
      const PlayerIsAlreadySelected = playersInNumbers.has(player.number)
      return !playerIsInactive && !playerIsAlreadyInGame && !PlayerIsAlreadySelected;
    }));

  const unselectablePlayerNumbers = new Set(players
    .filter((player) => {
      return !playerCanBeSelected(newGame, player);
    })
    .map(numberFromPLayer))

  console.log('unselectable players', Array.from(unselectablePlayerNumbers))

  const transitionIsValid = playersAreValidTeam(newGame)

  const handleRemovePlayerFromNewGame = (player: Player) => {
    if (playersInNumbers.has(player.number)) {
      readdPlayerToBench(player);
    } else {
      removePlayerFromGame(player);
    }
  };

  return (
    <Grid height="100%" templateColumns={"1fr 1fr"} templateRows="3fr 2fr min-content min-content" gap="0.5rem" padding="0.5rem" templateAreas={`
      "current_game bench   "
      "out          in      "
      "new_game     new_game"
      "apply        apply   "
    `}>
      <PlayerList
        gridArea="current_game"
        title="Altes Feld"
        players={currentGame}
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
        showAsOld
        backgroundColor="red.50"
      />
      <PlayerList
        gridArea="in"
        title="Rein"
        players={playersIn}
        showPointSum
        onPlayerClick={readdPlayerToBench}
        {...playerBlock}
        showAsNew
        backgroundColor="green.50"
      />
      <Flex gridArea="new_game" height="100%" minHeight="0">
        <SelectedPlayers selectedPlayers={newGame} title="Neues Feld" removePlayer={handleRemovePlayerFromNewGame} newPlayerNumbers={playersInNumbers}/>
      </Flex>
      <Button gridArea="apply" colorScheme="teal" width="100%" isDisabled={!transitionIsValid} onClick={handleApplyGame}>
        {`${game?.title} Übernehmen`}
      </Button>
    </Grid>
  );
}

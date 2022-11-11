import { Player, playersByNumber } from "./contracts";

export function subtractPlayer(players: Array<Player>, playerToSubtract: Player): Array<Player> {
  return players.slice(0).filter((player) => {
    return playerToSubtract.number !== player.number
  });
}

export function addPlayer(players: Array<Player>, playerToAdd: Player): Array<Player> {
  return [...players, playerToAdd];
}

export function sortByPoints(players: Array<Player>): Array<Player> {
  return players.sort((player1, player2) => {
    return player2.totalPoints - player1.totalPoints;
  })
}

export function playerFromNumber(playerNumber: number): Player {
  return playersByNumber[playerNumber];
}

export function numberFromPLayer(player: Player): number {
  return player.number;
}

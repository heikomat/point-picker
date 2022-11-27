import { Bonus, bonusPoints } from "./bonuses";
import anna from '../assets/anna.webp';
import mike from '../assets/mike.webp';
import richard from '../assets/richard.webp';
import yannik from '../assets/yannik.webp';
import jana from '../assets/jana.webp';
import robin from '../assets/robin.webp';
import svenkuehne from '../assets/svenkuehne.webp';
import svenkaiser from '../assets/svenkaiser.webp';
import johannes from '../assets/johannes.webp';
import heiko from '../assets/heiko.webp';
import jakobus from '../assets/jakobus.webp';
import philippe from '../assets/philippe.webp';
import linda from '../assets/linda.webp';
import jill from '../assets/jill.webp';
import andre from '../assets/andre.webp';
import { numberFromPLayer } from "../tools";

export const maxBonusPoints = 2;

export type Player = {
  firstName: string;
  lastName: string;
  displayName: string;
  basePoints: number;
  totalPoints: number;
  bonuses: Array<Bonus>;
  isDisabled: boolean,
  number: number,
  image: string,
}

const calculateTotalPoints = (basePoints: number, bonuses: Array<Bonus>) => {
  let totalBonusPoints = 0;
  for (const bonus of bonuses) {
    totalBonusPoints += bonusPoints[bonus];
  }

  return basePoints - Math.min(totalBonusPoints, maxBonusPoints);
}

const getPointInfo = (basePoints: number, bonuses: Array<Bonus>): {
  basePoints: number;
  bonuses: Array<Bonus>;
  totalPoints: number;
} => {
  return {
    basePoints: basePoints,
    bonuses: bonuses,
    totalPoints: calculateTotalPoints(basePoints, bonuses),
  }
}

const getDisplayName = (firstName: string, lastName: string): string => {
  const shortenedLastName =  lastName
    .split(' ')
    .map((lastNamePart: string): string => {
      return lastNamePart.charAt(0) + '.'
    })
    .join(' ');

  return `${firstName} ${shortenedLastName}`;
}

const getName = (firstName: string, lastName: string): {
  firstName: string;
  lastName: string;
  displayName: string;
} => {
  return {
    firstName: firstName,
    lastName: lastName,
    displayName: getDisplayName(firstName, lastName)
  }
}

export const players: Array<Player> = [{
  isDisabled: true,
  number: 25,
  image: mike,
  ...getName('Mike', 'Lausberg'),
  ...getPointInfo(2.5, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 3,
  image: richard,
  ...getName('Richard', 'Smets'),
  ...getPointInfo(1, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 12,
  image: yannik,
  ...getName('Yannik', 'Parthier'),
  ...getPointInfo(2.5, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 4,
  image: jana,
  ...getName('Jana', 'Bartlick'),
  ...getPointInfo(3, [Bonus.Woman, Bonus.Beginner])
}, {
  isDisabled: true,
  number: 19,
  image: robin,
  ...getName('Robin', 'Croonenbroeck'),
  ...getPointInfo(2, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 26,
  image: svenkuehne,
  ...getName('Sven', 'Kühne'),
  ...getPointInfo(3, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 7,
  image: svenkaiser,
  ...getName('Sven', 'Kaiser'),
  ...getPointInfo(2.5, [Bonus.Beginner])
}, {
  isDisabled: true,
  number: 6,
  image: johannes,
  ...getName('Johannes', 'von Heereman'),
  ...getPointInfo(4, [])
}, {
  isDisabled: false,
  number: 21,
  image: heiko,
  ...getName('Heiko', 'Mathes'),
  ...getPointInfo(4.5, [])
}, {
  isDisabled: false,
  number: 15,
  image: jakobus,
  ...getName('Jakobus', 'von Lengerke'),
  ...getPointInfo(4.5, [])
}, {
  isDisabled: false,
  number: 11,
  image: philippe,
  ...getName('Philippe', 'von Parthier'),
  ...getPointInfo(4.5, [])
}, {
  isDisabled: false,
  number: 10,
  image: anna,
  ...getName('Anna', 'Bartlick'),
  ...getPointInfo(4.5, [Bonus.Woman])
}, {
  isDisabled: true,
  number: 9,
  image: linda,
  ...getName('Linda', 'Hövel'),
  ...getPointInfo(3, [Bonus.Woman, Bonus.Beginner])
}, {
  isDisabled: true,
  number: 8,
  image: jill,
  ...getName('Jill', 'Kaiser-Föhles'),
  ...getPointInfo(3, [Bonus.Woman])
}, {
  isDisabled: false,
  number: 22,
  image: andre,
  ...getName('André', 'Kostka'),
  ...getPointInfo(4.5, [])
},].sort((player1, player2) => {
  if (player1.displayName > player2.displayName) {
    return 1;
  }
  if (player1.displayName < player2.displayName) {
    return -1;
  }

  return 0;
})

export const playersByNumber: {[key: number]: Player} = {};
for (const player of players) {
  playersByNumber[player.number] = player;
}

// const maxNBs = 2;
const maxPlayerPoints = 14.5;

export const playersAreValidTeam = (players: Array<Player>): boolean => {
  if (players.length > 5) {
    return false;
  }
  if (players.length < 1) {
    return false;
  }

  const playerNumbers = players.map(numberFromPLayer);
  const teamHasDuplicates = playerNumbers.some((playerNumber, index) => {
    return playerNumbers.indexOf(playerNumber) !== index
  });
  if (teamHasDuplicates) {
    return false;
  }

  let totalPoints = 0;
  for (const player of players) {
    totalPoints += player.totalPoints;
  }

  if (totalPoints > maxPlayerPoints) {
    return false;
  }
  /*
  // max NB players on field - rule
  let amountOfNBPLayers = 0;
  for (const player of players) {
    if (player.isDisabled === false) {
      amountOfNBPLayers += 1;
    }
  }

  if (amountOfNBPLayers >= maxNBs) {
    return false;
  }
  */

  return true;
}

export const playerCanBeSelected = (selectedPlayers: Array<Player>, playerToSelect: Player): boolean => {

  if (!playersAreValidTeam([...selectedPlayers, playerToSelect])) {
    return false;
  }

  const alreadySelectedPlayer = selectedPlayers.find((selectedPlayer) => {
    return selectedPlayer.number === playerToSelect.number;
  });

  if (alreadySelectedPlayer !== undefined) {
    return false;
  }

  return true;
}

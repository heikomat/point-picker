import { Bonus, bonusPoints } from "./bonuses";
import anna from '../assets/anna.jpg';
import mike from '../assets/mike.jpg';
import richard from '../assets/richard.jpg';
import yannik from '../assets/yannik.jpg';
import jana from '../assets/jana.jpg';
import robin from '../assets/robin.jpg';
import svenkuehne from '../assets/svenkuehne.jpg';
import svenkaiser from '../assets/svenkaiser.jpg';
import johannes from '../assets/johannes.jpg';
import heiko from '../assets/heiko.jpg';
import jakobus from '../assets/jakobus.jpg';
import philippe from '../assets/philippe.jpg';
import linda from '../assets/linda.jpg';
import jill from '../assets/jill.jpg';

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
  ...getPointInfo(3, [Bonus.Beginner])
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
  ...getName('Anna', 'von Bartlick'),
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
  ...getPointInfo(3.5, [Bonus.Woman])
}].sort((player1, player2) => {
  if (player1.displayName > player2.displayName) {
    return 1;
  }
  if (player1.displayName < player2.displayName) {
    return -1;
  }

  return 0;
});

const maxNBs = 2;
const maxPlayerPoints = 14.5;

export const playerCanBeSelected = (selectedPlayers: Array<Player>, playerToSelect: Player): boolean => {

  if (selectedPlayers.length === 5) {
    return false;
  }

  const alreadySelectedPlayer = selectedPlayers.find((selectedPlayer) => {
    return selectedPlayer.number === playerToSelect.number;
  });

  let totalAlreadySelectedPlayerPoints = 0;
  for (const player of selectedPlayers) {
    totalAlreadySelectedPlayerPoints += player.totalPoints;
  }

  if (totalAlreadySelectedPlayerPoints + playerToSelect.totalPoints > maxPlayerPoints) {
    return false;
  }
  /*
  // max NB players on field - rule
  if (player.isDisabled === false) {
    let amountOfAlreadySelectedNBPLayers = 0;
    for (const selectedPlayer of selectedPlayers) {
      if (selectedPlayer.isDisabled === false) {
        amountOfAlreadySelectedNBPLayers += 1;
      }
    }

    if (amountOfAlreadySelectedNBPLayers >= maxNBs) {
      return selectedPlayers;
    }
  }
  */

  if (alreadySelectedPlayer !== undefined) {
    return false;
  }

  return true;
}

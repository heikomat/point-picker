export enum Bonus {
  Beginner = 'beginner',
  Woman = 'woman',
  Youth = 'youth',
};

export const bonusPoints = {
  [Bonus.Beginner]: 1,
  [Bonus.Woman]: 1.5,
  [Bonus.Youth]: 1,
}

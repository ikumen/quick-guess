export type Fn = (props?: any) => void;
export type FnWithCallback = (callback?: Fn) => void;

export const NoOp = (props?: any) => {};

/**
 * Returns a random number from 0 up to max, not inclusive
 * @param max random value range up to max, not inclusive
 * @returns 
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function shuffleArray(items: any[]) {
  for (let l=items.length, r:number; l > 0;) {
    r = getRandomInt(l--);
    const tmp = items[l];
    items[l] = items[r];
    items[r] = tmp;
  }
}


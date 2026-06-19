import { BoardGrid, TetrominoType, BOARD_WIDTH, BOARD_HEIGHT } from '../types';
import { TETROMINOES } from '../constants';

export const createEmptyGrid = (): BoardGrid =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ value: null, locked: false }))
  );

export const getRandomTetrominoType = (): TetrominoType => {
  const types = Object.values(TetrominoType);
  return types[Math.floor(Math.random() * types.length)];
};

export const checkCollision = (shape: number[][], x: number, y: number, currentGrid: BoardGrid, wrapAround: boolean = false): boolean => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        let newX = x + c;
        if (wrapAround) {
          while (newX < 0) newX += BOARD_WIDTH;
          while (newX >= BOARD_WIDTH) newX -= BOARD_WIDTH;
        }
        const newY = y + r;
        
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && currentGrid[newY][newX].locked)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

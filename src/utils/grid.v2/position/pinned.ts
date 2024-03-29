import {
  Dimensions,
  GridLayoutOptions,
  GridMatrix,
  Size,
} from '@/utils/grid.v2/types';
import { fillMatrix } from '@/utils/grid.v2/matrix';
import { placeItem } from '@/utils/grid.v2/position/autoPlace';
import { isDefined } from '@/utils/math';

export const setPinnedItemPosition = (
  matrix: GridMatrix,
  matrixSize: Size,
  pinnedItem: Dimensions,
  options: GridLayoutOptions
) => {
  // check for overflow
  if (
    pinnedItem.x + pinnedItem.width > matrixSize.width ||
    pinnedItem.y + pinnedItem.height > matrixSize.height
  ) {
    const autoPlacedPosition = placeItem(
      matrix,
      matrixSize,
      pinnedItem,
      options
    );
    console.log('overflow');
    if (isDefined(autoPlacedPosition)) {
      fillMatrix(
        matrix,
        matrixSize,
        autoPlacedPosition,
        options.marginX,
        options.marginY,
        true
      );
      return autoPlacedPosition;
    }
  }
  fillMatrix(
    matrix,
    matrixSize,
    pinnedItem,
    options.marginX,
    options.marginY,
    true
  );
  return pinnedItem;
};

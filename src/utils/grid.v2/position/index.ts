import {
  Dimensions,
  GridLayoutOptions,
  GridMatrix,
  NormalizedGridItem,
  Size,
} from '@/utils/grid.v2/types';
import { isDefined } from '@/utils/math';
import { setPinnedItemPosition } from '@/utils/grid.v2/position/pinned';
import { placeItem } from '@/utils/grid.v2/position/autoPlace';
import { fillMatrix } from '@/utils/grid.v2/matrix';
import { GridItemWithPosition } from '@/utils/grid';

const getItemPosition = (
  matrix: GridMatrix,
  matrixSize: Size,
  item: NormalizedGridItem,
  options: GridLayoutOptions
): Dimensions | undefined => {
  // first set all pinned item positions
  if (isDefined(item.x) && isDefined(item.y)) {
    return setPinnedItemPosition(
      matrix,
      matrixSize,
      item as Dimensions,
      options
    );
  }
  const autoPlacedPosition = placeItem(matrix, matrixSize, item, options);
  if (isDefined(autoPlacedPosition)) {
    fillMatrix(
      matrix,
      matrixSize,
      autoPlacedPosition,
      options.marginX,
      options.marginY
    );
    return autoPlacedPosition;
  }
  return undefined;
};

export const placeAllItems = (
  matrix: GridMatrix,
  matrixSize: Size,
  items: NormalizedGridItem[],
  options: GridLayoutOptions
): GridItemWithPosition[] => {
  return items
    .map((item) => {
      const position = getItemPosition(matrix, matrixSize, item, options);
      if (!position) return undefined;
      const isPinned = isDefined(item.x) || isDefined(item.y);
      return {
        ...position,
        id: item.id,
        isPinned,
        extraData: item.extraData,
      };
    })
    .filter((item) => isDefined(item)) as GridItemWithPosition[];
};

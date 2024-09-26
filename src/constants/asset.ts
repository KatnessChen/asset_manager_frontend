export const TRADABLE_ASSET_TYPE_IDS: number[] = [3, 4, 5, 6]; // Add or remove IDs as needed

export const isTradableAsset = (assetTypeId: number): boolean => {
  return TRADABLE_ASSET_TYPE_IDS.includes(assetTypeId);
};

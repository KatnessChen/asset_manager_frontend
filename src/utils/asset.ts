import useAssetStore from "store/asset_store";

export const getAssetTypeName = (assetTypeId: number): string | undefined => {
  const assetTypes = useAssetStore.getState().assetTypes;
  const assetType = assetTypes.find(
    (type) => type.asset_type_id === assetTypeId
  );
  return assetType?.name;
};

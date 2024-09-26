import { useEffect } from "react";
import useAssetStore from "store/asset_store";
import useUserStore from "store/user_store";
import AssetTypeList from "components/AssetType/AssetTypeList";

const Portfolio = () => {
  const { user, isLoading: isLoadingUser, error: errorUser } = useUserStore();
  const { fetchAssets, fetchAssetTypes } = useAssetStore();

  useEffect(() => {
    fetchAssetTypes();
  }, [fetchAssetTypes]);

  useEffect(() => {
    if (user && !isLoadingUser && !errorUser) fetchAssets();
  }, [user, isLoadingUser, errorUser, fetchAssets]);

  return (
    <div>
      <AssetTypeList />
    </div>
  );
};

export default Portfolio;

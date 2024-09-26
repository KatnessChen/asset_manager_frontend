import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { API_BASE_URL } from "../constants/api";
import { NewAssetRecord } from "./asset_record_store";
import useUserStore from "./user_store";

export type Asset = {
  asset_id: number;
  asset_type_id: number;
  name: string;
  asset_records: AssetRecord[];
};

export type AssetRecord = NewAssetRecord & {
  asset_name: string;
  value: number;
  asset_type_id: number;
};

export interface AssetType {
  asset_type_id: number;
  name: string;
  description: string;
}

interface AssetState {
  assets: Asset[];
  isLoadingAssets: boolean;
  errorAssets: string | null;
  assetRecords: AssetRecord[];
  fetchAssets: () => Promise<void>;
  addAsset: (asset: {
    user_id: number;
    asset_type_id: string;
    name: string;
  }) => void;
  deleteAsset: (asset_id: number) => void;
  updateAsset: (asset_id: number, updatedAsset: Partial<Asset>) => void;
  setAssetRecords: (assetRecords: AssetRecord[]) => void;

  assetTypes: AssetType[];
  isLoadingAssetTypes: boolean;
  errorAssetTypes: string | null;
  fetchAssetTypes: () => Promise<void>;
}

const useAssetStore = create<AssetState>()(
  devtools((set, get) => ({
    // Asset
    assets: [],
    isLoadingAssets: false,
    errorAssets: null,
    assetRecords: [],
    addAsset: async ({ user_id, asset_type_id, name }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            asset_type_id: Number(asset_type_id),
            name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add asset");
        }

        const newAsset = await response.json();
        set((state) => ({ assets: [...state.assets, newAsset] }));
      } catch (error) {
        console.error("Error adding asset:", error);
        // You might want to set an error state here
      }
    },
    deleteAsset: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete asset");
        }

        set((state) => ({
          assets: state.assets.filter((asset) => asset.asset_id !== id),
        }));
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    },
    updateAsset: (id, updatedAsset) =>
      set((state) => ({
        assets: state.assets.map((asset) =>
          asset.asset_id === id ? { ...asset, ...updatedAsset } : asset
        ),
      })),
    fetchAssets: async () => {
      set({ isLoadingAssets: true, errorAssets: null });
      try {
        const user_id = useUserStore.getState().user?.user_id;
        const response = await fetch(`${API_BASE_URL}/users/${user_id}/assets`);
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }
        const assets: Asset[] = await response.json();
        set({ assets, isLoadingAssets: false });

        const assetRecords: AssetRecord[] = [];
        assets.forEach((asset) => {
          asset.asset_records
            .sort(
              (a, b) =>
                new Date(b.record_date).getTime() -
                new Date(a.record_date).getTime()
            )
            .forEach((record, index) => {
              console.log(record);
              if (index === 0) {
                assetRecords.push({
                  ...record,
                  asset_name: asset.name,
                  value: record.unit_price * record.unit,
                  asset_type_id: asset.asset_type_id,
                });
              }
            });
        });

        set({ assetRecords });
      } catch (error: unknown) {
        set({
          errorAssets: "Error occurred while fetching assets",
          isLoadingAssets: false,
        });
      }
    },
    setAssetRecords: (assetRecords) => set({ assetRecords }),
    // Asset Type
    assetTypes: [],
    isLoadingAssetTypes: false,
    errorAssetTypes: null,
    fetchAssetTypes: async () => {
      set({ isLoadingAssetTypes: true, errorAssetTypes: null });
      try {
        const response = await fetch(`${API_BASE_URL}/asset-types`);
        if (!response.ok) {
          throw new Error("Failed to fetch asset types");
        }
        const assetTypes = await response.json();
        set({ assetTypes, isLoadingAssetTypes: false });
      } catch (error: unknown) {
        set({
          errorAssetTypes: "Error occurred while fetching asset types",
          isLoadingAssetTypes: false,
        });
      }
    },
  }))
);

export default useAssetStore;

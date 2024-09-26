import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { API_BASE_URL } from "../constants/api";

export type NewAssetRecord = {
  asset_id: number;
  unit: number;
  unit_cost: number;
  unit_price: number;
  notes: string;
  record_date: Date;
};

interface AssetRecordState {
  addAssetRecord: (
    record: NewAssetRecord,
    onSubmittedCallback: () => void
  ) => Promise<void>;
}

const useAssetRecordStore = create<AssetRecordState>()(
  devtools((set) => ({
    addAssetRecord: async (
      record: NewAssetRecord,
      onSubmittedCallback: () => void
    ) => {
      try {
        const response = await fetch(`${API_BASE_URL}/asset-records`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        });
        if (!response.ok) {
          throw new Error("Failed to add asset record");
        }
        await response.json();

        onSubmittedCallback();
      } catch (error: unknown) {
        // TODO: handle error
      }
    },
  }))
);

export default useAssetRecordStore;

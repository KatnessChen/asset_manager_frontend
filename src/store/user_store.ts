import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { API_BASE_URL } from "../constants/api";

type TUser = {
  user_id: number;
  user_name: string;
  email: string;
};

interface UserState {
  isLoading: boolean;
  error: string | null;
  user: TUser | null;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    isLoading: false,
    error: null,
    user: null,
    fetchUser: async () => {
      set({ isLoading: true, error: null });
      try {
        const userId = localStorage.getItem("user_id");
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const user: TUser = await response.json();
        set({ isLoading: false, user });
      } catch (error: unknown) {
        set({ error: "Error occurred, please try again.", isLoading: false });
      }
    },
  }))
);

export default useUserStore;

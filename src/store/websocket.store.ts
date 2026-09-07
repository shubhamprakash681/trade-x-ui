import { create } from "zustand";

export type WebSocketStatus = "disconnected" | "connecting" | "connected" | "error";

interface WebSocketState {
  status: WebSocketStatus;
  setStatus: (status: WebSocketStatus) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
}));

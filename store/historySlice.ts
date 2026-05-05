
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderData } from '../types';

interface HistoryState {
  orders: OrderData[];
  isOpen: boolean;
}

const loadHistory = (): OrderData[] => {
  try {
    const saved = localStorage.getItem('hakimi_order_history');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState: HistoryState = {
  orders: loadHistory(),
  isOpen: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<OrderData>) => {
      state.orders = [action.payload, ...state.orders];
      localStorage.setItem('hakimi_order_history', JSON.stringify(state.orders));
    },
    toggleHistory: (state) => {
      state.isOpen = !state.isOpen;
    },
    setHistoryOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearHistory: (state) => {
      state.orders = [];
      localStorage.removeItem('hakimi_order_history');
    }
  },
});

export const { addOrder, toggleHistory, setHistoryOpen, clearHistory } = historySlice.actions;
export default historySlice.reducer;

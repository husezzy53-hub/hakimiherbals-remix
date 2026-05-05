
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types';
import { fetchProductsFromSheet } from '../services/googleSheets';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: true,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await fetchProductsFromSheet();
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productsSlice.reducer;

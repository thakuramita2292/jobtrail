import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from "../api/application"

export const loadApplications = createAsyncThunk(
  'applications/load',
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchApplications();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load applications');
    }
  }
);

export const removeApplication = createAsyncThunk(
  'applications/remove',
  async (id) => {
    await api.deleteApplication(id);
    return id;
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    filters: {
      search: '',
      status: '',
      sort: 'appliedDate_desc',
      page: 1,
      limit: 5
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeApplication.fulfilled, (state, action) => {
        state.list = state.list.filter((app) => app.id !== action.payload);
      });
  },
});

export const { setFilters } = applicationsSlice.actions;
export default applicationsSlice.reducer;
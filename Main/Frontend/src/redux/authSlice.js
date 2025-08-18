import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load initial state from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  loading: false,
  error: null,
};

export const LoginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const RegisterUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API_URL + '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// New async thunk to update user's chief
export const updateUserChief = createAsyncThunk(
  'auth/updateUserChief',
  async (chiefId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentUserId = state.auth.user.id;
      const token = state.auth.token;

      // Make API call to update chief on the backend if necessary,
      // though this thunk primarily updates the Redux state.
      // Assuming the backend's updateChief endpoint is called separately.
      // This thunk is for updating the Redux state after a successful backend update.

      // Return the updated user object with the new chiefId
      const updatedUser = { ...state.auth.user, chief: chiefId };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle successful registration, e.g., show a success message
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // New case for updating user's chief
      .addCase(updateUserChief.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // action.payload is the updated user object
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { HOST_API } from '../../config';
import axios from 'axios';
import { get } from 'lodash';

import { HOST_API } from '@/config';
const name = 'smtp';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();

function createInitialState() {
  return {
    isLoading: false,
    error: null,
    smtpData: {
      hostAddress: 'www.google.com',
      username: 'prtk@test',
      password: 'lolm123',
      port: 465,
      secure: 'TLS',
      enabled: false,
    },
  };
}

const slice = createSlice({
  name: 'smtp',
  initialState,
  extraReducers,
});

// For Actions
function getSmtpDetails() {
  return createAsyncThunk(`${name}/getSmtpData`, async () => {
    try {
      const response = await axios.get(HOST_API.concat(`/credentials/single?type=MAIL&title=SMTP`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      console.log(response);
      return response.data;
     
    } catch (err) {
      return err;
    }
  });
}

function updateSmtpDetails() {
  return createAsyncThunk(`${name}/updateSmtpData`, async (updatedSmtpData) => {
    console.log(updatedSmtpData,"updatedSmtpData");

    try {
      const response = await axios.put(HOST_API.concat('/credentials/single?type=MAIL&title=SMTP'),updatedSmtpData,{
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err.response.data;
    }
  });
}

function createExtraActions() {
  return {
    getSmtpDetails: getSmtpDetails(),
    updateSmtpData: updateSmtpDetails(),
  };
}

export default slice.reducer;
export const SMTPActions = { ...slice.actions, ...extraActions };

// For Reducers
function createExtraReducers() {
  function getSmtpDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.getSmtpDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {
        console.log(action,"action");
        state.isLoading = false;
        state.smtpData = action?.payload?.data?.credentials?.variables;
        
      },
      [rejected]: (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }

  function updateSmtpDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.updateSmtpData;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {
        console.log(action);
        state.isLoading = false;
        // state.smtpData = action?.payload?.data || state.smptData;
        getSmtpDataReducer();
      },
      [rejected]: (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }

  return {
    ...getSmtpDataReducer(),
    ...updateSmtpDataReducer(),
  };
}

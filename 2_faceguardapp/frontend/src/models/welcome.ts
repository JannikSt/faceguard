import { Effect } from 'umi';
import React from 'react';

export enum ApiStates {
  TEST_MODEL = "Find Existing Person",
  UPLOAD_NEW_FOTO = "Add New Person",
}

export interface StateType {
  Mode: undefined | ApiStates;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setMode: Effect;

  };
  reducers: {
    setModeReducer: Reducer<StateType>;
  };
}

export const LandingModel: ModelType = {
  namespace: 'selectMode',
  state: {
   Mode: undefined,
  },
  effects: {
    *setMode({ payload }, { put }) {
      yield put({
        type: 'setModeReducer',
        payload,
      });
    },
  },
  reducers: {
    setModeReducer(state, action) {
      switch (action.payload) {
        case ApiStates.TEST_MODEL:
          return {
            ...state,
            Mode: ApiStates.TEST_MODEL,
          };
        case ApiStates.UPLOAD_NEW_FOTO:
          return {
            ...state,
            Mode: ApiStates.UPLOAD_NEW_FOTO,
          };
        default:
          return state;
      }
    },
  },
};

export default LandingModel;

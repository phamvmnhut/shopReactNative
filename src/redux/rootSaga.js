//Saga effects
import {put, takeLatest, fork} from 'redux-saga/effects';

import AsyncStorage from '@react-native-community/async-storage';

import {host} from '../Api/hostname';

function* getdataInit() {
  const response = yield fetch(host, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: '',
  });
  const dataInit = yield response.status === 200 ? response.json() : {};
  return dataInit;
}

//Saga effects
function* fetchDatainit() {
  try {
    const receivedData = yield getdataInit();
    yield console.log('dataInit : fetch Data');
    yield put({type: 'FETCH_SUCCEEDED', receivedData: receivedData});
  } catch (error) {
    yield put({type: 'FETCH_FAILED', error});
  }
}
function* watchFetchDataInit() {
  yield takeLatest('INIT_DATA', fetchDatainit);
}

function* getCart() {
  try {
    const value = yield AsyncStorage.getItem('@cart');
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {
    // Error retrieving data
    console.log('Err in getCart: ', error);
    return [];
  }
}
function* getCartStorage() {
  try {
    const receivedData = yield getCart();
    yield console.log('CartInit : get Storage');
    yield put({
      type: 'CART_IMPORT_STORAGE_SUCCEED',
      receivedData: receivedData,
    });
  } catch (error) {
    yield put({type: 'CART_IMPORT_STORAGE_FAIL', error});
  }
}
function* watchCartStorage() {
  yield takeLatest('CART_STORAGE_GET', getCartStorage);
}

export default function* rootSaga() {
  yield fork(watchFetchDataInit);
  yield fork(watchCartStorage);
}

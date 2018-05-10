import {
  RECEIVE_REGISTER, REQUEST_REGISTER, RESET_REGISTER, SET_ADDRESS, SET_CITY,
  SET_EMAIL, SET_FIRST_NAME, SET_LAST_NAME, SET_PASSWORD, SET_PASSWORD_REPEAT,
  SET_PHONE,
  SET_ZIP_CODE
} from './register.actions';

export const getDefaultState = () => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordRepeat: '',
  address: '',
  city: '',
  zipCode: '',
  phone: '',
  pending: false,
  response: null
});

export const register = (state = getDefaultState(), action) => {
  switch (action.type) {
    case REQUEST_REGISTER:
      return {...state, pending: true, response: null};
    case RECEIVE_REGISTER:
      return {...state, pending: false, response: action.response};
    case RESET_REGISTER:
      return getDefaultState();
    case SET_FIRST_NAME:
      return {...state, firstName: action.firstName};
    case SET_LAST_NAME:
      return {...state, lastName: action.lastName};
    case SET_EMAIL:
      return {...state, email: action.email};
    case SET_PASSWORD:
      return {...state, password: action.password};
    case SET_PASSWORD_REPEAT:
      return {...state, passwordRepeat: action.passwordRepeat};
    case SET_ADDRESS:
      return {...state, address: action.address};
    case SET_CITY:
      return {...state, city: action.city};
    case SET_ZIP_CODE:
      return {...state, zipCode: action.zipCode};
    case SET_PHONE:
      return {...state, phone: action.phone};
    default:
      return state;
  }
};
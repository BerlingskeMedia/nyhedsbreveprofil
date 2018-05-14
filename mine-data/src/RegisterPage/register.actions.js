export const REQUEST_REGISTER = '[register] request';
export const RECEIVE_REGISTER = '[register] receive';
export const RESET_REGISTER = '[register] reset';
export const SET_FIRST_NAME = '[register] set first name';
export const SET_LAST_NAME = '[register] set last name';
export const SET_EMAIL = '[register] set email';
export const SET_PASSWORD = '[register] set password';
export const SET_PASSWORD_REPEAT = '[register] set password repeat';
export const SET_ADDRESS = '[register] set address';
export const SET_CITY = '[register] set city';
export const SET_ZIP_CODE = '[register] set zip code';
export const SET_PHONE = '[register] set phone';

export const requestRegister = () => ({type: REQUEST_REGISTER});
export const receiveRegister = (response) => ({type: RECEIVE_REGISTER, response});
export const resetRegister = () => ({type: RESET_REGISTER});
export const setFirstName = (firstName) => ({type: SET_FIRST_NAME, firstName});
export const setLastName = (lastName) => ({type: SET_LAST_NAME, lastName});
export const setEmail = (email) => ({type: SET_EMAIL, email});
export const setPassword = (password) => ({type: SET_PASSWORD, password});
export const setPasswordRepeat = (passwordRepeat) => ({type: SET_PASSWORD_REPEAT, passwordRepeat});
export const setAddress = (address) => ({type: SET_ADDRESS, address});
export const setCity = (city) => ({type: SET_CITY, city});
export const setZipCode = (zipCode) => ({type: SET_ZIP_CODE, zipCode});
export const setPhone = (phone) => ({type: SET_PHONE, phone});

export const register = ({firstName, lastName, email, password, passwordRepeat, address, zipCode, city, phone}) => {
  return (dispatch) => {
    dispatch(requestRegister());

    if ([firstName, lastName, email, password, passwordRepeat, address, zipCode, city, phone].some(item => !item || !item.trim())) {
     return Promise.reject({errorDetails: 'All fields are required'});
    }

    if (password !== passwordRepeat) {
      return Promise.reject({errorDetails: 'Passwords must be the same'})
    }

    return new Promise((fulfill, reject) => {
      gigya.accounts.initRegistration({
        callback: (initResponse) => {
          if (!initResponse.errorCode) {
            const regToken = initResponse.regToken;

            gigya.accounts.register({
              email,
              password,
              regToken,
              finalizeRegistration: true,
              data: {
                terms: true
              },
              profile: {
                firstName,
                lastName,
                address,
                city,
                zip: zipCode,
                phones: [{type: 'mobile', number: phone}]
              },
              callback: (response) => {
                if (response.errorCode) {
                  reject(response);
                } else {
                  fulfill(response);
                }
              }
            });
          } else {
            reject(initResponse);
          }
        }
      });
    });
  }
};
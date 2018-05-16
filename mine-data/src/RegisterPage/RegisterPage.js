import React from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  receiveRegister,
  register, resetRegister,
  setAddress, setCity, setEmail, setFirstName, setLastName, setPassword,
  setPasswordRepeat,
  setPhone, setZipCode
} from './register.actions';
import { logOut } from '../logout/logOut.actions';
import { FormInput } from '../Form/FormInput';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.setAddress = this.setAddress.bind(this);
    this.setCity = this.setCity.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setPasswordRepeat = this.setPasswordRepeat.bind(this);
    this.setZipCode = this.setZipCode.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillUnmount() {
    this.props.resetRegister();
  }

  setAddress(e) {
    this.props.setAddress(e.target.value);
  }

  setCity(e) {
    this.props.setCity(e.target.value);
  }

  setEmail(e) {
    this.props.setEmail(e.target.value);
  }

  setFirstName(e) {
    this.props.setFirstName(e.target.value);
  }

  setLastName(e) {
    this.props.setLastName(e.target.value);
  }

  setPhone(e) {
    this.props.setPhone(e.target.value);
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  setPasswordRepeat(e) {
    this.props.setPasswordRepeat(e.target.value);
  }

  setZipCode(e) {
    this.props.setZipCode(e.target.value);
  }

  submit(e) {
    e.preventDefault();
    this.props.submit({
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      password: this.props.password,
      passwordRepeat: this.props.passwordRepeat,
      address: this.props.address,
      zipCode: this.props.zipCode,
      city: this.props.city,
      phone: this.props.phone
    })
      .then(() => {
        this.props.logout();
        this.props.history.push('/mine-data');
      })
      .catch(response => {
        this.props.receiveRegister(response);
      });
  }

  render() {
    const {
      pending, firstName, lastName, email, password, passwordRepeat, address,
      zipCode, city, phone, response
    } = this.props;

    return (
      <form className="form" onSubmit={this.submit} autoComplete="off">
        <div className="row justify-content-center">
          <div className="col-sm-9">
            <div className="form-group">For at vi kan behandle din anmodning har vi behov for nogle basale oplysninger om dig. Indtast dem venligst i nedenstående felter og klik på “Registrer”. Herefter bliver du sendt tilbage til login siden, hvor du skal logge på med din nye Berlingske Media konto.</div>
            <div className="form-group">Vi kan kun give dig indsigt baseret på de oplysninger du giver os i forbindelse med oprettelsen af din konto. Derfor er det vigtigt at du angiver tilstrækkelig oplysninger til at vi kan give dig den fornødne indsigt.</div>
            <div className="form-group"><strong>Berlingske Media forbeholder sig ret til at foretage nødvendig kontrol af de anførte oplysninger for at sikre at data ikke bliver udleveret til de forkerte.</strong></div>
          </div>
        </div>
        <FormInput name="email" type="email" label="E-mail" value={email}
                   onChange={this.setEmail} pending={pending}/>
        <FormInput name="password" type="password" label="Kodeord"
                   value={password} onChange={this.setPassword}
                   pending={pending}/>
        <FormInput name="password-repeat" label="Gentag kodeord"
                   type="password" value={passwordRepeat}
                   onChange={this.setPasswordRepeat} pending={pending}/>
        <FormInput name="firstName" label="Fornavn" value={firstName}
                   onChange={this.setFirstName} pending={pending}/>
        <FormInput name="lastName" label="Efternavn" value={lastName}
                   onChange={this.setLastName} pending={pending}/>
        <FormInput name="address" label="Adresse" value={address}
                   onChange={this.setAddress} pending={pending}/>
        <FormInput name="zipCode" label="Post nr." value={zipCode}
                   onChange={this.setZipCode} pending={pending}/>
        <FormInput name="city" label="By" value={city}
                   onChange={this.setCity} pending={pending}/>
        <FormInput name="phone" label="Telefon" value={phone}
                   onChange={this.setPhone} pending={pending}/>
        <div className="row justify-content-center">
          <div className="col-sm-6 nav-buttons">
            <Link to="/mine-data">Tilbage til login</Link>
            <SubmitButton loading={pending}>Opret</SubmitButton>
          </div>
        </div>
        {response ? <div className="row ">
          <div className="offset-sm-3 col-sm-6 form-error mb-1">{response.errorDetails}</div>
          {response.validationErrors ? response.validationErrors.map(error => (
            <div key={error.message} className="offset-sm-3 col-sm-6 form-error">{error.message}</div>
          )) : null}
        </div> : null}
      </form>
    );
  }
}

const mapStateToProps = ({register: {firstName, lastName, email, password, passwordRepeat, address, zipCode, city, phone, pending, response}}) => ({
  firstName,
  lastName,
  email,
  password,
  passwordRepeat,
  address,
  zipCode,
  city,
  phone,
  pending,
  response
});

const mapDispatchToProps = (dispatch) => ({
  setFirstName: (firstName) => dispatch(setFirstName(firstName)),
  setLastName: (lastName) => dispatch(setLastName(lastName)),
  setEmail: (email) => dispatch(setEmail(email)),
  setPassword: (password) => dispatch(setPassword(password)),
  setPasswordRepeat: (passwordRepeat) => dispatch(setPasswordRepeat(passwordRepeat)),
  setAddress: (address) => dispatch(setAddress(address)),
  setCity: (city) => dispatch(setCity(city)),
  setZipCode: (zipCode) => dispatch(setZipCode(zipCode)),
  setPhone: (phone) => dispatch(setPhone(phone)),
  submit: (payload) => dispatch(register(payload)),
  receiveRegister: (response) => dispatch(receiveRegister(response)),
  resetRegister: () => dispatch(resetRegister()),
  logout: () => dispatch(logOut())
});

export const RegisterPage = connect(mapStateToProps, mapDispatchToProps)(Register);
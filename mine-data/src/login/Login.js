import React from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

export const Login = () => (
  <div className="container">
    <div className="row justify-content-center">
      <h3>Login</h3>
    </div>
    <div className="row justify-content-center">
      <div className="col-sm-4">
        <FormGroup>
          <Label for="email">email</Label>
          <Input type="email" id="email" name="email" />
        </FormGroup>
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="col-sm-4">
        <FormGroup>
          <Label>password</Label>
          <Input type="password" id="password" name="password" />
        </FormGroup>
      </div>
    </div>
    <div className="row justify-content-center">
      <Button>Login</Button>
    </div>
  </div>
);
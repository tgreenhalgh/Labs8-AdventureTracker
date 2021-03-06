import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { device } from '../lib/device';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { FacebookIcon } from './styles/SVGs';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';
import {
  Form,
  FormLabel,
  FormHeader,
  FormBox,
  FormGroup,
  FormFieldset,
  FormTitle
} from './styles/FormStyles';
import { PrimaryBtn } from './styles/ButtonStyles';
import { FacebookBtn } from './styles/LinkBtnStyles';
import { PrimaryLinkBtn } from './styles/PrimaryLinkBtn';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

library.add(faFacebookSquare);

const Facebook = styled(LoginButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => (props.height ? props.height : '6rem')};
  width: ${props => (props.width ? props.width : '18rem')};
  border: none;
  border-radius: 10px;
  color: ${props => props.theme.white};
  background: ${props => props.theme.orange};
  cursor: pointer;
  font-size: 3rem;
  width: 100%;
  background-color: ${props => props.theme.blue};
  @media ${device.tablet} {
    font-size: 2.5rem;
    margin-bottom: 0;
  }
`;

const LoginBtn = styled(PrimaryBtn)`
  margin: 0 0 3rem auto;
  @media ${device.tablet} {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;
const SignupInsteadBtn = styled(PrimaryLinkBtn)`
  width: 100%;
  @media ${device.tablet} {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;
const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
      facebookUser
    }
  }
`;

class Signin extends Component {
  state = {
    password: '',
    email: ''
  };

  componentDidMount() {
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  handleResponse = data => {
    // console.log(data.profile);
    localStorage.setItem('id', data.profile.id);
    localStorage.setItem('name', data.profile.first_name);
    localStorage.setItem('email', data.profile.email);
    localStorage.setItem('signup', false);
    Router.push({
      pathname: '/facebooklogin'
    });
  };

  handleError = error => {
    this.setState({ error });
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({ email: '', password: '' });
              Router.push({
                pathname: '/triplist'
              });
            }}
          >
            <FormHeader height={'10rem'}>Adventure Tracker</FormHeader>
            <FormFieldset disabled={loading} aria-busy={loading}>
              <FormTitle>Login</FormTitle>
              <Error error={error} />
              <FormGroup>
                <FormLabel htmlFor="email" width={'8rem'}>
                  Email
                </FormLabel>
                <FormBox
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  id="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="password" width={'10rem'}>
                  Password
                </FormLabel>
                <FormBox
                  type="password"
                  name="password"
                  placeholder="Enter
                  Password"
                  id="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </FormGroup>
              <LoginBtn type="submit">Login</LoginBtn>
              <FacebookBtn>
                <FacebookProvider appId="2047335438690331">
                  <div
                    className="fb-login-button"
                    data-max-rows="1"
                    data-size="large"
                    data-button-type="continue_with"
                    data-show-faces="false"
                    data-auto-logout-link="true"
                    data-use-continue-as="false"
                  >
                    <div id="fb-root" />
                    <Facebook
                      scope="email"
                      onCompleted={this.handleResponse}
                      onError={this.handleError}
                    >
                      <FacebookIcon length={40} />
                      &nbsp; Facebook Login
                    </Facebook>
                  </div>
                </FacebookProvider>
              </FacebookBtn>
              <SignupInsteadBtn href="/sign-up">Sign-Up instead?</SignupInsteadBtn>
            </FormFieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;

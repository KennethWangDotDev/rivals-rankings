import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

const ErrorMessage = ({ message }) => <Container>{message}</Container>;
ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

export default ErrorMessage;

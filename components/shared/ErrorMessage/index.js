// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

const ErrorMessage = ({ message }: { message: string }) => <Container>{message}</Container>;
ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

export default ErrorMessage;

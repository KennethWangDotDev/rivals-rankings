// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

const TrueContainer = ({ children }: { children: React.Node }) => <Container>{children}</Container>;
TrueContainer.propTypes = {
    children: PropTypes.node.isRequired
};

export default TrueContainer;

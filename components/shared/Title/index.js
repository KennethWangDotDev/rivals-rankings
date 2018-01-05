import React from 'react';
import PropType from 'prop-types';
import { Title } from './styles';

const TrueTitle = ({ children }) => <Title>{children}</Title>;
TrueTitle.propTypes = {
    children: PropType.node.isRequired
};

export default TrueTitle;

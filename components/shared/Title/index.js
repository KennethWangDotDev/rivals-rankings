// @flow

import * as React from 'react';
import PropType from 'prop-types';
import { Title } from './styles';

const TrueTitle = ({ children }: { children: React.Node }) => <Title>{children}</Title>;
TrueTitle.propTypes = {
    children: PropType.node.isRequired
};

export default TrueTitle;

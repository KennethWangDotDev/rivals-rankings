import React from 'react';
import PropTypes from 'prop-types';
import { injectGlobal } from 'styled-components';
import { typography, reset } from '../components/theme';
import Header from '../components/shared/NavBar';
import Footer from '../components/shared/Footer';

// eslint-disable-next-line
injectGlobal`
    ${reset}
    ${typography.fontsDeclaration}
    ${typography.fontsDisplaySettings}
`;

const layout = ({ children }) => (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
);

layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default layout;

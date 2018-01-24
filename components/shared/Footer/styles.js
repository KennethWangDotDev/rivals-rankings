// @flow

import styled from 'styled-components';
import { typography } from '../../theme';

const Footer = styled.footer`
    width: 100%;
    display: block;
    border-top: 1px solid #e0e0e0;
    background-color: #e6e6e6;
    padding: 1rem;
`;

const Text = styled.p`
    ${typography.size('small')};
    color: #9e9e9e;
    text-align: center;
`;

export { Footer, Text };

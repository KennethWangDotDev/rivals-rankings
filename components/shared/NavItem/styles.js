// @flow

import styled, { css } from 'styled-components';
import { typography, colors } from '../../theme';
import { media } from '../../utils';

// prettier-ignore
const ListItem = styled.li`
    display: inline-block;
    vertical-align: middle;
    margin-right: 1.7rem;
    &:last-child {
        margin-right: 0;
    }

    ${media.medium(`
        display: none;
    `)};

    ${props => props.active && css`
        display: block!important;
        text-align: center;
        margin-right: 0;
        border-top: 1px solid ${colors.grey[400]};
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;

        &:last-child {
            border-bottom: 1px solid ${colors.grey[400]};
        }
    `};
`;

// prettier-ignore
const Link = styled.a`
    ${typography.size('p')};
    font-weight: 300;
    color: ${colors.body};
    vertical-align: middle;
    width: 100%;

    ${props => props.active && css`
        display: block;
    `};
`;

export { ListItem, Link };

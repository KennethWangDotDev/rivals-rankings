// @flow

import styled from 'styled-components';
import { typography, colors } from '../../theme';
import { depth } from '../../utils';

const PlayerCard = styled.div`
    ${depth(3)};
    border: 1px solid ${colors.grey[400]};
    padding: 3rem;
    background-color: ${colors.grey[50]};
`;

const Subtitle = styled.h1`
    ${typography.margin('bottom', 1)};
    ${typography.size('h5')};
    text-transform: uppercase;
    letter-spacing: -0.1rem;
    color: ${colors.grey[400]};
    border-bottom: 1px solid ${colors.grey[300]};
`;

const BasicInfoContainer = styled.table`
    ${typography.margin('bottom', 1.25)};
`;

const BasicInfoEntry = styled.tr`
    &:first-child td {
        border-top: none;
    }
`;

const BasicInfoQuestion = styled.td`
    border-top: 1px solid ${colors.grey[200]};
    padding: 0.5rem;
    text-align: right;
    width: 12rem;
    padding-right: 1.5rem;
    color: ${colors.grey[500]};
    text-transform: uppercase;
`;

const BasicInfoAnswer = styled.td`
    border-top: 1px solid ${colors.grey[200]};
    text-align: left;
    width: auto;
    padding: 0.5rem;
`;

export {
    PlayerCard,
    Subtitle,
    BasicInfoContainer,
    BasicInfoEntry,
    BasicInfoQuestion,
    BasicInfoAnswer
};

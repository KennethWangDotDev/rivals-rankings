import styled, { css } from 'styled-components';
import { typography, colors } from '../../theme';
import { depth } from '../../utils';

// prettier-ignore
const RankingsTable = styled.table`
    width: 100%;
    ${depth(5)}
`;

// prettier-ignore
const TableHeader = styled.tr`
    background-color: ${colors.body};
`;

// prettier-ignore
const Label = styled.td`
    color: white;
    ${typography.size('h5')}
    ${typography.useTitleFont}
    text-align: center;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
`;

const Entry = styled.tr`
    background-color: #f7f7f7;
    &:nth-child(even) {
        background-color: white;
    }
    &:nth-child(odd) {
        background-color: #f9f2fa;
    }

    border: 2px solid transparent;
    transition: all 0.1s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.01);
        z-index: 1000;
        box-shadow: -3px -4px 12px rgba(0, 0, 0, 0.19), 3px 6px 9px rgba(0, 0, 0, 0.23);
    }
`;

// prettier-ignore
const Data = styled.td`
    ${typography.size('p')}
    color: black;
    text-align: center;
    padding-top: 1rem;
    padding-bottom: 1rem;

    ${props => props.bold && css`
        font-weight: 800;
    `}

    ${props => props.red && css`
        color: ${colors.red[800]};
    `}

    ${props => props.green && css`
        color: ${colors.green[800]};
    `}
`;

const LinkBlock = styled.a`
    display: block;
`;

export { RankingsTable, TableHeader, Label, Entry, Data, LinkBlock };

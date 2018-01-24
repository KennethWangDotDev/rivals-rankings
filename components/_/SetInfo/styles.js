// @flow

import styled, { css } from 'styled-components';
import { typography, colors } from '../../theme';
import { smartUnderline } from '../../utils';

const Container = styled.div`
    ${typography.margin('bottom', 1)};
    ${typography.padding('bottom', 1)};
    background-color: ${colors.grey[300]};
    padding: 1.25rem;
    position: relative;
`;

const Tournament = styled.h1`
    ${typography.size('p')};
    text-transform: uppercase;
    color: ${colors.grey[700]};
    width: 100%;
`;

const Date = styled.h6`
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    ${typography.size('small')};
    text-transform: uppercase;
    color: ${colors.grey[700]};
`;

const Label = styled.h6`
    ${typography.size('small')};
    text-transform: uppercase;
    color: ${colors.grey[700]};
`;

const Row = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr;
    padding: 1rem;
`;

// prettier-ignore
const PlayerContainer = styled.div`
    display: inline-block;
    min-width: 10rem;
    ${props => props.right && css`
        text-align: right;
    `}
    ${props => props.left && css`
        text-align: left;
    `}
`;

// prettier-ignore
const Player = styled.h2`
    display: block;
    color: ${colors.grey[800]};
    ${typography.size('h5')};
    color: ${colors.red[700]};

    ${props => props.winner && css`
        color: ${colors.green[700]};
    `}
`;

const Ratings = styled.h3`
    display: inline;
    ${typography.size('p')};
    color: ${colors.grey[600]};
`;

const RatingsChange = styled.h4`
    display: inline;
    ${typography.size('p')};
    color: ${colors.grey[600]};
`;

const VS = styled.h2`
    color: ${colors.grey[800]};
    ${typography.size('h5')};
    vertical-align: middle;
    text-align: center;
`;

const Score = styled.h3`
    color: ${colors.grey[600]};
    ${typography.size('p')};
    vertical-align: middle;
    text-align: center;
`;

const Toggle = styled.button`
    color: ${colors.grey[700]};
    ${typography.size('p')};
    vertical-align: middle;
    text-align: center;
    padding-top: 1rem;
    background-color: inherit;
    outline: none;
    border: none;

    p {
        display: inline;
        ${smartUnderline(colors.grey[300], colors.grey[400], '2px', '93%')};
        cursor: pointer;
    }
`;

const MoreInfo = styled.div`
    background-color: ${colors.grey[400]};
    padding: 1rem;
`;

const InfoHeadData = styled.td`
    text-transform: uppercase;
    color: ${colors.grey[700]};
    text-align: center;
`;

const InfoData = styled.td`
    color: ${colors.grey[600]};
    text-align: center;
`;

export {
    Container,
    Tournament,
    Date,
    Label,
    Row,
    PlayerContainer,
    Player,
    Ratings,
    RatingsChange,
    VS,
    Score,
    Toggle,
    MoreInfo,
    InfoHeadData,
    InfoData
};

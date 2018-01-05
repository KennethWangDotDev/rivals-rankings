import styled from 'styled-components';
import { typography, colors } from '../../theme';
import { media } from '../../utils';

const ContainerOne = styled.section`
    width: 100%;
    height: 39rem;
    position: relative;
    background-image: url('/static/images/splash2.png');
    background-size: cover;
    background-position: left top;
    color: white;
    padding-left: 15%;

    ${media.large(`
        padding-left: 10%;
        background-position: 35% 0%;
    `)};

    ${media.medium(`
        padding-left: 5%;
        background-position: 50% 0%;
        height: 35rem;
    `)};

    ${media.small(`
        padding-left: 0rem;
        height: 30rem;
    `)};
`;

const TextContainerOne = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-width: 35rem;
    padding: 2.5rem;
    background-color: rgba(0, 0, 0, 0.45);
    display: inline-block;

    ${media.medium(`
        padding: 1.5rem;
    `)};

    ${media.small(`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        width: 100%;
    `)};
`;

// prettier-ignore
const Title = styled.h1`
    ${typography.size('h1')}
    ${typography.useTitleFont}
    ${typography.margin('bottom', 0.5)}
    line-height: 1;
`;

// prettier-ignore
const Desc = styled.p`
    ${typography.size('h6')}
    line-height: 1.25;
    font-weight: 300;
`;

const ContainerTwo = styled.section`
    width: 100%;
    height: 39rem;
    position: relative;
    background-color: #f7f7f7;
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const BrainImage = styled.div`
    background-image: url('/static/images/neural.jpg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    margin: 2rem;
    margin-right: 0;
`;

const TextContainerTwo = styled.div`
    align-self: center;
    max-width: 30rem;
`;

const ContainerThree = styled.div`
    width: 100%;
    height: 30rem;
    position: relative;
`;

const TextContainerThree = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;

// prettier-ignore
const CTAButton = styled.div`
    ${typography.useTitleFont}
    ${typography.size('h4')}
    ${typography.margin('top', 1.5)}
    color: white;
    outline: none;
    background: ${colors.theme[400]};
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    cursor: pointer;
    padding: 1rem 6rem;
    text-rendering: optimizeLegibility;
    display: inline-block;

    &:hover {
        background: ${colors.theme[300]};
    }

    &:active {
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-top: 1px solid rgba(0, 0, 0, 0.3);
    }
`;

export {
    ContainerOne,
    TextContainerOne,
    ContainerTwo,
    TextContainerTwo,
    BrainImage,
    ContainerThree,
    TextContainerThree,
    CTAButton,
    Title,
    Desc
};

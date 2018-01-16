import styled, { css } from 'styled-components';
import { colors } from '../../theme';
import { media } from '../../utils';

const Container = styled.div`
    background-color: ${colors.grey[200]};
`;

// prettier-ignore
const Navigation = styled.nav`
    padding-top: 1.25rem;
    padding-bottom: 1rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    max-width: 80rem;
    width: 100%;
    margin: auto;

    ${props => props.mobile && css`
        display: none;
    `};

    ${props => props.active && css`
        display: block!important;
        padding-top: 0;
        padding-bottom: 0;
    `};
`;

const Logo = styled.img`
    height: 2rem;
    width: auto;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    bottom: 0.3rem;
`;

// prettier-ignore
const NavItemContainer = styled.ul`
    float: right;
    display: inline-block;
    vertical-align: middle;

    ${props => props.mobile && css`
        float: initial;
        display: block;
        width: 100%;
    `};
`;

const HamburgerIcon = styled.ul`
    display: block;
    width: 26px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    border-radius: 3px;
    background-color: ${colors.purple[800]};
`;

const NavToggle = styled.button`
    display: none;
    background-color: inherit;
    border: none;
    outline: none;

    ${media.medium(`
        margin-right: 1.5rem;
        display: inline-block;
    `)};
`;

export { Container, Navigation, Logo, NavItemContainer, NavToggle, HamburgerIcon };

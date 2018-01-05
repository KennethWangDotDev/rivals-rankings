import styled from 'styled-components';
import { colors } from '../../theme';
import { media } from '../../utils';

const Container = styled.div`
    background-color: ${colors.grey[200]};
`;

const Navigation = styled.nav`
    padding-top: 1.25rem;
    padding-bottom: 1rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    max-width: 80rem;
    width: 100%;
    margin: auto;
`;

const Logo = styled.img`
    height: 2rem;
    width: auto;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    bottom: 0.3rem;
`;

const NavItemContainer = styled.ul`
    float: right;
    display: inline-block;
    vertical-align: middle;
`;

export { Container, Navigation, Logo, NavItemContainer };

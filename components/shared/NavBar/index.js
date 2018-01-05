import React from 'react';
import NavItem from '../NavItem';
import { Container, Navigation, Logo, NavItemContainer } from './styles';

const navItemsList = [
    { label: 'Home', url: '/' },
    { label: 'Rankings', url: '/rankings' },
    { label: 'Tournaments', url: '/tournaments' },
    { label: 'About', url: '/about' }
];

export default () => (
    <Container>
        <Navigation>
            <Logo src="/static/images/logo.png" />
            <NavItemContainer>
                {navItemsList.map(item => <NavItem url={item.url} label={item.label} />)}
            </NavItemContainer>
        </Navigation>
    </Container>
);

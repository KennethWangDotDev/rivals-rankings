import React from 'react';
import NavItem from '../NavItem';
import { Container, Navigation, Logo, NavItemContainer, NavToggle, HamburgerIcon } from './styles';

const navItemsList = [
    { label: 'Home', url: '/' },
    { label: 'Rankings', url: '/rankings' },
    // { label: 'Tournaments', url: '/tournaments' },
    { label: 'About', url: '/about' }
];

class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            navCollapsed: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            navCollapsed: !this.state.navCollapsed
        });
    }

    render() {
        return (
            <Container>
                <Navigation>
                    <Logo src="/static/images/logo.png" />
                    <NavItemContainer>
                        {navItemsList.map(item => (
                            <NavItem active={false} url={item.url} label={item.label} />
                        ))}
                        <NavToggle onClick={() => this.handleClick()}>
                            <HamburgerIcon />
                            <HamburgerIcon />
                            <HamburgerIcon />
                        </NavToggle>
                    </NavItemContainer>
                </Navigation>
                <Navigation mobile active={this.state.navCollapsed}>
                    <NavItemContainer mobile>
                        {navItemsList.map(item => (
                            <NavItem
                                active={this.state.navCollapsed}
                                url={item.url}
                                label={item.label}
                            />
                        ))}
                    </NavItemContainer>
                </Navigation>
            </Container>
        );
    }
}

export default NavBar;

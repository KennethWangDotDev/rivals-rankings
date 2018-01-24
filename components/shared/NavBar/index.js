// @flow

import * as React from 'react';
import NavItem from '../NavItem';
import { Container, Navigation, Logo, NavItemContainer, NavToggle, HamburgerIcon } from './styles';

const navItemsList = [
    { label: 'Home', url: '/' },
    { label: 'Rankings', url: '/rankings' },
    // { label: 'Tournaments', url: '/tournaments' },
    { label: 'About', url: '/about' }
];

type Props = {};
type State = {
    navCollapsed: boolean
};

class NavBar extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            navCollapsed: false
        };
    }

    handleClick = () => {
        this.setState({
            navCollapsed: !this.state.navCollapsed
        });
    };

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

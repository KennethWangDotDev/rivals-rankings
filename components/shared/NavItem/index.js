import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Link } from './styles';

const NavItem = ({ url, label }) => (
    <ListItem>
        <Link href={url}>{label}</Link>
    </ListItem>
);
NavItem.propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default NavItem;

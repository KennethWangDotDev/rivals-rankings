import styled from 'styled-components';
import { typography, colors } from '../../theme';
import { media } from '../../utils';

const ListItem = styled.li`
    display: inline-block;
    vertical-align: middle;
    margin-right: 1.7rem;
    &:last-child {
        margin-right: 0;
    }
`;

// prettier-ignore
const Link = styled.a`
    ${typography.size('p')}
    font-weight: 300;
    color: ${colors.body};
    vertical-align: middle;
`;

export { ListItem, Link };

import styled from 'styled-components';
import { typography } from '../../theme';

// prettier-ignore
const Title = styled.h1`
    ${typography.useTitleFont}
    ${typography.size('h1')}
    ${typography.margin('bottom', 1)}
    width: 100%;
    display: block;
`;

export { Title };

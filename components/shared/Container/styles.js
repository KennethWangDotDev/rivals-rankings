import styled from 'styled-components';
import { typography } from '../../theme';

const Container = styled.div`
    max-width: 60rem;
    margin: auto;
    ${typography.margin('top', 1)};
    ${typography.margin('bottom', 1)};
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`;

export { Container };

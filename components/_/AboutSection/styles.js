// @flow

import styled from 'styled-components';
import { typography, colors } from '../../theme';
import { smartUnderline } from '../../utils';

const Title = styled.h2`
    ${typography.size('h2')};
    ${typography.useTitleFont};
    ${typography.margin('bottom', 0.5)};
`;

const Paragraph = styled.p`
    ${typography.size('p')};
    ${typography.margin('bottom', 1)};
    max-width: 50rem;

    a {
        ${smartUnderline(colors.grey[50], colors.purple[400], '1px', '93%')};
    }
`;

export { Title, Paragraph };

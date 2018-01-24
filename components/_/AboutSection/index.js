// @flow

import * as React from 'react';
import PropType from 'prop-types';
import { Title, Paragraph } from './styles';

const AboutSection = ({ children, title }: { children: React.Node, title: string }) => (
    <div>
        <Title>{title}</Title>
        <Paragraph>{children}</Paragraph>
    </div>
);

AboutSection.propTypes = {
    children: PropType.node.isRequired,
    title: PropType.string.isRequired
};

export default AboutSection;

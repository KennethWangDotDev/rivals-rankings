// @flow

import * as React from 'react';
import {
    ContainerOne,
    TextContainerOne,
    ContainerTwo,
    TextContainerTwo,
    BrainImage,
    ContainerThree,
    TextContainerThree,
    CTAButton,
    Title,
    Desc
} from './styles';

export default () => (
    <div>
        <ContainerOne>
            <TextContainerOne>
                <Title>Advanced Ranking System</Title>
                <Desc>
                    Rivals Rankings is a comprehensive ranking system for Rivals of Aether that
                    features player profiles, match histories, and match statistics.
                </Desc>
            </TextContainerOne>
        </ContainerOne>

        <ContainerTwo>
            <BrainImage />
            <TextContainerTwo>
                <Title>TrueSkill Ratings</Title>
                <Desc>
                    We use a modern implementation of Microsoft&apos;s TrueSkill algorithm, which
                    provides an accurate approximation of a player&apos;s skill level.
                </Desc>
            </TextContainerTwo>
        </ContainerTwo>

        <ContainerThree>
            <TextContainerThree center>
                <Title center>Explore The Rankings</Title>
                <Desc center>
                    See how players rank in each region as well as in all of North America.
                </Desc>
                <a href="/rankings">
                    <CTAButton>View Rankings</CTAButton>
                </a>
            </TextContainerThree>
        </ContainerThree>
    </div>
);

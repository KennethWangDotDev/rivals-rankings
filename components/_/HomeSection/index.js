import React from 'react';
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
                <CTAButton>View Rankings</CTAButton>
            </TextContainerThree>
        </ContainerThree>
    </div>
);

/*
<section class="home__trueskill">
        <div class="image">
            <img src="/images/neural.jpg" />
        </div>
        <div class="text">
        <h1 class="title">TrueSkill Ratings</h1>
        <p class="desc">We use a modern implementation of Microsoft's TrueSkill algorithm, which provides an accurate approximation of player's skill level.</p>
        </div>
    </section>
    <section class="home__action">
        <h1 class="title">Explore The Rankings</h1>
        <p class="desc">See how players rank in each region as well as in all of North America.</p>
        <div class="button-container"><a href="/rankings/national/"><button>View Rankings</button></a></div>
    </section>
    */

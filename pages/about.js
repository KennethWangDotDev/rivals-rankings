import React from 'react';
import Main from '../lib/layout';
import Container from '../components/shared/Container';
import AboutSection from '../components/_/AboutSection';
import withData from '../lib/apollo';

export default withData(props => (
    <Main pathname={props.url.pathname}>
        <Container>
            <AboutSection title="What is Rivals Rankings?">
                Rivals Rankings is a comprehensive power rankings system that ranks players based on
                their wins and losses using the TrueSkill formula. Rivals Rankings also includes
                many powerful features, such as player profiles, match histories, and match
                statistics.
            </AboutSection>
            <AboutSection title="About TrueSkill">
                <a href="https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/">
                    TrueSkill
                </a>{' '}
                is an advanced skill ranking system developed at Microsoft Research. The purpose of
                a ranking system is to both identify and track the skills of gamers in a game (mode)
                in order to be able to match them into competitive matches.<br />
                <br />The biggest difference between TrueSkill and other ranking systems is that in
                the TrueSkill ranking system, skill is characterized by two numbers. The first
                number: the average skill of the gamer, and the second number: the degree of
                uncertainty in the gamer's skill. The ranking system maintains a belief in every
                gamer’s skill using these two numbers.<br />
                <br />If the uncertainty is still high, the ranking system does not yet know exactly
                the skill of the gamer. In contrast, if the uncertainty is small, the ranking system
                has a strong belief that the skill of the gamer is close to the average skill.
            </AboutSection>
            <AboutSection title="About This Website">
                Rivals Rankings is developed, designed, and maintained by{' '}
                <a href="http://kendevdesigns.com">Kenneth</a>. The website was developed with{' '}
                <a href="https://reactjs.org/">React</a> on the frontend, and{' '}
                <a href="http://graphql.org/">GraphQL</a> as the backend data engine. It uses the{' '}
                <a href="https://github.com/zeit/next.js/">Next.js</a> framework and takes full
                advantage of its features for rapid prototyping.
            </AboutSection>
        </Container>
    </Main>
));

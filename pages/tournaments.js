import React from 'react';
import Main from '../lib/layout';
import Title from '../components/shared/Title';
import TournamentList from '../components/_/TournamentList';
import withData from '../lib/apollo';

export default withData(props => (
    <Main pathname={props.url.pathname}>
        <Title>Tournaments</Title>
        <TournamentList />
    </Main>
));

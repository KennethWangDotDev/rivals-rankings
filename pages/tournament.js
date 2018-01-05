import React from 'react';
import Main from '../lib/layout';
import TournamentInfo from '../components/_/TournamentInfo';
import withData from '../lib/apollo';

export default withData(({ url: { query: { id } } }) => (
    <Main>
        <TournamentInfo id={id} />
    </Main>
));

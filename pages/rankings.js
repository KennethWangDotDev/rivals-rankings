// @flow

import * as React from 'react';
import Main from '../lib/layout';
import Title from '../components/shared/Title';
import Container from '../components/shared/Container';
import PlayerRankingsTable from '../components/_/PlayerRankingsTable';
import withData from '../lib/apollo';

export default withData(props => (
    <Main pathname={props.url.pathname}>
        <Container>
            <Title>Rankings</Title>
            <PlayerRankingsTable />
        </Container>
    </Main>
));

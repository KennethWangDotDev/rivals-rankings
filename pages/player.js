import React from 'react';
import Main from '../lib/layout';
import PlayerInfo from '../components/_/PlayerInfo';
import withData from '../lib/apollo';

export default withData(({ url: { query: { id } } }) => {
    if (!id) {
        return (
            <Main>
                <p>No ID provided</p>
            </Main>
        );
    }
    return (
        <Main>
            <PlayerInfo id={id} />
        </Main>
    );
});

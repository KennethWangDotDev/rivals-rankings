// @flow

import * as React from 'react';
import { graphql } from 'react-apollo';
import type { OperationComponent } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../shared/ErrorMessage';

import type { TournamentQuery, TournamentQueryVariables } from '../graphql-types.js.flow';

// eslint-disable-next-line react/prop-types
function TournamentInfo({ data: { loading, error, Tournament } }) {
    if (error) return <ErrorMessage message="Error loading posts." />;
    if (loading) return <p>Loading...</p>;
    if (Tournament) {
        return (
            <div>
                <p>{Tournament.name}</p>
            </div>
        );
    }
    if (!loading && !Tournament) return <ErrorMessage message="Tournament does not exist." />;
}

const query = gql`
    query Tournament($id: ID!) {
        Tournament(id: $id) {
            id
            name
            url
        }
    }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (TournamentList)
const withTournament: OperationComponent<TournamentQuery, TournamentQueryVariables> = graphql(
    query,
    {
        options: ({ id }) => ({ variables: { id } })
    }
);
export default withTournament(TournamentInfo);

// @flow

import * as React from 'react';
import { graphql } from 'react-apollo';
import type { OperationComponent } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../shared/ErrorMessage';

import type { allTournamentsQuery as AllTournamentsQuery } from '../graphql-types.js.flow';

// eslint-disable-next-line react/prop-types
function TournamentList({ data: { loading, error, allTournaments } }) {
    if (error) return <ErrorMessage message="Error loading posts." />;
    if (loading) return <p>Loading...</p>;
    if (allTournaments && allTournaments.length) {
        return (
            <div>
                {allTournaments.map((tournament, index) => (
                    <li key={tournament.id}>
                        <p>{index + 1}. </p>
                        <a href={tournament.url}>{tournament.name}</a>
                    </li>
                ))}
            </div>
        );
    }
    return <div>Loading...</div>;
}

const allTournaments = gql`
    query allTournaments {
        allTournaments {
            id
            name
            url
        }
    }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (TournamentList)
export const withAllTournaments: OperationComponent<AllTournamentsQuery> = graphql(
    allTournaments,
    {}
);
export default withAllTournaments(TournamentList);

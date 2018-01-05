import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../shared/ErrorMessage';

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
export default graphql(query, {
    options: ({ id }) => ({ variables: { id } })
})(TournamentInfo);

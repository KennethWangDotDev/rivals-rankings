import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../shared/ErrorMessage';
import { RankingsTable, TableHeader, Label, Entry, Data, LinkBlock } from './styles';

const DataWithLink = props => (
    <Data {...props}>
        <LinkBlock href={`/player?id=${props.id}`}>{props.children}</LinkBlock>
    </Data>
);

DataWithLink.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

// eslint-disable-next-line react/prop-types
function PlayerRankingsTable({ data: { loading, error, allPlayers } }) {
    if (error) return <ErrorMessage message="Error loading posts." />;
    if (loading) return <p>Loading...</p>;
    if (allPlayers && allPlayers.length) {
        return (
            <div>
                <RankingsTable>
                    <TableHeader>
                        <Label>Rank</Label>
                        <Label>Name</Label>
                        <Label>Wins</Label>
                        <Label>Losses</Label>
                        <Label>Win Percent</Label>
                        <Label>Rating</Label>
                    </TableHeader>
                    {allPlayers.map((player, index) => (
                        <Entry key={player.id}>
                            <DataWithLink id={player.id}>{index + 1}</DataWithLink>
                            <DataWithLink id={player.id} bold>
                                {player.name}
                            </DataWithLink>
                            <DataWithLink id={player.id} green>
                                {player._wonSetsMeta.count}
                            </DataWithLink>
                            <DataWithLink id={player.id} red>
                                {player._lostSetsMeta.count}
                            </DataWithLink>
                            <DataWithLink id={player.id}>
                                {Math.round(player._wonSetsMeta.count /
                                        (player._wonSetsMeta.count + player._lostSetsMeta.count) *
                                        1000) / 10}%
                            </DataWithLink>
                            <DataWithLink id={player.id}>{player.ratings}</DataWithLink>
                        </Entry>
                    ))}
                </RankingsTable>
            </div>
        );
    }
    return <div>Loading...</div>;
}

const allPlayersQuery = gql`
    query allPlayers {
        allPlayers(orderBy: ratings_DESC, filter: { lostSets_some: { winnerScore_gte: 0 } }) {
            id
            name
            ratings
            _wonSetsMeta {
                count
            }
            _lostSetsMeta {
                count
            }
        }
    }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (TournamentList)
export default graphql(allPlayersQuery, {})(PlayerRankingsTable);

// @flow

import * as React from 'react';
import { graphql } from 'react-apollo';
import type { OperationComponent } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../shared/ErrorMessage';
import Container from '../../shared/Container';
import Title from '../../shared/Title';
import SetInfo from '../SetInfo';
import {
    PlayerCard,
    Subtitle,
    BasicInfoContainer,
    BasicInfoEntry,
    BasicInfoQuestion,
    BasicInfoAnswer
} from './styles';

import type { PlayerQuery, PlayerQueryVariables } from '../graphql-types.js.flow';

function setSort(a: { date: string }, b: { date: string }): -1 | 0 | 1 {
    if (new Date(a.date) < new Date(b.date)) {
        return 1;
    }
    if (new Date(a.date) > new Date(b.date)) {
        return -1;
    }
    return 0;
}

type ParsedMatch = {
    winner: ?{
        id: string,
        teamName: ?string,
        name: string
    },
    winnerCharacter: ?string,
    loser: ?{
        id: string,
        teamName: ?string,
        name: string
    },
    loserCharacter: ?string,
    gameNumber: ?number
};

type ParsedSet = {
    bracketGroupLabel: ?string,
    bracketGroupSmashId: ?string,
    bracketLabel: ?string,
    bracketSmashId: ?string,
    date: ?string,
    id: string,
    matches: ?Array<ParsedMatch>,
    opponent: ?string,
    opponentId: ?string,
    opponentRatings: ?number,
    opponentRatingsChange: ?number,
    opponentScore: ?number,
    didWin: boolean,
    player: ?string,
    playerRatings: ?string,
    playerRatingsChange: ?string,
    playerScore: ?string,
    tournament: ?string,
    tournamentUrl: ?string
};

// eslint-disable-next-line react/prop-types
function PlayerInfo({ data: { loading, error, Player } }) {
    if (error) return <ErrorMessage message="Error loading posts." />;
    if (loading) return <p>Loading...</p>;
    if (Player) {
        const combinedSet: ParsedSet[] = [];
        for (const set of Player.wonSets) {
            const parsedSet = {};
            parsedSet.id = set.id;
            parsedSet.player = set.winner.name;
            parsedSet.opponent = set.loser.name;
            parsedSet.opponentId = set.loser.id;
            parsedSet.playerRatings = set.ratingsWinnerOld;
            parsedSet.playerRatingsChange = set.ratingsChangeWinner;
            parsedSet.opponentRatings = set.ratingsLoserOld;
            parsedSet.opponentRatingsChange = set.ratingsChangeLoser;
            parsedSet.playerScore = set.winnerScore;
            parsedSet.opponentScore = set.loserScore;
            parsedSet.didWin = true;
            parsedSet.date = set.date;
            parsedSet.tournament = set.bracket.bracketGroup.tournament.name;
            parsedSet.tournamentUrl = set.bracket.bracketGroup.tournament.url;
            parsedSet.matches = set.matches;
            parsedSet.bracketLabel = set.bracket.label;
            parsedSet.bracketSmashId = set.bracket.smashId;
            parsedSet.bracketGroupLabel = set.bracket.bracketGroup.label;
            parsedSet.bracketGroupSmashId = set.bracket.bracketGroup.smashId;
            combinedSet.push(parsedSet);
        }
        for (const set of Player.lostSets) {
            const parsedSet = {};
            parsedSet.player = set.loser.name;
            parsedSet.opponent = set.winner.name;
            parsedSet.opponentId = set.winner.id;
            parsedSet.playerRatings = set.ratingsLoserOld;
            parsedSet.playerRatingsChange = set.ratingsChangeLoser;
            parsedSet.opponentRatings = set.ratingsWinnerOld;
            parsedSet.opponentRatingsChange = set.ratingsChangeWinner;
            parsedSet.playerScore = set.loserScore;
            parsedSet.opponentScore = set.winnerScore;
            parsedSet.didWin = false;
            parsedSet.date = set.date;
            parsedSet.tournament = set.bracket.bracketGroup.tournament.name;
            parsedSet.tournamentUrl = set.bracket.bracketGroup.tournament.url;
            parsedSet.matches = set.matches;
            parsedSet.bracketLabel = set.bracket.label;
            parsedSet.bracketSmashId = set.bracket.smashId;
            parsedSet.bracketGroupLabel = set.bracket.bracketGroup.label;
            parsedSet.bracketGroupSmashId = set.bracket.bracketGroup.smashId;
            combinedSet.push(parsedSet);
        }
        combinedSet.sort(setSort);

        return (
            <Container>
                <PlayerCard>
                    <Subtitle>Player Profile</Subtitle>
                    <Title>
                        {Player.teamName ? <span>{Player.teamName} | </span> : null}
                        {Player.name}
                    </Title>
                    <BasicInfoContainer>
                        {Player.teamName ? (
                            <BasicInfoEntry>
                                <BasicInfoQuestion>Team:</BasicInfoQuestion>
                                <BasicInfoAnswer>{Player.teamName}</BasicInfoAnswer>
                            </BasicInfoEntry>
                        ) : null}
                        <BasicInfoEntry>
                            <BasicInfoQuestion>Username:</BasicInfoQuestion>
                            <BasicInfoAnswer>{Player.name}</BasicInfoAnswer>
                        </BasicInfoEntry>
                        {Player.country ? (
                            <BasicInfoEntry>
                                <BasicInfoQuestion>Country:</BasicInfoQuestion>
                                <BasicInfoAnswer>{Player.country}</BasicInfoAnswer>
                            </BasicInfoEntry>
                        ) : null}
                        {Player.state ? (
                            <BasicInfoEntry>
                                <BasicInfoQuestion>State:</BasicInfoQuestion>
                                <BasicInfoAnswer>{Player.state}</BasicInfoAnswer>
                            </BasicInfoEntry>
                        ) : null}
                        <BasicInfoEntry>
                            <BasicInfoQuestion>Rating:</BasicInfoQuestion>
                            <BasicInfoAnswer>{Player.ratings}</BasicInfoAnswer>
                        </BasicInfoEntry>
                        <BasicInfoEntry>
                            <BasicInfoQuestion>Wins:</BasicInfoQuestion>
                            <BasicInfoAnswer>{Player.wonSets.length}</BasicInfoAnswer>
                        </BasicInfoEntry>
                        <BasicInfoEntry>
                            <BasicInfoQuestion>Losses:</BasicInfoQuestion>
                            <BasicInfoAnswer>{Player.lostSets.length}</BasicInfoAnswer>
                        </BasicInfoEntry>
                        <BasicInfoEntry>
                            <BasicInfoQuestion>Win Percent:</BasicInfoQuestion>
                            <BasicInfoAnswer>
                                {Math.round(
                                    Player.wonSets.length /
                                        (Player.lostSets.length + Player.wonSets.length) *
                                        1000
                                ) / 10}%
                            </BasicInfoAnswer>
                        </BasicInfoEntry>
                    </BasicInfoContainer>

                    <Subtitle>Match History</Subtitle>
                    {combinedSet.map((set, _index) => <SetInfo set={set} key={set.id} />)}
                </PlayerCard>
            </Container>
        );
    }
    if (!loading && !Player) return <ErrorMessage message="Tournament does not exist." />;
}

const query = gql`
    query Player($id: ID!) {
        Player(id: $id) {
            id
            teamName
            name
            ratings
            state
            country
            wonSets {
                id
                smashId
                date
                winnerScore
                loserScore
                ratingsChangeWinner
                ratingsWinnerOld
                ratingsChangeLoser
                ratingsLoserOld
                loser {
                    id
                    teamName
                    name
                }
                winner {
                    id
                    teamName
                    name
                }
                matches {
                    winner {
                        id
                        teamName
                        name
                    }
                    winnerCharacter
                    loser {
                        id
                        teamName
                        name
                    }
                    loserCharacter
                    gameNumber
                }
                bracket {
                    id
                    smashId
                    label
                    bracketGroup {
                        id
                        smashId
                        label
                        tournament {
                            name
                            smashId
                            url
                            circuit {
                                id
                            }
                            id
                        }
                    }
                }
            }
            lostSets {
                id
                smashId
                date
                winnerScore
                loserScore
                ratingsChangeWinner
                ratingsWinnerOld
                ratingsChangeLoser
                ratingsLoserOld
                winner {
                    id
                    teamName
                    name
                }
                loser {
                    id
                    teamName
                    name
                }
                matches {
                    winner {
                        id
                        teamName
                        name
                    }
                    winnerCharacter
                    loser {
                        id
                        teamName
                        name
                    }
                    loserCharacter
                    gameNumber
                }
                bracket {
                    id
                    smashId
                    label
                    bracketGroup {
                        id
                        smashId
                        label
                        tournament {
                            url
                            name
                            smashId
                            circuit {
                                id
                            }
                            id
                        }
                    }
                }
            }
        }
    }
`;

export type { ParsedSet, ParsedMatch };

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (TournamentList)
const withPlayerInfo: OperationComponent<PlayerQuery, PlayerQueryVariables> = graphql(query, {
    options: ({ id }) => ({ variables: { id } })
});
export default withPlayerInfo(PlayerInfo);

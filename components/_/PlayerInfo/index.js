import React from 'react';
import { graphql } from 'react-apollo';
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

function setSort(a, b) {
    if (new Date(a.date) < new Date(b.date)) {
        return 1;
    }
    if (new Date(a.date) > new Date(b.date)) {
        return -1;
    }
    return 0;
}

// eslint-disable-next-line react/prop-types
function PlayerInfo({ data: { loading, error, Player } }) {
    if (error) return <ErrorMessage message="Error loading posts." />;
    if (loading) return <p>Loading...</p>;
    if (Player) {
        const combinedSet = [];
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
                                {Math.round(Player.wonSets.length /
                                        (Player.lostSets.length + Player.wonSets.length) *
                                        1000) / 10}%
                            </BasicInfoAnswer>
                        </BasicInfoEntry>
                    </BasicInfoContainer>

                    <Subtitle>Match History</Subtitle>
                    {combinedSet.map((set, index) => <SetInfo set={set} key={set.id} />)}
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

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (TournamentList)
export default graphql(query, {
    options: ({ id }) => ({ variables: { id } })
})(PlayerInfo);

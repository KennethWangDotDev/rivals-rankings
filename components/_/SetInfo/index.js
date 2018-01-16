import React from 'react';
import PropTypes from 'prop-types';
import ToggleDisplay from 'react-toggle-display';
import Moment from 'moment';
import {
    Container,
    Tournament,
    Date,
    Label,
    Row,
    PlayerContainer,
    Player,
    Ratings,
    RatingsChange,
    VS,
    Score,
    Toggle,
    MoreInfo,
    InfoHeadData,
    InfoData
} from './styles';

class Set extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            show: !this.state.show
        });
    }

    render() {
        const { set } = this.props;
        return (
            <Container>
                <Date>{Moment(set.date).fromNow()}</Date>
                <Tournament>{set.tournament}</Tournament>
                <Label>{set.bracketGroupLabel}</Label>
                <Row>
                    <PlayerContainer right>
                        <Player winner={set.playerRatingsChange > -1}>{set.player}</Player>
                        <Ratings>{set.playerRatings}</Ratings>
                        <RatingsChange>
                            {' '}
                            ({set.playerRatingsChange > -1 ? '+' : null}
                            {set.playerRatingsChange})
                        </RatingsChange>
                    </PlayerContainer>
                    <VS>
                        VS
                        <Score>
                            {set.playerScore}
                            {' - '}
                            {set.opponentScore}
                        </Score>
                    </VS>
                    <PlayerContainer left>
                        <Player winner={set.playerRatingsChange < -1}>
                            <a href={`/player?id=${set.opponentId}`}>{set.opponent}</a>
                        </Player>
                        <Ratings>{set.opponentRatings}</Ratings>
                        <RatingsChange>
                            {' '}
                            ({set.opponentRatingsChange > -1 ? '+' : null}
                            {set.opponentRatingsChange})
                        </RatingsChange>
                    </PlayerContainer>
                    <Toggle onClick={() => this.handleClick()}>
                        <p>More Info</p>
                    </Toggle>
                </Row>
                <ToggleDisplay show={this.state.show}>
                    <MoreInfo>
                        <table>
                            {set.matches.length <= 0 ? (
                                'No additional info available.'
                            ) : (
                                <tr>
                                    <InfoHeadData>Game Number</InfoHeadData>
                                    <InfoHeadData>Winner</InfoHeadData>
                                    <InfoHeadData>Character</InfoHeadData>
                                    <InfoHeadData>Loser</InfoHeadData>
                                    <InfoHeadData>Character</InfoHeadData>
                                </tr>
                            )}
                            {set.matches.map((match, index) => (
                                <tr>
                                    <InfoData>{match.gameNumber}</InfoData>
                                    <InfoData>{match.winner.name}</InfoData>
                                    <InfoData>
                                        {!match.winnerCharacter ? '-' : null}
                                        {match.winnerCharacter}
                                    </InfoData>
                                    <InfoData>{match.loser.name}</InfoData>
                                    <InfoData>
                                        {!match.loserCharacter ? '-' : null}
                                        {match.loserCharacter}
                                    </InfoData>
                                </tr>
                            ))}
                        </table>
                    </MoreInfo>
                </ToggleDisplay>
            </Container>
        );
    }
}

export default Set;

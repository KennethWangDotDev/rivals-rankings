# rivals-rankings

[Rivals Rankings](http://rivalsrankings.com/) is a comprehensive power ranking system for Rivals of Aether. It is developed with [React](https://reactjs.org/) + [Apollo Client](https://www.apollographql.com/client/) on the frontend, and [GraphQL](http://graphql.org/) as the backend data engine. It uses the [Next.js](https://github.com/zeit/next.js/) framework and takes full advantage of its features for rapid prototyping. Player rating is calculuated using [TrueSkill](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/).

## Features

![alt text](https://i.imgur.com/ii6kMhB.png "Rivals Rankings Leaderboard")

![alt text](https://imgur.com/kRT3mIi.png "Rivals Rankings Player Profile")

Rivals Rankings features:

* Leaderboard with statistics on number of wins, losses, win rates, and rating
* Profile for each player that contains the player's team and location
* Match history with rating history
* In-depth information on each match of sets
  * Match number
  * Winner of each match
  * Characters chosen each match

## Installation

To launch app:
```
npm install
npm run start
```

To run import script:
```
npm install
npm run import-data
```

## How It Works

Rivals Rankings fetches and stores tournament data from [smash.gg](https://smash.gg/) (tournament hosting service). A list of tournaments to fetch with basic metadata information is located at `/scripts/import-data/tournaments.json`. The import script `/scripts/import-data/index.js` parses the [smash.gg API](https://help.smash.gg/hc/en-us/articles/217471947-API-Access) and stores all relevant information in the backend [Graphcool](https://www.graph.cool/) database. The Rivals Rankings frontend app then parses the database with GraphQL using Apollo Client.

## License

Rivals Rankings is MIT licensed.

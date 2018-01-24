// @flow

import { withData } from 'next-apollo';
import { HttpLink } from 'apollo-link-http';

const config = {
    link: new HttpLink({
        uri: 'https://api.graph.cool/simple/v1/cjayp5fez0muk01079d7kgknr', // Server URL (must be absolute)
        opts: {
            credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
        }
    })
};

export default withData(config);

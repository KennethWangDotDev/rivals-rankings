// @flow

import { breakpoints } from '../theme/breakpoints';

const media: { [$Keys<typeof breakpoints>]: (string) => string } = {};
for (const key of Object.keys(breakpoints)) {
    const emSize = breakpoints[key].width / 16;
    media[key] = args => `
        @media (max-width: ${emSize}em) {
            ${args}
        }
    `;
}

export { media };

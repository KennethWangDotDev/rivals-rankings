import { breakpoints } from '../theme/breakpoints';

const media = {};
for (const key in breakpoints) {
    if (breakpoints.hasOwnProperty(key)) {
        const emSize = breakpoints[key].width / 16;
        media[key] = args => String.raw`
            @media (max-width: ${emSize}em) {
                ${args}
            }
        `;
    }
}

export { media };

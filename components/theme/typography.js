import modularScale from 'modular-scale';
import { breakpoints, largestBreakpoint } from '../theme/breakpoints';
import { colors } from '../theme/colors';
import { media } from '../utils/media';

const fontsDeclaration = `
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Lt.eot');
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Lt.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Lt.woff2') format('woff2'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Lt.woff') format('woff'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Lt.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/static/fonts/subset-HelveticaNeueLTStd-It.eot');
        src: url('/static/fonts/subset-HelveticaNeueLTStd-It.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/subset-HelveticaNeueLTStd-It.woff2') format('woff2'),
            url('/static/fonts/subset-HelveticaNeueLTStd-It.woff') format('woff'),
            url('/static/fonts/subset-HelveticaNeueLTStd-It.ttf') format('truetype');
        font-weight: normal;
        font-style: italic;
    }
    
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Bd.eot');
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Bd.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Bd.woff2') format('woff2'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Bd.woff') format('woff'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Bd.ttf') format('truetype');
        font-weight: bold;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/static/fonts/subset-HelveticaNeueLTStd-LtIt.eot');
        src: url('/static/fonts/subset-HelveticaNeueLTStd-LtIt.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/subset-HelveticaNeueLTStd-LtIt.woff2') format('woff2'),
            url('/static/fonts/subset-HelveticaNeueLTStd-LtIt.woff') format('woff'),
            url('/static/fonts/subset-HelveticaNeueLTStd-LtIt.ttf') format('truetype');
        font-weight: 300;
        font-style: italic;
    }
    
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Roman.eot');
        src: url('/static/fonts/subset-HelveticaNeueLTStd-Roman.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Roman.woff2') format('woff2'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Roman.woff') format('woff'),
            url('/static/fonts/subset-HelveticaNeueLTStd-Roman.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'BigNoodle';
        src: url('/static/fonts/hinted-subset-BigNoodleTitling-Oblique.eot');
        src: url('/static/fonts/hinted-subset-BigNoodleTitling-Oblique.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/hinted-subset-BigNoodleTitling-Oblique.woff2') format('woff2'),
            url('/static/fonts/hinted-subset-BigNoodleTitling-Oblique.woff') format('woff'),
            url('/static/fonts/hinted-subset-BigNoodleTitling-Oblique.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
`;

const useBodyFont = `
    font-family: "Helvetica Neue", Helvetica, arial, sans-serif;
`;

const useTitleFont = `
    font-family: "BigNoodle", impact, sans-serif;
`;

const lineHeight = 1.5;
const fontsDisplaySettings = `
    html,
    body {
        font-size: 100%;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        
        line-height: ${lineHeight};
        color: ${colors.body};
        ${useBodyFont}
    }

    a {
        text-decoration: none;
        color: inherit;
    }
`;

const typeScale = {};
for (const key in breakpoints) {
    if (breakpoints.hasOwnProperty(key)) {
        const ms = modularScale({
            ratios: [breakpoints[key].ratio],
            bases: [breakpoints[key].base]
        });
        typeScale[key] = {
            small: ms(-1),
            p: ms(0),
            h6: ms(1),
            h5: ms(2),
            h4: ms(3),
            h3: ms(4),
            h2: ms(5),
            h1: ms(6),
            hero: ms(7)
        };
    }
}

function size(level) {
    if (
        !(
            level === 'small' ||
            level === 'p' ||
            level === 'h6' ||
            level === 'h5' ||
            level === 'h4' ||
            level === 'h3' ||
            level === 'h2' ||
            level === 'h1' ||
            level === 'hero'
        )
    ) {
        // eslint-disable-next-line no-param-reassign
        level = 'p';
    }
    let statement = '';
    for (const key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
            const largest = largestBreakpoint();
            if (largest === key) {
                statement += `${`font-size: ${typeScale[key][level]}rem;`}\n`;
            } else {
                statement += `${media[key](`font-size: ${typeScale[key][level]}rem;`)}\n`;
            }
        }
    }
    return statement;
}

function verticalRhythm(amount = 1) {
    const vr = {};
    for (const key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
            vr[key] = lineHeight * typeScale[key].p * amount;
        }
    }
    return vr;
}

function margin(direction, amount) {
    if (
        !(
            direction === 'top' ||
            direction === 'bottom' ||
            direction === 'left' ||
            direction === 'right'
        )
    ) {
        // eslint-disable-next-line no-param-reassign
        direction = 'bottom';
    }
    let statement = '';
    for (const key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
            const largest = largestBreakpoint();
            if (largest === key) {
                statement += `margin-${direction}: ${verticalRhythm(amount)[key] * amount}rem;\n`;
            } else {
                statement += `${media[key](`margin-${direction}: ${verticalRhythm(amount)[key] * amount}rem;`)}\n`;
            }
        }
    }
    return statement;
}

function padding(direction, amount) {
    if (
        !(
            direction === 'up' ||
            direction === 'down' ||
            direction === 'bottom' ||
            direction === 'right'
        )
    ) {
        // eslint-disable-next-line no-param-reassign
        direction = 'down';
    }
    let statement = '';
    for (const key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
            const largest = largestBreakpoint();
            if (largest === key) {
                statement += `padding-${direction}: ${verticalRhythm(amount)[key] * amount}rem;\n`;
            } else {
                statement += `${media[key](`padding-${direction}: ${verticalRhythm(amount)[key] * amount}rem;`)}\n`;
            }
        }
    }
    return statement;
}

export {
    fontsDeclaration,
    useBodyFont,
    useTitleFont,
    lineHeight,
    fontsDisplaySettings,
    typeScale,
    size,
    verticalRhythm,
    margin,
    padding
};

//   @mixin container($width: 50rem) {
//     margin: auto;
//     @include margin-top(1);
//     @include margin-bottom(1);
//     max-width: $width;
//     padding-left: 0.5rem;
//     padding-right: 0.5rem;
//   }

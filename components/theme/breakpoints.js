const breakpoints = {
    extraLarge: {
        width: 1280,
        base: 1.15,
        ratio: 1.2
    },
    large: {
        width: 962,
        base: 1.15,
        ratio: 1.18
    },
    medium: {
        width: 720,
        base: 1.1,
        ratio: 1.15
    },
    small: {
        width: 540,
        base: 1.05,
        ratio: 1.13
    },
    extraSmall: {
        width: 380,
        base: 1,
        ratio: 1.1
    }
};

function largestBreakpoint() {
    let largestWidth = 0;
    let largestKeyName = '';
    for (const key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
            if (breakpoints[key].width > largestWidth) {
                largestWidth = breakpoints[key].width;
                largestKeyName = key;
            }
        }
    }

    return largestKeyName;
}

export { breakpoints, largestBreakpoint };

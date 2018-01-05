function depth(level) {
    if (level < 0) {
        level = 1;
    }
    if (level > 5) {
        level = 5;
    }
    let statement;
    if (level === 1) {
        statement = 'box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);';
    }
    if (level === 2) {
        statement = 'box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23);';
    }
    if (level === 3) {
        statement = 'box-shadow: 0 10px 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23);';
    }
    if (level === 4) {
        statement = 'box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);';
    }
    if (level === 5) {
        statement = 'box-shadow: 0 19px 38px rgba(0, 0, 0, .30), 0 15px 12px rgba(0, 0, 0, .22);';
    }
    return statement;
}

export { depth };

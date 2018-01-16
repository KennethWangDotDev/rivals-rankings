function smartUnderline(background, color, width: '1px', percent: '93%') {
    const statement = `
        text-shadow:  .06em 0 ${background}, 
        -.06em 0 ${background},
        0 .06em ${background},
        0 -.06em ${background},
        .09em 0 ${background},
        -.09em 0 ${background},
        .12em 0 ${background},
        -.12em 0 ${background},
        .15em 0 ${background},
        -.15em 0 ${background},
        .18em 0 ${background},
        -.18em 0 ${background};

        background-image: linear-gradient(${color}, ${color});
        background-size: 1px ${width};
        background-repeat: repeat-x;
        background-position: 0% ${percent};

        text-decoration: none;
          *,
          *:after,
          &:after,
          *:before,
          &:before {
            text-shadow: none;
          }
    `;
    return statement;
}

export { smartUnderline };

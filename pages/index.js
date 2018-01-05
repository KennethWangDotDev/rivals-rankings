import React from 'react';
import Main from '../lib/layout';
import HomeSection from '../components/_/HomeSection';
import withData from '../lib/apollo';

export default withData(props => (
    <Main pathname={props.url.pathname}>
        <HomeSection />
    </Main>
));

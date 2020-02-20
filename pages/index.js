import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import Nav from '../components/nav';
import {ArrivalsTimeline} from '../components/ArrivalsTimeline';

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const Home = () => {
  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <ArrivalsTimeline
          fetcher={fetcher}
          routesByTrack={{
            local: ['1'],
          }}
          stopId={122}
          stopLabel="79th Street"
        />
        <ArrivalsTimeline
          fetcher={fetcher}
          routesByTrack={{
            local: ['1'],
            express: ['2', '3'],
          }}
          stopId={123}
          stopLabel="72nd Street"
        />
      </div>
    </div>
  );
};

export default Home;

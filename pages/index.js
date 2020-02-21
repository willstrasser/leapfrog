import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import Nav from '../components/nav';
import {ArrivalsTimeline} from '../components/ArrivalsTimeline';

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const STOPS = [
  {id: 122, label: '79th Street'},
  {id: 123, label: '72nd Street'},
  {id: 132, label: '14th Street'},
];

const Home = () => {
  const arrivalsUrl = `/api/arrivals/${STOPS.map((stop) => stop.id)}`;
  const {data: arrivals, error, revalidate} = useSWR(arrivalsUrl, fetcher, {
    refreshInterval: 30000,
  });

  if (error) return <div>failed to load</div>;
  if (!arrivals) return <div>loading...</div>;
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
        {STOPS.map((stop) => (
          <ArrivalsTimeline
            arrivals={arrivals.schedule[stop.id].S}
            routesByTrack={{
              local: ['1'],
              express: ['2', '3'],
            }}
            stopLabel={stop.label}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

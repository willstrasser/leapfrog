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
  {id: 135, label: 'Canal Street'},
];

const Home = () => {
  const arrivalsUrl = `/api/arrivals/${STOPS.map((stop) => stop.id)}`;
  const {data, error, revalidate} = useSWR(arrivalsUrl, fetcher, {
    refreshInterval: 30000,
  });
  const [path, setPath] = useState(0);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const {arrivals, paths} = data;
  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        {paths.map((_, index) => {
          return (
            <span
              style={{color: path === index ? 'red' : 'inherit'}}
              onClick={() => setPath(index)}
            >
              {index}{' '}
            </span>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
        }}
      >
        {STOPS.map((stop, index) => (
          <ArrivalsTimeline
            arrivals={arrivals.schedule[stop.id].S}
            highlight={paths[path][index]}
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

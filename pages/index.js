import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import Nav from '../components/nav';
import {ArrivalsTimeline} from '../components/ArrivalsTimeline';
import {useInterval} from '../_hooks/useInterval';

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
  let [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 10000);
  const arrivalsUrl = `/api/arrivals/${STOPS.map((stop) => stop.id)}`;
  const {data, error, revalidate} = useSWR(arrivalsUrl, fetcher, {
    refreshInterval: 30000,
  });
  const [pathIndex, setPathIndex] = useState(0);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const {arrivals, paths} = data;
  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div onClick={revalidate}>Refresh</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {paths.map((path, index) => (
          <span
            style={{color: pathIndex === index ? 'red' : 'inherit'}}
            onClick={() => setPathIndex(index)}
          >
            {moment(
              (path[path.length - 1].arrivalTime - path[0].arrivalTime) * 1000
            ).format('m:ss')}{' '}
            duration |{' '}
            {moment(path[path.length - 1].arrivalTime * 1000).format('h:mm a')} arrival
            <br />
            {path
              .slice(0, -1)
              .map((arrival) => arrival.routeId)
              .join('→')}
          </span>
        ))}
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
            highlight={paths[pathIndex][index].arrivalTime}
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

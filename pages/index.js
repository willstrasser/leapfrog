import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import Nav from '../components/nav';

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const STOP_ID = 123;
const ARRIVALS_KEY = `/api/arrivals/${STOP_ID}`;

const Home = () => {
  const {data: arrivals, error, revalidate} = useSWR(ARRIVALS_KEY, fetcher, {
    refreshInterval: 30000,
  });

  if (error) return <div>failed to load</div>;
  if (!arrivals) return <div>loading...</div>;

  const routeIds = Array.from(new Set(arrivals.map((train) => train.routeId)));
  const routesByTrack = {
    local: ['1'],
    express: ['2', '3'],
  };

  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div onClick={revalidate}>refresh</div>
      <div style={{display: 'flex', width: '100%'}}>
        {Object.keys(routesByTrack).map((track) => {
          const routes = routesByTrack[track];
          const trains = arrivals.filter((arrival) => routes.includes(arrival.routeId));
          const id = routes.join('/');
          return (
            <div key={id} style={{flex: 1, textAlign: 'center'}}>
              <div>~{id}~</div>
              <>
                {trains.map((train, index) => {
                  return (
                    <div key={index}>{moment(train.arrivalTime * 1000).fromNow()}</div>
                  );
                })}
              </>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

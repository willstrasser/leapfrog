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
    refreshInterval: 10000,
  });

  if (error) return <div>failed to load</div>;
  if (!arrivals) return <div>loading...</div>;

  const routeIds = Array.from(new Set(arrivals.map((train) => train.routeId)));

  return (
    <div>
      <Head title="Home" />
      <Nav />
      <div onClick={revalidate}>refresh</div>
      {routeIds.map((id) => {
        const routes = arrivals.filter((route) => route.routeId === id);
        return (
          <div key={id}>
            <div>~{id}~</div>
            <>
              {routes.map((route, index) => {
                return (
                  <div key={index}>{moment(route.arrivalTime * 1000).fromNow()}</div>
                );
              })}
            </>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

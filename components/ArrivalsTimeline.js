import React from 'react';
import moment from 'moment';
import useSWR from 'swr';

export const ArrivalsTimeline = (props) => {
  const {fetcher, routesByTrack, stopId, stopLabel} = props;
  const arrivalsUrl = `/api/arrivals/${stopId}`;
  const {data: arrivals, error, revalidate} = useSWR(arrivalsUrl, fetcher, {
    refreshInterval: 30000,
  });

  if (error) return <div>failed to load</div>;
  if (!arrivals) return <div>loading...</div>;

  const routeIds = Array.from(new Set(arrivals.map((train) => train.routeId)));
  const nowMs = moment();
  const viewportMs = moment.duration(30, 'minutes');

  return (
    <>
      <div>{stopLabel}</div>
      {Object.keys(routesByTrack).map((track) => {
        const routes = routesByTrack[track];
        const trains = arrivals.filter((arrival) => routes.includes(arrival.routeId));
        const id = routes.join('/');
        return (
          <div
            key={id}
            style={{
              height: '50px',
              marginBottom: '1em',
            }}
          >
            <div>~{id}~</div>
            <div
              style={{
                display: 'flex',
                online: '1px solid green',
                position: 'relative',
              }}
            >
              {trains.map((train, index) => {
                const arrivalMs = train.arrivalTime * 1000;
                const timeToArrivalMs = arrivalMs - nowMs;
                const normalized = timeToArrivalMs / viewportMs;
                const label = moment(arrivalMs).diff(nowMs, 'minutes');
                return (
                  <div
                    key={index}
                    style={{
                      left: `${normalized * 100}vw`,
                      position: 'absolute',
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

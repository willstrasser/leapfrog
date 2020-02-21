import React from 'react';
import moment from 'moment';

export const ArrivalsTimeline = (props) => {
  const {arrivals, routesByTrack, stopLabel} = props;

  const routeIds = Array.from(new Set(arrivals.map((train) => train.routeId)));
  const nowMs = moment();
  const viewportMs = moment.duration(30, 'minutes');

  return (
    <>
      <div>{stopLabel}</div>
      {Object.keys(routesByTrack).map((track) => {
        const routes = routesByTrack[track];
        const trains = arrivals.filter((arrival) => routes.includes(arrival.routeId));
        if (!trains.length) {
          return;
        }
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
                const label = moment(moment(arrivalMs).diff(nowMs)).format('mm:ss');
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

import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Link from 'next/link';
import Head from '../components/head';
import Nav from '../components/nav';

const Home = () => {
  const [arrivals, setArrivals] = useState(null);

  useEffect(() => {
    async function getArrivals() {
      const res = await fetch('/api/arrivals');
      const resp = await res.json();
      setArrivals(resp);
    }
    getArrivals();
  }, []);

  const routeIds = arrivals
    ? Array.from(new Set(arrivals.map((train) => train.routeId)))
    : [];

  return (
    <div>
      <Head title="Home" />
      <Nav />

      <div className="hero">
        <p className="row date">
          {arrivals ? (
            <React.Fragment>
              <span>
                {routeIds &&
                  routeIds.map((id) => {
                    const routes = arrivals.filter((route) => route.routeId === id);
                    return (
                      <>
                        <div>~{id}~</div>
                        <div>
                          {routes.map((route) => {
                            console.log(route.arrivalTime);
                            return (
                              <div>{moment(route.arrivalTime * 1000).fromNow()}</div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })}
              </span>
            </React.Fragment>
          ) : (
            <span className="loading"></span>
          )}
        </p>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .date {
          height: 24px;
          max-width: calc(100% - 32px)
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
        }
        .date p {
          text-align: center;
        }
        .date span {
          width: 176px;
          text-align: center;
        }
        @keyframes Loading {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        .date .loading {
          max-width: 100%;
          height: 24px;
          border-radius: 4px;
          display: inline-block;
          background: linear-gradient(270deg, #D1D1D1, #EAEAEA);
          background-size: 200% 200%;
          animation: Loading 2s ease infinite;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Home;

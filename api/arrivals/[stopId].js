import {mtaApi} from '../mtaApi';

export default (request, response) => {
  const {stopId} = request.query;
  mtaApi
    .schedule(stopId)
    .then(function(result) {
      response.json(result.schedule[String(stopId)].S);
    })
    .catch(function(err) {
      throw err;
    });
};

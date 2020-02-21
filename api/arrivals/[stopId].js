import {mtaApi} from '../mtaApi';

export default (request, response) => {
  const {stopId} = request.query;
  mtaApi
    .schedule(stopId.split(','))
    .then(function(result) {
      response.json(result);
    })
    .catch(function(err) {
      throw err;
    });
};

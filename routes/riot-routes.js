import express from 'express';

import * as riotHandlers from '../controllers/riot-handlers.js';

const router = express.Router();

// TODO
// Champions model is one document for each champion
// Riot controller imports the Version and Champions models
// Also import the external Riot API
// Version it's not an endpoint of this app API
// The app doesn't care, always is given the last version
// This architecture it's going to be the same for lolalytics endpoints
// It has no sense to have post methods. Updating the database is internal
// From outside we only ask this API to serve the uptated data

// router.route('/versions').get(riotHandlers.getVersion);

router.route('/').get(riotHandlers.getChampions);

// router.route('/:id').get(riotHandlers.getChampionById);

export default router;

import Tierlist from '../models/tierlist-model.js';
import tierlistCache from '../models/tierlist-cache.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';

// Function updateTierlists to save from database to cache
export default catchAsync(async (req, res, next) => {
  const { ranks } = req.body;

  const rank = Array.isArray(ranks) ? ranks : [ranks];

  const tierlists = await Tierlist.find({
    $or: [...rank.map(el => ({ rank: el }))],
  });

  if (!tierlists.length) {
    return next(
      new AppError(
        `No tierlists were found for ranks: ${ranks.join(' - ')}`,
        400,
      ),
    );
  }

  tierlistCache.saveMany(tierlists);

  res.status(200).json({
    status: 'success',
    results: tierlists.length,
  });
});

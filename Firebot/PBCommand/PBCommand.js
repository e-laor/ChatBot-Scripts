// Constants
const s1 = 'xqk38ky1';
const s2 = '9qjkjp01';
const s3 = 'zqo4zxp1';
const s4 = 'qox8992q';
const s5 = '1gne2vol';

const userId = 'qjn32o4x';

// Function to get season ID
const getSeasonId = (season) => {
  switch (season.toLowerCase()) {
    case 's1':
      return s1;
    case 's2':
      return s2;
    case 's3':
      return s3;
    case 's4':
      return s4;
    case 's5':
      return s5;
    default:
      return s1;
  }
};

// Function to compute time
const computeTime = (timeFloat) => {
  const hours = Math.floor(timeFloat / 3600);
  const minutes = Math.floor((timeFloat % 3600) / 60);
  const seconds = Math.floor(timeFloat % 60);
  return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const findRunPlaceByPlayerId = (data, id) => {
  const run = data.runs.find((run) => run.run.players.some((player) => player.id === id));
  return run ? run.place : null;
};
// Function to format run information
const runInfo = (time) => `${time}`;

// Function to fetch data from API
const fetchDataAPI = async (seasonId, logger) => {
  const baseURL = `https://www.speedrun.com/api/v1/leaderboards/3dxkj5p1/category/jdrronld?var-rn1zd7kl=${seasonId}`;

  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    const PBRun = findRunPlaceByPlayerId(data.data, userId); // the place of the PB run (count start from 1 so we need to decrement by 1 to get the index)
    if (PBRun === null) {
      logger.info('No PB found for this season');
      return 'No PB found for this season';
    }
    const time = computeTime(data.data.runs[PBRun - 1].run.times.primary_t);
    logger.info(time);
    return runInfo(time);
  } catch (error) {
    logger.info('Error fetching data:', error);
    throw error;
  }
};

exports.run = async (runRequest) => {
  const { modules, trigger } = runRequest;
  const { logger } = modules;
  const { userCommand } = trigger.metadata;
  const customVariableManager = modules.customVariableManager;

  if (!userCommand) {
    logger.info('error with userCommand');
    return;
  }

  const args = userCommand.args;

  try {
    const seasonId = getSeasonId(args[0].toLowerCase());
    const PB = await fetchDataAPI(seasonId, logger);
    logger.info(PB);
    customVariableManager.addCustomVariable('PB', PB, 5);
  } catch (error) {
    logger.info('error', error);
    return 'Error.';
  }
};

exports.getScriptManifest = () => ({
  firebotVersion: '5',
  name: 'PB Command',
  description: 'PB command for season leaderboards',
  author: 'Cyber_1',
  version: '1.0',
  website: 'https://www.twitch.tv/cyber_1',
});

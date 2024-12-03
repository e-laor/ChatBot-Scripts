const s1 = 'xqk38ky1';
const s2 = '9qjkjp01';
const s3 = 'zqo4zxp1';
const s4 = 'qox8992q';

// Function to get season ID
const getSeasonId = (season) => {
  switch (season) {
    case 's1':
      return s1;
    case 's2':
      return s2;
    case 's3':
      return s3;
    case 's4':
      return s4;
    default:
      return s1;
  }
};

// Function to fetch data from API
const fetchDataAPI = async (seasonId, logger) => {
  const baseURL = `https://www.speedrun.com/api/v1/leaderboards/3dxkj5p1/category/jdrronld?var-rn1zd7kl=${seasonId}`;
  const response = await fetch(baseURL);
  const data = await response.json();
  const runUrl = data.data.runs[0].run.players[0].uri;
  const runResponse = await fetch(runUrl);
  const runData = await runResponse.json();
  const name = runData.data.names.international;
  const time = computeTime(data.data.runs[0].run.times.primary_t);
  return wrHolder(name, time);
};

// Function to compute time
const computeTime = (timeFloat) => {
  const hours = Math.floor(timeFloat / 3600);
  const minutes = Math.floor((timeFloat % 3600) / 60);
  const seconds = Math.floor(timeFloat % 60);
  return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Function to format WR holder information
const wrHolder = (name, time) => `${time} by ${name}`;

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

  logger.info(args);
  // Main execution logic
  try {
    const seasonId = getSeasonId(args[0].toLowerCase());
    const WR = await fetchDataAPI(seasonId, logger);
    customVariableManager.addCustomVariable('wrHolder', WR, 5);
    logger.info('WR command used for season: ', args[0], WR);
  } catch (error) {
    logger.info('error', error);
  }
};

exports.getScriptManifest = () => ({
  firebotVersion: '5',
  name: 'WR Command',
  description: 'Attempt at making a WR command for The Binding Of Isaac Repentance.',
  author: 'Cyber_1',
  version: '1.0',
  website: 'https://www.twitch.tv/cyber_1',
});

// Constants
const s1 = 'xqk38ky1';
const s2 = '9qjkjp01';
const s3 = 'zqo4zxp1';
const s4 = 'qox8992q';
const s5 = '1gne2vol';

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

// Function to format run information
const runInfo = (name, time) => `${time} by ${name}`;

// Function to fetch data from API
const fetchDataAPI = async (seasonId, amount, logger) => {
  const baseURL = `https://www.speedrun.com/api/v1/leaderboards/3dxkj5p1/category/jdrronld?var-rn1zd7kl=${seasonId}`;
  const topPlayers = [];

  try {
    const response = await fetch(baseURL);
    const data = await response.json();

    for (let i = 0; i < amount; i++) {
      const runUrl = data.data.runs[i].run.players[0].uri;
      const runResponse = await fetch(runUrl);
      const runData = await runResponse.json();

      const name = runData.data.names.international;
      const time = computeTime(data.data.runs[i].run.times.primary_t);
      topPlayers.push(runInfo(name, time));
    }

    return topPlayers;
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
  const amount = args[0];

  try {
    const seasonId = getSeasonId(args[1]);
    const topPlayers = await fetchDataAPI(seasonId, amount, logger);
    logger.info(topPlayers.join(', '));
    customVariableManager.addCustomVariable('topPlayers', topPlayers.join(', '), 5);
  } catch (error) {
    logger.info('error', error);
    return 'Error.';
  }
};

exports.getScriptManifest = () => ({
  firebotVersion: '5',
  name: 'Top Command',
  description: 'Top 1-10 command for season leaderboards',
  author: 'Cyber_1',
  version: '1.0',
  website: 'https://www.twitch.tv/cyber_1',
});

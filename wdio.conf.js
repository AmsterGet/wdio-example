// Load environment variables from .env file
require('dotenv').config();

const { Reporter } = require('@reportportal/agent-js-webdriverio');
const RPClient = require('@reportportal/client-javascript');

const rpConfig = {
  project: 'amsterget_personal',
  endpoint: 'https://demo.reportportal.io/api/v1',
  launch: 'WDIO launch',
  apiKey: process.env.RP_API_KEY,
  debug: true,
  description: 'Static launch description',
  attributes: [{ key: 'agent', value: 'webdriverio-cucumber' }, { value: 'example' }],
  attachPicturesToLogs: true,
  reportSeleniumCommands: true,
  seleniumCommandsLogLevel: 'debug',
  cucumberNestedSteps: false,
  restClientConfig: {
    timeout: 60000,
    // proxy: '',
    debug: true,
  },
};

exports.config = {
  onPrepare: async function () {
    async function startLaunch() {
      const client = new RPClient(rpConfig);
      const response = await client.startLaunch({
        name: rpConfig.launch,
        attributes: rpConfig.attributes,
        // etc
      }).promise;

      return response.id;
    }

    const launchId = await startLaunch();
    // The Launch ID can be set to the environment variable right here
    process.env.RP_LAUNCH_ID = launchId;
  },
  onComplete: async function () {
    const finishLaunch = async () => {
      const client = new RPClient(rpConfig);
      const launchTempId = client.startLaunch({ id: process.env.RP_LAUNCH_ID }).tempId;
      await client.finishLaunch(launchTempId, {}).promise;
    };

    await finishLaunch();
  },
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // Sauce Labs Configuration
  // Connection settings
  // hostname: process.env.SAUCE_HOSTNAME || 'ondemand.eu-central-1.saucelabs.com',
  // port: 443,
  // protocol: 'https',
  // path: '/',
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: process.env.SAUCE_REGION || 'eu-central-1',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: ['./tests/features/**/*.feature'],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [
    {
      'wdio:maxInstances': 10,
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'Linux',
      // // Chrome specific options
      // 'goog:chromeOptions': {
      //   // to run chrome headless the following flags are required
      //   // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
      //   // args: ['--headless', '--disable-gpu'],
      // },
      //
      // If outputDir is provided WebdriverIO can capture driver session logs
      // it is possible to configure which logTypes to include/exclude.
      // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
      // excludeDriverLogs: ['bugreport', 'server'],
    },
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // Set to 'info' to see Sauce Labs connection details and debug issues
  logLevel: 'info',
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: 'http://localhost',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  // Increased timeout for Sauce Labs connection - some regions may be slower
  connectionRetryTimeout: 180000, // 3 minutes
  //
  // Default request retries count
  connectionRetryCount: 5, // Increased retries
  //
  // WebDriver request timeout
  // Increase timeout for Sauce Labs which may take longer to spin up VMs
  requestTimeout: 180000, // 3 minutes
  responseTimeout: 180000, // 3 minutes
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'cucumber',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters: [[Reporter, rpConfig]],

  //
  // Options to be passed to Cucumber.
  cucumberOpts: {
    require: ['./tests/**/**.js'],
  },
  reporterSyncInterval: 1000,
};

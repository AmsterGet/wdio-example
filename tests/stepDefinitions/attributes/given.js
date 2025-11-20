const { Given } = require('@cucumber/cucumber');
const { ReportingApi } = require('@reportportal/agent-js-webdriverio');

Given('I put {string}', async function (givenValue) {
  ReportingApi.addAttributes([
    {
      key: 'runner',
      value: 'cucumber',
    },
    {
      value: 'when_attribute',
    },
  ]);

  this.value = givenValue;
  await browser.url('https://www.google.com');
  await browser.takeScreenshot();
});

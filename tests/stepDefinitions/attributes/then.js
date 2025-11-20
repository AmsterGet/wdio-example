const { Then } = require('@cucumber/cucumber');
const { ReportingApi } = require("@reportportal/agent-js-webdriverio");
const assert = require('assert');

Then('I should compare it with {string}', async function (expectedValue) {
  ReportingApi.addAttributes([
    {
      key: 'runner',
      value: 'cucumber',
    },
    {
      value: 'then_attribute',
    },
  ]);
  await browser.takeScreenshot();
  assert.strictEqual(this.value, expectedValue);
  assert.strictEqual(title, 'Google_2');
});

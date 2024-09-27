/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

import { delay } from '../utils/constants';
import testSlackChannel from '../fixtures/test_slack_channel';
import testChimeChannel from '../fixtures/test_chime_channel';
import testMicrosoftTeamsChannel from '../fixtures/test_microsoft_teams_channel.json';
import testWebhookChannel from '../fixtures/test_webhook_channel.json';
import testTlsSmtpSender from '../fixtures/test_tls_smtp_sender';

describe('Test create channels', () => {
  before(() => {
    // Delete all Notification configs
    cy.deleteAllConfigs();

    cy.createConfig(testTlsSmtpSender);
  });

  beforeEach(() => {
    cy.visit(
      `${Cypress.env(
        'opensearchDashboards'
      )}/app/notifications-dashboards#create-channel`
    );
    cy.wait(delay * 3);
  });

  it('creates a slack channel and send test message', () => {
    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('Some fields are invalid.').should('exist');

    cy.get('[placeholder="Enter channel name"]').type('Test slack channel');
    cy.get('[data-test-subj="create-channel-slack-webhook-input"]').type(
      'https://hooks.slack.com/services/A123456/B1234567/A1B2C3D4E5F6G7H8I9J0K1L2'
    );
    cy.wait(delay);
    cy.get('[data-test-subj="create-channel-send-test-message-button"]').click({
      force: true,
    });
    cy.wait(delay);
    // This needs some time to appear as it will wait for backend call to timeout
    cy.contains('test message.').should('exist');

    cy.get('[data-test-subj="create-channel-create-button"]').click({
      force: true,
    });
    cy.contains('successfully created.').should('exist');
  });

  it('creates a chime channel', () => {
    cy.get('[placeholder="Enter channel name"]').type('Test chime channel');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Chime')
      .click({ force: true });
    cy.wait(delay);

    cy.get('[data-test-subj="create-channel-chime-webhook-input"]').type(
      'https://hooks.chime.aws/incomingwebhooks/sample_chime_url?token=123456'
    );
    cy.wait(delay);

    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('successfully created.').should('exist');
  });

  it('creates a microsoft teams channel and send test message', () => {
    cy.get('[placeholder="Enter channel name"]').type('Test microsoft teams channel');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Microsoft Teams')
      .click({ force: true });
    cy.wait(delay);

    cy.get('[data-test-subj="create-channel-microsoftTeams-webhook-input"]').type(
      'https://testdomain.webhook.office.com/123'
    );
    cy.wait(delay);

    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('successfully created.').should('exist');
  });

  it('creates an email channel', () => {
    cy.get('[placeholder="Enter channel name"]').type('Test email channel');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Email')
      .click({ force: true });
    cy.wait(delay);

    // custom data-test-subj does not work on combo box
    cy.get('[data-test-subj="comboBoxInput"]').eq(0).click({ force: true });
    cy.contains('test-tls-sender').click();

    cy.get('.euiButton__text')
      .contains('Create recipient group')
      .click({ force: true });
    cy.get('[data-test-subj="create-recipient-group-form-name-input"]').type(
      'Test recipient group'
    );
    cy.get(
      '[data-test-subj="create-recipient-group-form-description-input"]'
    ).type('Recipient group created while creating email channel.');
    cy.get('[data-test-subj="comboBoxInput"]')
      .last()
      .type('custom.email@test.com{enter}');
    cy.wait(delay);
    cy.get(
      '[data-test-subj="create-recipient-group-modal-create-button"]'
    ).click({ force: true });
    cy.contains('successfully created.').should('exist');

    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('successfully created.').should('exist');
  });

  it('creates an email channel with ses sender', () => {
    cy.get('[placeholder="Enter channel name"]').type('Test email channel with ses');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Email')
      .click({ force: true });
    cy.wait(delay);

    cy.get('input.euiRadio__input#ses_account').click({ force: true });
    cy.wait(delay);

    cy.get('.euiButton__text')
      .contains('Create SES sender')
      .click({ force: true });
    cy.get('[data-test-subj="create-ses-sender-form-name-input"]').type(
      'test-ses-sender'
    );
    cy.get('[data-test-subj="create-ses-sender-form-email-input"]').type(
      'test@email.com'
    );
    cy.get('[data-test-subj="create-ses-sender-form-role-arn-input"]').type(
      'arn:aws:iam::012345678912:role/NotificationsSESRole'
    );
    cy.get('[data-test-subj="create-ses-sender-form-aws-region-input"]').type(
      'us-east-1'
    );
    cy.get(
      '[data-test-subj="create-ses-sender-modal-create-button"]'
    ).click({ force: true });
    cy.contains('successfully created.').should('exist');

    // custom data-test-subj does not work on combo box
    cy.get('[data-test-subj="comboBoxInput"]').eq(1).click({ force: true });
    cy.contains('Test recipient group').click();
    cy.wait(delay);

    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('successfully created.').should('exist');
  });

  it('creates a webhook channel', () => {
    cy.get('[placeholder="Enter channel name"]').type('Test webhook channel');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Custom webhook')
      .click({ force: true });
    cy.wait(delay);

    cy.get('[data-test-subj="custom-webhook-url-input"]').type(
      'https://custom-webhook-test-url.com:8888/test-path?params1=value1&params2=value2&params3=value3&params4=value4&params5=values5&params6=values6&params7=values7'
    );

    cy.get('[data-test-subj="create-channel-create-button"]').click();
    cy.contains('successfully created.').should('exist');
  });

  function cidrToIpList(cidr) {
    const [base, bits] = cidr.split('/');
    const baseParts = base.split('.').map(Number);
    const numAddresses = 1 << (32 - bits); // Calculate the number of IPs in the range
    const ipList = [];

    for (let i = 0; i < numAddresses; i++) {
      const ip = [
        baseParts[0] + ((i >> 24) & 255),
        baseParts[1] + ((i >> 16) & 255),
        baseParts[2] + ((i >> 8) & 255),
        baseParts[3] + (i & 255),
      ].join('.');
      ipList.push(ip);
    }
    return ipList;
  }

  const updateLocalClusterSettings = (denyList) => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:9200/_cluster/settings', // Change to your local Elasticsearch URL
      body: {
        persistent: {
          opensearch: {
            notifications: {
              core: {
                http: {
                  host_deny_list: denyList,
                },
              },
            },
          },
        },
      },
    }).then((response) => {
      // Optionally handle the response to confirm the settings were updated
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('acknowledged', true);
    });
  };

  it('sends a test message for denied IPs', () => {
    const deniedIps = [
      '127.0.0.1',
      '169.254.0.1',
      '10.0.0.1',
      '255.255.255.255'
    ]; // List of CIDRs to test

    updateLocalClusterSettings(deniedIps);

    cy.get('[placeholder="Enter channel name"]').type('Test denied webhook channels');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    // Optionally, add a check to ensure the dropdown options are visible/loaded
    cy.get('.euiContextMenuItem__text').should('be.visible');
    cy.get('.euiContextMenuItem__text')
      .contains('Custom webhook')
      .click({ force: true });
    cy.wait(delay);

    deniedIps.forEach(ip => {
      // Constructing the custom webhook URL for each IP
      const webhookUrl = `https://${ip}:8888/test-path?params1=value1&params2=value2&params3=value3&params4=value4&params5=values5&params6=values6&params7=values7`;

      cy.get('[data-test-subj="custom-webhook-url-input"]').clear().type(webhookUrl);

      // Send the test message
      cy.get('[data-test-subj="create-channel-send-test-message-button"]').click({
        force: true,
      });
      cy.wait(delay);

      // Check for the expected error message indicating the host is denied
      cy.contains('Failed to send the test message').should('exist');
      cy.get('.euiButton__text').should('be.visible');
      cy.get('.euiButton__text').contains('See the full error').click({ force: true });
      cy.contains('Host of url is denied').should('exist');
      cy.get('.euiButton__text').contains('Close').click({ force: true });
    });
  });

  it('creates an sns channel', () => {
    cy.get('[placeholder="Enter channel name"]').type('test-sns-channel');

    cy.get('.euiSuperSelectControl').contains('Slack').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text')
      .contains('Amazon SNS')
      .click({ force: true });
    cy.wait(delay);

    cy.get('[data-test-subj="sns-settings-topic-arn-input"]').type(
      'arn:aws:sns:us-west-2:123456789012:notifications-test'
    );
    cy.get('[data-test-subj="sns-settings-role-arn-input"]').type(
      'arn:aws:iam::012345678901:role/NotificationsSNSRole'
    );

    cy.get('[data-test-subj="create-channel-create-button"]').click({ force: true });
    cy.contains('successfully created.').should('exist');
  });
});

describe('Test channels table', () => {
  before(() => {
    // Delete all Notification configs
    cy.deleteAllConfigs();

    // Create test channels
    cy.createConfig(testSlackChannel);
    cy.createConfig(testChimeChannel);
    cy.createConfig(testMicrosoftTeamsChannel);
    cy.createConfig(testWebhookChannel);
    cy.createTestEmailChannel();
  });

  beforeEach(() => {
    cy.visit(
      `${Cypress.env(
        'opensearchDashboards'
      )}/app/notifications-dashboards#channels`
    );
    cy.wait(delay * 3);
  });

  it('displays channels', async () => {
    cy.contains('Test slack channel').should('exist');
    cy.contains('Test email channel').should('exist');
    cy.contains('Test chime channel').should('exist');
    cy.contains('Test webhook channel').should('exist');
  });

  it('mutes channels', async () => {
    cy.get('.euiCheckbox__input[aria-label="Select this row"]').eq(0).click(); // chime channel
    cy.get('.euiButton__text').contains('Actions').click({ force: true });
    cy.wait(delay);
    cy.get('.euiContextMenuItem__text').contains('Mute').click({ force: true });
    cy.wait(delay);
    cy.get('[data-test-subj="mute-channel-modal-mute-button"]').click({
      force: true,
    });
    cy.wait(delay);
    cy.contains('successfully muted.').should('exist');
    cy.contains('Muted').should('exist');
  });

  it('filters channels', async () => {
    cy.get('input[placeholder="Search"]').type('chime{enter}');
    cy.wait(delay);
    cy.contains('Test chime channel').should('exist');
    cy.contains('Test slack channel').should('not.exist');
    cy.contains('Test email channel').should('not.exist');
    cy.contains('Test webhook channel').should('not.exist');

    cy.get('.euiButtonEmpty__text').contains('Source').click({ force: true });
    cy.get('.euiFilterSelectItem__content')
      .contains('ISM')
      .click({ force: true });
    cy.wait(delay);
    cy.contains('No channels to display').should('exist');
  });
});

describe('Test channel details', () => {
  // TODO: For some reason, the cleanup being done in the before() of this test
  //  is attempting to delete the same config twice causing 404 errors.
  //  The other tests don't seem to do it. We can add this back after root causing and fixing it.
  // before(() => {
  //   // Delete all Notification configs
  //   cy.deleteAllConfigs();
  //   cy.wait(delay * 3);
  //
  //   // Create test channels
  //   cy.createConfig(testSlackChannel);
  //   cy.createConfig(testChimeChannel);
  //   cy.createConfig(testWebhookChannel);
  //   cy.createTestEmailChannel();
  // });

  beforeEach(() => {
    cy.visit(
      `${Cypress.env(
        'opensearchDashboards'
      )}/app/notifications-dashboards#channels`
    );
    cy.contains('Test webhook channel').click();
  });

  it('displays channel details', async () => {
    cy.contains('custom-webhook-test-url.com').should('exist');
    cy.contains('test-path').should('exist');
    cy.contains('8888').should('exist');
    cy.contains('2 more').click();
    cy.contains('Query parameters (7)').should('exist');
    cy.contains('params7').should('exist');
  });

  it('mutes and unmutes channels', async () => {
    cy.contains('Mute channel').click({ force: true });
    cy.get('[data-test-subj="mute-channel-modal-mute-button"]').click({
      force: true,
    });
    cy.contains('successfully muted.').should('exist');
    cy.contains('Muted').should('exist');

    cy.contains('Unmute channel').click({ force: true });
    cy.contains('successfully unmuted.').should('exist');
    cy.contains('Active').should('exist');
  });

  it('edits channels', () => {
    cy.contains('Actions').click({ force: true });
    cy.contains('Edit').click({ force: true });
    cy.contains('Edit channel').should('exist');
    cy.get('.euiText').contains('Custom webhook').should('exist');
    cy.get(
      '[data-test-subj="create-channel-description-input"]'
    ).type('{selectall}{backspace}Updated custom webhook description');
    cy.wait(delay);
    cy.contains('Save').click({ force: true });

    cy.contains('successfully updated.').should('exist');
    cy.contains('Updated custom webhook description').should('exist');
  })

  it('deletes channels', async () => {
    cy.contains('Actions').click({ force: true });
    cy.contains('Delete').click({ force: true });
    cy.get('input[placeholder="delete"]').type('delete');
    cy.get('[data-test-subj="delete-channel-modal-delete-button"]').click({ force: true })
    cy.contains('successfully deleted.').should('exist');
    cy.contains('Test slack channel').should('exist');
  })
});

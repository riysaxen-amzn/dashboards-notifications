/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-subj' });

window.URL.createObjectURL = () => '';
window.scrollTo = jest.fn();

const moment = jest.requireActual('moment-timezone');
jest.doMock('moment', () => {
  moment.tz.setDefault('Etc/UTC');
  return moment;
});

jest.mock('@elastic/eui/lib/components/form/form_row/make_id', () => () => 'random-id');

jest.mock('@elastic/eui/lib/services/accessibility/html_id_generator', () => ({
  htmlIdGenerator: () => {
    return () => 'random_html_id';
  },
}));

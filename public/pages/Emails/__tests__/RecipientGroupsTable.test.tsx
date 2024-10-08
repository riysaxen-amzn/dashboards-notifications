/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { fireEvent, render, waitFor } from '@testing-library/react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MOCK_DATA } from '../../../../test/mocks/mockData';
import {
  coreServicesMock,
  notificationServiceMock,
} from '../../../../test/mocks/serviceMock';
import { CoreServicesContext } from '../../../components/coreServices';
import { ServicesContext } from '../../../services';
import { RecipientGroupsTable } from '../components/tables/RecipientGroupsTable';
import { setupCoreStart } from '../../../../test/utils/helpers';

beforeAll(() => {
  setupCoreStart();
});

describe('<RecipientGroupsTable /> spec', () => {
  configure({ adapter: new Adapter() });

  it('renders empty state', async () => {
    const utils = render(
      <ServicesContext.Provider value={notificationServiceMock}>
        <CoreServicesContext.Provider value={coreServicesMock}>
          <RecipientGroupsTable />
        </CoreServicesContext.Provider>
      </ServicesContext.Provider>
    );
    expect(utils.container.firstChild).toMatchSnapshot();
  });

  it('renders table', async () => {
    const notificationServiceMock = jest.fn() as any;
    const getRecipientGroups = jest.fn(
      async (queryObject: object) => MOCK_DATA.recipientGroups
    );
    notificationServiceMock.notificationService = { getRecipientGroups };

    const utils = render(
      <ServicesContext.Provider value={notificationServiceMock}>
        <CoreServicesContext.Provider value={coreServicesMock}>
          <RecipientGroupsTable notificationService={notificationServiceMock.notificationService} />
        </CoreServicesContext.Provider>
      </ServicesContext.Provider>
    );

    await waitFor(() => expect(getRecipientGroups).toBeCalled());

    const input = utils.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test-query' } });

    await waitFor(() =>
      expect(getRecipientGroups).toBeCalledWith(
        expect.objectContaining({ query: 'test-query' })
      )
    );
  });
});

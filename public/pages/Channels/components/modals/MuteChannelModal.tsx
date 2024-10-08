/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiSmallButton,
  EuiSmallButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
} from '@elastic/eui';
import React, { useContext } from 'react';
import { SERVER_DELAY } from '../../../../../common';
import { ChannelItemType } from '../../../../../models/interfaces';
import { CoreServicesContext } from '../../../../components/coreServices';
import { ModalRootProps } from '../../../../components/Modal/ModalRoot';

interface MuteChannelModalProps extends ModalRootProps {
  selected: ChannelItemType[];
  setSelected: (items: ChannelItemType[]) => void;
  refresh?: () => void;
  onClose: () => void;
}

export const MuteChannelModal = (props: MuteChannelModalProps) => {
  if (props.selected.length !== 1) return null;

  const coreContext = useContext(CoreServicesContext)!;
  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose} maxWidth={500}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <EuiText size="s">
              <h2>{`Mute ${props.selected[0].name}?`}</h2>
            </EuiText>
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiText size="s">
            This channel will stop sending notifications to its recipients.
            However, the channel will remain available for selection.
          </EuiText>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiSmallButtonEmpty onClick={props.onClose}>Cancel</EuiSmallButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSmallButton
                fill
                data-test-subj="mute-channel-modal-mute-button"
                onClick={async () => {
                  const channel = { ...props.selected[0], is_enabled: false };
                  await props.services.notificationService
                    .updateConfig(channel.config_id, channel)
                    .then((resp) => {
                      coreContext.notifications.toasts.addSuccess(
                        `Channel ${channel.name} successfully muted.`
                      );
                      props.setSelected([channel]);
                      if (props.refresh)
                        setTimeout(() => props.refresh!(), SERVER_DELAY);
                    })
                    .catch((error) => {
                      coreContext.notifications.toasts.addError(error?.body || error, {
                        title: 'Failed to mute channel',
                      });
                    });
                  props.onClose();
                }}
              >
                Mute
              </EuiSmallButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

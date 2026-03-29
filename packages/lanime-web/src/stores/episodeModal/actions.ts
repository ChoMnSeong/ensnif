import { PayloadAction } from "@reduxjs/toolkit";
import { ModalState } from '@stores/episodeModal/types';

export const action = {
  openModal: (
    state: ModalState,
    action: PayloadAction<{
      animationId: string | null;
      title: string | null;
    }>,
  ) => {
    state.visible = true;
    state.animationId = action.payload.animationId;
    state.title = action.payload.title;
  },
  closeModal: (state: ModalState) => {
    state.visible = false;
    state.animationId = null;
    state.title = null;
  },
  setModalVisibility: (state: ModalState, action: PayloadAction<boolean>) => {
    state.visible = action.payload;
  },
};

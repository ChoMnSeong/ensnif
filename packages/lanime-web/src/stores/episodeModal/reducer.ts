import { createSlice } from "@reduxjs/toolkit";
import { ModalState } from '@stores/episodeModal/types';
import { action } from '@stores/episodeModal/actions';

const initialState: ModalState = {
  visible: false,
  animationId: null,
  title: null,
  modalType: "episodeModal",
};

const episodeModalSlice = createSlice({
  name: "episodeModal",
  initialState,
  reducers: action,
});

export const { openModal, closeModal, setModalVisibility } =
  episodeModalSlice.actions;
export default episodeModalSlice.reducer;

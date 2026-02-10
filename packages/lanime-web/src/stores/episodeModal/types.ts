export const OPEN_MODAL = "OPEN_MODAL" as const;
export const CLOSE_MODAL = "CLOSE_MODAL" as const;
export const SET_MODAL_VISIBILITY = "SET_MODAL_VISIBILITY" as const;

export interface ModalState {
  visible: boolean;
  animationId: string | null;
  title: string | null;
  modalType: "episodeModal";
}

export interface OpenModalAction {
  type: typeof OPEN_MODAL;
  payload: {
    animationId: string | null;
    title: string | null;
  };
}

export interface CloseModalAction {
  type: typeof CLOSE_MODAL;
}

export interface SetModalVisibilityAction {
  type: typeof SET_MODAL_VISIBILITY;
  payload: boolean;
}

export type ModalAction =
  | OpenModalAction
  | CloseModalAction
  | SetModalVisibilityAction;

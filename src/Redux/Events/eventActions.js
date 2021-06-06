import { CLEAR_MAP_FLAG, TRIGGER_DRAW, CLEAR_MAP, UPDATE_PREVIEW_IMAGE, ADD_TILE, LOAD_STATE, UPDATE_STARTINGPOINT, DELETE_TILE, SET_MODAL_TYPE, IS_LOADING, DELETE_TILESET, UPDATE_TILESET, SHOW_MODAL, SIDEBAR_TOGGLE, PREVIEW_TOGGLE, TILE_SELECT_ENABLED, LAYER_TOGGLE, UPDATE_XGRID, UPDATE_YGRID, UPDATE_ZOOM, APPEND_TILESET, UPDATE_LAYER, UPDATE_SELECTED_TILESET, UPDATE_SELECTED_TILE, RESET_STATE, ERROR_ALERT, GOOD_ALERT } from "./eventTypes"

export const clearedMapFlag = (data) => {
  return {
    type: CLEAR_MAP_FLAG,
    payload: data,
  }
}
export const triggerDraw = (data) => {
  return {
    type: TRIGGER_DRAW,
    payload: data,
  }
}
export const clearMap = (data) => {
  return {
    type: CLEAR_MAP,
    payload: data,
  }
}
export const updatePreviewImage = (data) => {
  return {
    type: UPDATE_PREVIEW_IMAGE,
    payload: data,
  }
}
export const goodAlert = (data) => {
  return {
    type: GOOD_ALERT,
    payload: data,
  }
}
export const errorAlert = (data) => {
  return {
    type: ERROR_ALERT,
    payload: data,
  }
}

export const resetState = (data) => {
  return {
    type: RESET_STATE,
    payload: data,
  }
}

export const loadState = (data) => {
  return {
    type: LOAD_STATE,
    payload: data,
  }
}

export const updateStartingPoint = (data) => {
  return {
    type: UPDATE_STARTINGPOINT,
    payload: data,
  }
}
export const addTile = (data) => {
  return {
    type: ADD_TILE,
    payload: data,
  }
}

export const deleteTile = (data) => {
  return {
    type: DELETE_TILE,
    payload: data,
  }
}

export const updateTileset = (data) => {
  return {
    type: UPDATE_TILESET,
    payload: data,
  }
}

export const deleteTileset = (data) => {
  return {
    type: DELETE_TILESET,
    payload: data,
  }
}

export const isLoading = (data) => {
  return {
    type: IS_LOADING,
    payload: data,
  }
}

export const setModalState = (data) => {
  return {
    type: SET_MODAL_TYPE,
    payload: data,
  }
}

export const showModal = (data) => {
  return {
    type: SHOW_MODAL,
    payload: data,
  }
}

export const SideBarToggle = (data) => {
  return {
    type: SIDEBAR_TOGGLE,
    payload: data,
  }
}
export const previewTog = (data) => {
  return {
    type: PREVIEW_TOGGLE,
    payload: data,
  }
}
export const layerToggle = (data) => {
  return {
    type: LAYER_TOGGLE,
    payload: data,
  }
}

export const updateXgrid = (data) => {
  return {
    type: UPDATE_XGRID,
    payload: data,
  }
}

export const updateYgrid = (data) => {
  return {
    type: UPDATE_YGRID,
    payload: data,
  }
}
export const updateZoom = (data) => {
  return {
    type: UPDATE_ZOOM,
    payload: data,
  }
}
export const appendTileset = (data) => {
  return {
    type: APPEND_TILESET,
    payload: data,
  }
}

export const updateSelectedLayer = (data) => {
  return {
    type: UPDATE_LAYER,
    payload: data,
  }
}

export const updateSelectedTileset = (data) => {
  return {
    type: UPDATE_SELECTED_TILESET,
    payload: data,
  }
}

export const updateSelectedTile = (data) => {
  return {
    type: UPDATE_SELECTED_TILE,
    payload: data,
  }
}

export const tileSelectEnable = (data) => {
  return {
    type: TILE_SELECT_ENABLED,
    payload: data,
  }
}

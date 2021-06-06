import { CLEAR_MAP_FLAG, TRIGGER_DRAW, CLEAR_MAP, UPDATE_PREVIEW_IMAGE, GOOD_ALERT, ERROR_ALERT, ADD_TILE, RESET_STATE, LOAD_STATE, UPDATE_STARTINGPOINT, DELETE_TILE, UPDATE_TILESET, IS_LOADING, DELETE_TILESET, SET_MODAL_TYPE, SHOW_MODAL, SIDEBAR_TOGGLE, UPDATE_SELECTED_TILESET, TILE_SELECT_ENABLED, UPDATE_SELECTED_TILE, PREVIEW_TOGGLE, LAYER_TOGGLE, UPDATE_XGRID, UPDATE_YGRID, UPDATE_ZOOM, APPEND_TILESET, UPDATE_LAYER } from "./eventTypes"
import produce from "immer"

const initialState = {
  loadingFlag: false,
  clearMapFlag: false,
  goodAlertMessage: "",
  errorAlertMessage: "",
  sideBarToggle: true,
  previewToggle: false,
  previewImage: null,
  gridCheckState: true,
  L0CheckState: true,
  L1CheckState: true,
  L2CheckState: true,
  L3CheckState: true,
  numXgrid: 20,
  numYgrid: 20,
  zoomLevel: 25,
  startingPoint: { startx: 400, starty: 75 },
  Tilesets: [],
  tsetIndex: 0,
  Layer: 0,
  selectedTileset: -1,
  selectedTile: [0, 0],
  tileSelectEnabled: false,
  showModal: false,
  ModalUpdate: true,
  isLoading: false,
  mainTileMap: [{}, {}, {}, {}, {}, {}, {}, {}], //the first 4 (0-3) objects are the L0-L3 tiles.
  //object 4 is walkability(0 for can't walk (walls), 1 for can walk)
  //object 5 is fog of war
  //object 6 is lighting
  //object 7 is eventtriggers (sounds and story)
}

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_MAP_FLAG:
      return {
        ...state,
        clearMapFlag: false,
      }

    case TRIGGER_DRAW:
      return {
        ...state,
        loadingFlag: action.payload,
      }

    case CLEAR_MAP: {
      return {
        ...state,
        mainTileMap: [{}, {}, {}, {}],
        clearMapFlag: true,
      }
    }

    case GOOD_ALERT: {
      return {
        ...state,
        goodAlertMessage: action.payload,
      }
    }

    case ERROR_ALERT: {
      return {
        ...state,
        errorAlertMessage: action.payload,
      }
    }

    case LOAD_STATE: {
      var state_object = JSON.parse(action.payload)

      return {
        ...state,
        goodAlertMessage: "",
        errorAlertMessage: "",
        sideBarToggle: state_object.sideBarToggle,
        previewToggle: state_object.previewToggle,
        previewImage: state_object.previewImage,
        gridCheckState: true,
        L0CheckState: true,
        L1CheckState: true,
        L2CheckState: true,
        L3CheckState: true,
        numXgrid: state_object.numXgrid,
        numYgrid: state_object.numYgrid,
        zoomLevel: state_object.zoomLevel,
        startingPoint: state_object.startingPoint,
        Tilesets: state_object.Tilesets,
        tsetIndex: state_object.tsetIndex,
        Layer: state_object.Layer,
        selectedTileset: state_object.selectedTileset,
        selectedTile: state_object.selectedTile,
        tileSelectEnabled: state_object.tileSelectEnabled,
        showModal: state_object.showModal,
        ModalUpdate: state_object.ModalUpdate,
        isLoading: state_object.isLoading,
        mainTileMap: state_object.mainTileMap,
      }
    }

    case RESET_STATE: {
      return {
        ...state,
        goodAlertMessage: "",
        errorAlertMessage: "",
        sideBarToggle: true,
        previewToggle: false,
        previewImage: null,
        gridCheckState: true,
        L0CheckState: true,
        L1CheckState: true,
        L2CheckState: true,
        L3CheckState: true,
        numXgrid: 20,
        numYgrid: 20,
        zoomLevel: 25,
        startingPoint: { startx: 400, starty: 75 },
        Tilesets: [],
        tsetIndex: 0,
        Layer: 0,
        selectedTileset: -1,
        selectedTile: [0, 0],
        tileSelectEnabled: false,
        showModal: false,
        ModalUpdate: true,
        isLoading: false,
        mainTileMap: [{}, {}, {}, {}],
      }
    }

    case UPDATE_PREVIEW_IMAGE: {
      return {
        ...state,
        previewImage: action.payload,
      }
    }

    case UPDATE_STARTINGPOINT: {
      return {
        ...state,
        startingPoint: action.payload,
      }
    }

    case UPDATE_TILESET: {
      //find index of tset passed
      var object = action.payload.Tileset

      var x = state.Tilesets.findIndex((tileset) => tileset.Tileset.TSet === action.payload.selectedTset)

      return produce(state, (draft) => {
        draft.Tilesets[x].Tileset.filename = object.filename
        draft.Tilesets[x].Tileset.Layer = object.Layer
        draft.Tilesets[x].Tileset.imgsrc = object.imgsrc
      })
    }
    case ADD_TILE: {
      var { key, coord, tSet, lyr } = action.payload

      return produce(state, (draft) => {
        draft.mainTileMap[lyr][key] = [tSet, coord]
      })
    }
    case DELETE_TILE: {
      var { key, coord, tSet, lyr } = action.payload

      return produce(state, (draft) => {
        delete draft.mainTileMap[lyr][key]
      })
    }
    case IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case DELETE_TILESET:
      return {
        ...state,
        Tilesets: state.Tilesets.filter((item) => item.Tileset.TSet !== action.payload),
      }

    case SET_MODAL_TYPE:
      return {
        ...state,
        ModalUpdate: action.payload,
      }

    case SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload,
      }

    case TILE_SELECT_ENABLED:
      return {
        ...state,
        tileSelectEnabled: action.payload,
      }

    case UPDATE_SELECTED_TILE:
      return {
        ...state,
        selectedTile: action.payload,
      }

    case UPDATE_SELECTED_TILESET:
      return {
        ...state,
        selectedTileset: action.payload,
      }

    case SIDEBAR_TOGGLE:
      return {
        ...state,
        sideBarToggle: action.payload,
      }

    case PREVIEW_TOGGLE:
      return {
        ...state,
        previewToggle: action.payload,
      }

    case LAYER_TOGGLE:
      var item, status
      item = action.payload.item
      status = action.payload.status

      switch (item) {
        case "input4":
          return {
            ...state,
            L0CheckState: status,
          }
        case "input5":
          return {
            ...state,
            L1CheckState: status,
          }
        case "input6":
          return {
            ...state,
            L2CheckState: status,
          }
        case "input7":
          return {
            ...state,
            L3CheckState: status,
          }

        case "input8":
          return {
            ...state,
            gridCheckState: status,
          }
        default:
          return state
      }

    case UPDATE_XGRID:
      return {
        ...state,
        numXgrid: action.payload,
      }

    case UPDATE_YGRID:
      return {
        ...state,
        numYgrid: action.payload,
      }

    case UPDATE_ZOOM:
      return {
        ...state,
        zoomLevel: action.payload,
      }

    case APPEND_TILESET:
      return {
        ...state,
        Tilesets: [...state.Tilesets, action.payload],
        tsetIndex: state.tsetIndex + 1,
      }

    case UPDATE_LAYER:
      return {
        ...state,
        Layer: action.payload,
      }

    default:
      return state
  }
}

export default eventReducer

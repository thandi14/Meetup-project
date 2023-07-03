import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/getGroups';
const GET_EVENTS = 'groups/getEvents'

const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

const getEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
}

export const getAllGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups')
    const data = await response.json();
    dispatch(getGroups(data.Groups));
    return response;
}

export const getEventsById = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}/events`)
    const data = await response.json();
    console.log(data)
    dispatch(getGroups(data));
    return response;
}

const initialState = {}

const groupsReducer = (state = initialState, action) => {
    let groups
    switch (action.type) {
        case GET_GROUPS:
        groups = action.groups
        return {
            ...state,
            ...groups
        }
        case GET_EVENTS:
        let events = action.events
        return {
            ...state,
            ...events
        }
      default:
        return state;
    }
};

export default groupsReducer

import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/getGroups';
const GET_DETAILS = 'groups/getDetails'

const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

const getDetails = (details) => {
    return {
        type: GET_DETAILS,
        details
    }
}

export const getAllGroups = () => async (dispatch) => {
    const response1 = await csrfFetch('/api/groups')
    const response2 = await csrfFetch(`/api/events`)
    const data1 = await response1.json();
    const data2 = await response2.json();
    data1.Groups['Events'] = data2.Events
    dispatch(getGroups(data1));
    return response1;
}



export const getDetailsById = (id) => async (dispatch) => {
    const response1 = await csrfFetch(`/api/groups/${id}`)
    const response2 = await csrfFetch(`/api/groups/${id}/events`)
    const data1 = await response1.json();
    const data2 = await response2.json()
    data1['Events'] = data2.Events
    dispatch(getDetails(data1));
    return response1;
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
        case GET_DETAILS:
        let details = action.details
        return {
            ...state,
            ...details
        }
      default:
        return state;
    }
};

export default groupsReducer

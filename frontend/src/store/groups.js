import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/getGroups';
const GET_DETAILS = 'groups/getDetails';
const REMOVE_GROUP = 'groups/removeGroup'

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

const removeGroup = () => {
    return {
        type: REMOVE_GROUP,
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

export const createGroup = (data, img) => async (dispatch) => {
    if (Object.values(data).length) {
        const response = await csrfFetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        })
        data = await response.json()
        let groupId = parseInt(data.id)
        let response1
        if (groupId) {
            response1 = await csrfFetch(`/api/groups/${data.id}`)
        }
        const data1 = await response1.json()

        dispatch(getDetails(data1))

        if (img) dispatch(addGroupImage(groupId, { url: img, preview: true}))

        return response
    }
}

export const updateGroup = (id, data) => async (dispatch) => {
    console.log(data)
    if (Object.values(data).length) {
        const response = await csrfFetch(`/api/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        })
        data = await response.json()
        dispatch(getDetails(data))
        return response
    }
}

export const deleteGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
    })
    let data = await response.json()
    dispatch(removeGroup(id))
    return response
}

export const addGroupImage = (id, data) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response
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
            ...details
        }
        case REMOVE_GROUP:
        const newState = { ...state };
        delete newState.id;
        return newState;
      default:
        return state;
    }
};

export default groupsReducer

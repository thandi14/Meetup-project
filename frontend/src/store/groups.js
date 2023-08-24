import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/getGroups';
const GET_USER_GROUPS = 'groups/getUserGroups';
const GET_DETAILS = 'groups/getDetails';
const REMOVE_GROUP = 'groups/removeGroup'

const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

const getUserGroups = (groups) => {
    return {
        type: GET_USER_GROUPS,
        groups
    }
}


const getDetails = (details) => {
    return {
        type: GET_DETAILS,
        details
    }
}

const removeGroup = (groupId) => {
    return {
        type: REMOVE_GROUP,
        groupId
    }
}


export const getAllGroups = () => async (dispatch) => {
    const response1 = await csrfFetch('/api/groups')
    const data1 = await response1.json();

    for (let g of data1.Groups) {
        const response2 = await csrfFetch(`/api/groups/${g.id}/events`)
        const data2 = await response2.json();
        g['Events'] = data2.Events

    }
    dispatch(getGroups(data1));
    return response1;
}


export const getAllUserGroups = () => async (dispatch) => {
    const response1 = await csrfFetch('/api/groups/current')
    const response3 = await csrfFetch(`/api/groups/other`)
    let data1 = await response1.json();
    let data3 = await response3.json();
    data1.Groups = data1.Groups.concat(data3.Groups)
    for (let g of data1.Groups) {
        const response2 = await csrfFetch(`/api/groups/${g.id}/events`)
        const data2 = await response2.json();
        g['Events'] = data2.Events

    }
    dispatch(getUserGroups(data1));
    return response1;
}




export const getDetailsById = (id) => async (dispatch) => {
    const response1 = await csrfFetch(`/api/groups/${id}`)
    const response2 = await csrfFetch(`/api/groups/${id}/events`)
    const response3 = await csrfFetch(`/api/groups/${id}/members`)
    const data1 = await response1.json();
    const data2 = await response2.json()
    const data3 = await response3.json();
    data1['Events'] = data2.Events
    data1['Members'] = data3.Members
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

export const createMembership = (id) => async (dispatch) => {

        const response = await csrfFetch(`/api/groups/${id}/membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            // body: JSON.stringify(data)
        })
        let data = await response.json()
        return data

}

export const deleteMembership = (id) => async (dispatch) => {
        const response = await csrfFetch(`/api/groups/${id}/membership`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
              },
            // body: JSON.stringify(data)
        })
        let data = await response.json()
        return data
}





export const updateGroup = (id, data, img) => async (dispatch) => {
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
        if (img) dispatch(addGroupImage(id, { url: img, preview: true}))
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

let initialState = {
    groups: {},
    userGroups: {},
    singleGroup: {}
};

function groupsReducer (state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
        newState = { ...state };
        action.groups.Groups.forEach(
          (group) => (newState.groups[group.id] = group)
        );
        return newState;
        case GET_USER_GROUPS:
        newState = { ...state };
        action.groups.Groups.forEach(
            (group) => (newState.userGroups[group.id] = group)
        );
        return newState;
        case GET_DETAILS:
        newState = { ...state };
        const group = action.details;
        newState.singleGroup = { ...group };
        return newState;
        case REMOVE_GROUP:
        // newState = {}
        // newState['state'] = state;
        // delete newState.state;
        // return newState;
        newState = { ...state };
        newState.groups = { ...newState.groups };
        newState.userGroups = { ...newState.userGroups };
        newState.singleGroup = {};
        delete newState.groups[action.groupId];
        delete newState.userGroups[action.groupId];
        return newState;
      default:
        return state;
    }
};

export default groupsReducer

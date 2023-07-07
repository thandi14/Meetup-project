import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getEvents';
const GET_DETAILS = 'events/getDetails';
const REMOVE_EVENT = 'events/removeEvent'

const getEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
}

const getDetails = (details) => {
    return {
        type: GET_DETAILS,
        details
    }
}

const removeEvent = (id) => {
    return {
        type: REMOVE_EVENT,
        id
    }
}

export const getAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')
    const data = await response.json();
    dispatch(getEvents(data));
    return response;
}

export const getDetailsById = (id) => async (dispatch) => {
    const response1 = await csrfFetch(`/api/events/${id}`)
    const data1 = await response1.json();
    const response2 = await csrfFetch(`/api/groups/${data1.groupId}`)
    const data2 = await response2.json()
    data1['Group'] = data2
    console.log(data1.groupId)
    dispatch(getDetails(data1));
    return response1;
}

export const createEvent = (data, img) => async (dispatch) => {
    const { name , description, type, capacity, price, startDate, endDate} = data
    console.log(data)
    if (Object.values(data).length) {
        const response = await csrfFetch(`/api/groups/${data.groupId}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                name,
                description,
                type,
                capacity,
                price,
                startDate,
                endDate
            })
        })
        data = await response.json()
        let eventId = parseInt(data.id)
        let response1
        if (eventId) {
            response1 = await csrfFetch(`/api/events/${data.id}`)
        }
        const data1 = await response1.json()
        dispatch(getDetails(data1))

        if (img) dispatch(addEventImage(eventId, { url: img, preview: true}))

        return response
    }
}

export const deleteEvent = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
    })
    let data = await response.json()
    dispatch(removeEvent(id))
    return response
}

export const addEventImage = (id, data) => async (dispatch) => {
    console.log(data)
    const response = await csrfFetch(`/api/events/${id}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response
}

const initialState = {}

const eventsReducer = (state = initialState, action) => {
    let events
    switch (action.type) {
        case GET_EVENTS:
        events = action.events
        return {
            ...state,
            ...events
        }
        case GET_DETAILS:
        let details = action.details
        return {
            ...details
        }
        case REMOVE_EVENT:
        const newState = { ...state };
        delete newState.id;
        return newState;
      default:
        return state;
    }
};

export default eventsReducer

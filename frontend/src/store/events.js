import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getEvents';
const GET_DETAILS = 'events/getDetails';

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

export const getAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')
    const data = await response.json();
    dispatch(getEvents(data.Events));
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
            ...state,
            ...details
        }
      default:
        return state;
    }
};

export default eventsReducer

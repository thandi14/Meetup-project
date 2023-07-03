import { csrfFetch } from "./csrf";

const GET_EVENTS = 'groups/getEvents'

const getEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
}

export const getAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')
    const data = await response.json();
    dispatch(getEvents(data.Events));
    return response;
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
      default:
        return state;
    }
};

export default eventsReducer

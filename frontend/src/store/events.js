import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getEvents';
const GET_ATTENDANCE = 'events/getAttendance';
const GET_DETAILS = 'events/getDetails';
const GET_USER_EVENTS = 'groups/getUserEvents';
const REMOVE_EVENT = 'events/removeEvent'
const REMOVE_ATTENDANCE = 'events/removeAttendance'

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

const getUserEvents = (events) => {
    return {
        type: GET_USER_EVENTS,
        events
    }
}

const removeAttendance = (eventId, userId) => {
    return {
        type: REMOVE_ATTENDANCE,
        eventId,
        userId
    }
}

const getAttendance = (events) => {
    return {
        type: GET_ATTENDANCE,
        events
    }
}

const removeEvent = (eventId) => {
    return {
        type: REMOVE_EVENT,
        eventId
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

export const getAllUserEvents = () => async (dispatch) => {
    const response1 = await csrfFetch('/api/events/current')
    const response2 = await csrfFetch('/api/events/other')
    let data1 = await response1.json();
    let data2 = await response2.json()
    data1.userEvents = data1.userEvents.concat(data2.userEvents)
    dispatch(getUserEvents(data1));
    return response1;
}


export const createEvent = (data, img) => async (dispatch) => {
    const { name , description, type, capacity, price, startDate, endDate} = data
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

export const createAttendance = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/events/${id}/attendance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        // body: JSON.stringify(data)
    })
    let data = await response.json()
    dispatch(getAttendance(data))
    return data

}

export const getAllAttendance = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/events/${id}/attendees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
          },
        // body: JSON.stringify(data)
    })
    let data = await response.json()
    dispatch(getAttendance(data))
    return data

}


export const deleteAttendance = (id, userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}/attendance`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
        // body: JSON.stringify(data)
    })
    let data = await response.json()
    dispatch(removeAttendance(id, userId))
    console.log("STORE", data)
    return data
}


export const updateEvent = (id, data, img) => async (dispatch) => {
    const { name , description, type, capacity, price, startDate, endDate} = data
    console.log(data)
    if (Object.values(data).length) {
        const response = await csrfFetch(`/api/events/${id}`, {
            method: 'PUT',
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

let initialState = {
    events: {},
    userEvents: {},
    singleEvent: {},
    eventAttendances: {}

};

const eventsReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case GET_EVENTS:
        newState = { ...state };
        action.events.Events.forEach(
            (event) => (newState.events[event.id] = event)
        );
        return newState
        case GET_ATTENDANCE:
        newState = { ...state };
        action.events.Attendees.forEach(
          (event) => (newState.eventAttendances[event.userId] = event)
        );
        return newState;
        case GET_USER_EVENTS:
        newState = { ...state };
        action.events.userEvents.forEach(
            (event) => (newState.userEvents[event.id] = event)
        );
        return newState;
        case GET_DETAILS:
        newState = { ...state };
        const event = action.details;
        newState.singleEvent = { ...event };
        return newState
        case REMOVE_EVENT:
        // newState = {}
        // newState['state'] = state;
        // delete newState.state;
        newState = { ...state };
        newState.events = { ...newState.events };
        newState.userEvents = { ...newState.userEvents };
        newState.singleEvent = {};
        delete newState.events[action.eventId];
        delete newState.userEvents[action.eventId];
        return newState;
        case REMOVE_ATTENDANCE:
        newState = { ...state };
        newState.userEvents = { ...newState.userEvents };
        newState.eventAttendances = { ...newState.eventAttendances };
        delete newState.eventAttendances[action.userId];
        delete newState.userEvents[action.eventId];
        return newState;
      default:
        return state;
    }
};

export default eventsReducer

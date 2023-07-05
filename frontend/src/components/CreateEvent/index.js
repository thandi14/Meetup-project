import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"


function CreateEvent() {
    const group = useSelector((store) => store.groups)
    const { id } = useParams()
    const [ data, setData ] = useState({})
    const [ name, setName ] = useState('')
    const [ type, setType ] = useState('')
    const [ price, setPrice ] = useState(0)
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')
    const [ capacity, setCapacity ] = useState(0)
    const [ description, setDescription ] = useState('')
    const  [ errors, setErrors ] = useState({})

    console.log(id)

    console.log(group)
    const handleSubmit = () => {
        const es = {}

        if (!name) {
            es['name'] = 'Name is required'
        }
        if (!type) {
            es['type'] = 'Event type is required'
        }
        if (capacity === 0) {
            es['capacity'] = 'Capacity is required'
        }
        if (!endDate) {
            es['endDate'] = 'Event end is required'
        }
        if (!startDate) {
            es['startDate'] = 'Event start is required'
        }
        if (description.length < 30) {
            es['description'] = 'Description is required'
        }


    }

    return (
        <div>
            <h1>Create an event for group name</h1>
            <div>
            <p>What is the name of the event?</p>
            <input type='text' placeholder="Event name"></input>
            </div>
            <div className='divider'></div>
            <div>
            <p>Is this an in person or online event?</p>
            <select>
                <option value=''>(select one)</option>
                <option value='In person'>in person</option>
                <option value='Online'>online</option>
            </select>
            <p>How many people can attend?</p>
            <input type='number'></input>
            <p>What is the price for your event?</p>
            <input type='number'></input>
            </div>
            <div className='divider'></div>
            <div>
            <p>When does your event start?</p>
            <input type='datetime-local'></input>
            <p>When does your event end?</p>
            <input type='datetime-local'></input>
            </div>
            <div className='divider'></div>
            <div>
            <p>Please add an image url for your event below:</p>
            <input type='text'></input>
            </div>
            <div className='divider'></div>
            <div>
            <p>Please describe your event:</p>
            <input type='text'></input>
            <button onClick={handleSubmit} >CreateEvent</button>
            </div>
        </div>
    )
}

export default CreateEvent

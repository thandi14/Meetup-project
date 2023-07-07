import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import * as eventActions from '../../store/events'
import LoadingScreenTwo from "../LoadingScreen2"
import './CreateEvent.css'

function CreateEvent() {
    const event = useSelector((store) => store.events)
    const group = useSelector((store) => store.groups)
    const { id } = useParams()
    const dispatch = useDispatch()
    const [ data, setData ] = useState({})
    const [ name, setName ] = useState('')
    const [ type, setType ] = useState('')
    const [ price, setPrice ] = useState(0)
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')
    const [ capacity, setCapacity ] = useState(0)
    const [ description, setDescription ] = useState('')
    const  [ errors, setErrors ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)
    const [ previewImage, setPreviewImage ] = useState('event')


    useEffect(() => {
        dispatch(eventActions.createEvent(data, previewImage))
    }, [dispatch, data, previewImage])


    console.log(group)
    const handleSubmit = () => {
        const es = {}
        const validExtensions = ['.jpg', '.jpeg', '.png'];

        let hasValidExtension

        if (previewImage) {
             hasValidExtension = validExtensions.some(extension =>
                previewImage.toLowerCase().includes(extension)
            );

        }

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
            es['description'] = 'Description must be at least 30 characters long'
        }
        if (previewImage && !hasValidExtension) {
            es['previewImage'] = "Image URL must end in .png, .jpg, or .jpeg"
        }

        setErrors(es)

        if (Object.values(es).length === 0) {

           let request = {
                groupId: id,
                name,
                description,
                type,
                capacity,
                price,
                startDate,
                endDate
            }

            setData(request);

            setIsLoading(true)

            setName('')
            setDescription('')
            setType('')
            setCapacity('')
            setPrice('')
            setStartDate('')
            setEndDate('')
        }

    }

    console.log(group)

    return (
        <div>
            {!isLoading ?
            <div className='formEvent'>
            <h1>Create an event for '{group ? group.name : null}'</h1>
            <div className='createName2'>
            <p className='pEvents'>What is the name of the event?</p>
            <input className='inputEvent' onChange={((e) => setName(e.target.value))} type='text' placeholder="Event name"></input>
            </div>
            {errors.name && <p className='error'>{errors.name}</p>}
            <div className='divider'></div>
            <div className='createType2'>
            <p className='pEvents'>Is this an in person or online event?</p>
            <select className='inputEventType' onChange={((e) => setType(e.target.value))}>
                <option value=''>(select one)</option>
                <option value='In person'>in person</option>
                <option value='Online'>online</option>
            </select>
            {errors.type && <p className='error'>{errors.type}</p>}
            <p className="pEvents">How many people can attend?</p>
            <input className='inputEventType' onChange={((e) => setCapacity(e.target.value))} type='number'></input>
            {errors.capacity && <p className='error'>{errors.capacity}</p>}
            <p className='pEvents'>What is the price for your event?</p>
            <input placeholder='$' className='inputEventPrice' onChange={((e) => setPrice(e.target.value))} type='number'></input>
            </div>
            <div className='divider'></div>
            <div className='createDate2'>
            <p className='pEvents'>When does your event start?</p>
            <input className='inputEventDate' onChange={((e) => setStartDate(e.target.value))} type='datetime-local'></input>
            {errors.startDate && <p className='error'>{errors.startDate}</p>}
            <p className='pEvents'>When does your event end?</p>
            <input className='inputEventDate' onChange={((e) => setEndDate(e.target.value))} type='datetime-local'></input>
            </div>
            {errors.endDate && <p className='error'>{errors.endDate}</p>}
            <div className='divider'></div>
            <div className='createImage2'>
            <p className='pEvents'>Please add an image url for your event below:</p>
            <input onChange={((e) => setPreviewImage(e.target.value))} placeholder='imageUrl' className='inputEvent' type='text'></input>
            </div>
            <div className='divider'></div>
            <div className='createFinale2'>
            <p className='pEvents'>Please describe your event:</p>
            <textarea placeholder='Please include at least 30 characters' className='textareaEvent' value={description} onChange={((e) => setDescription(e.target.value))} type='text'></textarea>
            {errors.description || description.length < 31 && description.length >= 1 ? <p className='error'>Please write at least 30 characters</p> : <div></div>}
            <button className='eventButton2' onClick={handleSubmit} >Create Event</button>
            </div>
            </div>
             : <LoadingScreenTwo event={'events'}/> }
        </div>
    )
}

export default CreateEvent

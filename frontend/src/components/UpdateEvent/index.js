import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import * as eventActions from '../../store/events'
import LoadingScreenTwo from "../LoadingScreen2"
import '../CreateEvent/CreateEvent.css'

function UpdateEvent() {
    const event = useSelector((store) => store.events)
    const group = useSelector((store) => store.groups)
    const { id } = useParams()
    const dispatch = useDispatch()
    const [ data, setData ] = useState({})
    const [ name, setName ] = useState('')
    const [ type, setType ] = useState('')
    const [ price, setPrice ] = useState(0)
    const [ startDate, setStartDate ] = useState("")
    const [ endDate, setEndDate ] = useState("")
    const [ capacity, setCapacity ] = useState(0)
    const [ description, setDescription ] = useState('')
    const  [ errors, setErrors ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)
    const [ previewImage, setPreviewImage ] = useState('')


    useEffect(() => {
        dispatch(eventActions.updateEvent(id, data, previewImage))
        dispatch(eventActions.getDetailsById(id))
    }, [dispatch, data, previewImage])

    console.log(event)

    console.log(new Date(startDate) > new Date())
    const handleSubmit = () => {
        const es = {}
        const validExtensions = ['.jpg', '.jpeg', '.png'];

        let hasValidExtension

        if (previewImage) {
             hasValidExtension = validExtensions.some(extension =>
                previewImage.toLowerCase().endsWith(extension)
            );

        }

        if (!name) {
            es['name'] = 'Name is required'
        }
        if (name && name.length < 5) {
            es['n'] = "Name must be at least 5 characters"
        }
        if (!type) {
            es['type'] = 'Event type is required'
        }
        if (capacity <= 0) {
            es['capacity'] = 'Capacity is required'
        }
        if (!endDate) {
            es['endDate'] = 'Event end is required'
        }
        if (!startDate) {
            es['startDate'] = 'Event start is required'
        }
        if (startDate && new Date(startDate) < new Date()) {
            es['startDate'] = "Start date muse be in the future"
        }
        if (endDate && startDate && new Date(startDate) > new Date(endDate)) {
            es['endDate'] = "End date must end after start date"
        }
        if (description.length < 30) {
            es['description'] = 'Description must be at least 30 characters long'
        }
        if (previewImage && !hasValidExtension) {
            es['previewImage'] = "Image URL must end in .png, .jpg, or .jpeg"
        }
        if (!price || price <= -1 ) {
            es['price'] = "Price is required"
        }


        setErrors(es)

        console.log(es)
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
        else if (!name || !capacity || !price || !type) {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth' // Optionally, use smooth scrolling animation
              });
        }

    }

    console.log(group)

    return (
        <div id="seven-eleven">
            {!isLoading ?
            <div className='formEvent'>
            <h1>Update your event</h1>
            <div className='createName2'>
            <p className='pEvents'>What is the name of your event?</p>
            <input defaultValue={event.name} className='inputEvent' onChange={((e) => setName(e.target.value))} type='text' placeholder="Event name"></input>
            </div>
            {errors.name && <p className='error'>{errors.name}</p>}
            {name.length < 5 && name.length >= 1 && <p className='error'>{"Name must be at least 5 characters"}</p>}
            <div className='divider'></div>
            <div className='createType2'>
            <p className='pEvents'>Is this an in person or online event?</p>
            <select defaultValue={event.type === "In person" ? 'In person' : 'Online'} className='inputEventType' onChange={((e) => setType(e.target.value))}>
                <option value=''>(select one)</option>
                <option value='In person' >in person</option>
                <option value='Online'>online</option>
            </select>
            {errors.type && <p className='error'>{errors.type}</p>}
            <p className="pEvents">How many people can attend?</p>
            <input defaultValue={event.capacity} className='inputEventType' onChange={((e) => setCapacity(e.target.value))} type='number'></input>
            {errors.capacity && <p className='error'>{errors.capacity}</p>}
            <p className='pEvents'>What is the price for your event?</p>
            <input defaultValue={event.price} placeholder='$ 0' className='inputEventPrice' onChange={((e) => setPrice(e.target.value))} type='number'></input>
            {errors.price && <p className='error'>{errors.price}</p>}
            </div>
            <div className='divider'></div>
            <div className='createDate2'>
            <p className='pEvents'>When does your event start?</p>
            <input defautValue={event.startDate} className='inputEventDate' onChange={((e) => setStartDate(e.target.value))} type='datetime-local'></input>
            {errors.startDate && <p className='error'>{errors.startDate}</p>}
            <p className='pEvents'>When does your event end?</p>
            <input defaultValue={event.endDate} className='inputEventDate' onChange={((e) => setEndDate(e.target.value))} type='datetime-local'></input>
            </div>
            {errors.endDate && <p className='error'>{errors.endDate}</p>}
            <div className='divider'></div>
            <div className='createImage2'>
            <p className='pEvents'>Please add an image url for your event below:</p>
            <input defaultValue={event.EventImages?.length ? event.EventImages[0].url : null} onChange={((e) => setPreviewImage(e.target.value))} placeholder='imageUrl' className='inputEvent' type='text'></input>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}
            </div>
            <div className='divider'></div>
            <div className='createFinale2'>
            <p className='pEvents'>Please describe your event:</p>
            <textarea defaultValue={event.description} placeholder='Please include at least 30 characters' className='textareaEvent' onChange={((e) => setDescription(e.target.value))} type='text'></textarea>
            {errors.description || description.length < 31 && description.length >= 1 ? <p className='error'>Please write at least 30 characters</p> : <div></div>}
            {description.length > 30 ? delete errors.description : null}
            <button className='eventButton2' onClick={handleSubmit} >Update Event</button>
            </div>
            </div>
             : <LoadingScreenTwo updateE={'update'}/> }
        </div>
    )
}

export default UpdateEvent

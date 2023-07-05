import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import * as groupActions from '../../store/groups'
import LoadingScreenTwo from "../LoadingScreen2"
import './UpdateGroup.css'

function UpdateGroup() {
    const { id } = useParams()
    const [ location, setLocation ] = useState('');
    const [ name, setName ] = useState('');
    const [ about, setAbout] = useState('');
    const [ type, setType ] = useState('');
    const [ priv, setPriv ] = useState('')
    const [ data, setData ] = useState({})
    const [ errors, setErrors ] = useState({})
    const dispatch = useDispatch()
    const group = useSelector((store) => store.groups)
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        dispatch(groupActions.updateGroup(id, data))
    }, [dispatch, data])

        console.log(group)



        const handleSubmit = () => {
            const es = {}

            if (!name) {
                es['name'] = "Name is required"
            }
            if (!location) {
                es['location'] = 'Location is required'
            }
            if (!location.includes(',')) {
                es['location'] = 'Invalid format (city, state)'
            }
            if (about.length < 30) {
                es['about'] = 'Description must be at least 30 characters long'
            }
            if (!type) {
                es['type'] = 'Group type is required'
            }
            if (priv === '') {
                es['priv'] = "Visibility type is required"
            }

            setErrors(es)

            let locate = location.split(', ')
            if (locate.length === 1) {
                locate = locate[0].split(',')
            }

            let city = locate[0];
            let state = locate[1]

            if (Object.values(es).length === 0) {
                const request = {
                    name,
                    about,
                    type,
                    city,
                    state
                }

                request['private'] = priv
                setData(request)

                setName('');
                setAbout('');
                setType('');
                setLocation('');
                setPriv('');
                setIsLoading(true)
            }

        }

        console.log(isLoading)


    return (
        <div>
            {!isLoading ?
            <div className='formGroup'>
            <div className='introCreate'>
            <h2 className='formTitle'>UPDATE YOUR GROUPS INFORMATION</h2>
            <h1>We'll walk you through a few steps to build your local community</h1>
            </div>
            <div className='divider'></div>
            <div className='createLocation'>
            <h1>First, set your group's location.</h1>
            <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area and more can join you online.</p>
            <input className='inputGroup' type='text' placeholder="City, STATE" onChange={((e) => setLocation(e.target.value))}></input>
            {errors.location && <p className='error'>{errors.location}</p>}
            </div>
            <div className='divider'></div>
            <div className='createName'>
            <h1>What will your groups name be?</h1>
            <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <input className='inputGroup' type='text' placeholder="What is you group name?" onChange={((e) => setName(e.target.value))}></input>
            {errors.name && <p className='error'>{errors.name}</p>}
            </div>
            <div className='divider'></div>
            <div className='createAbout'>
            <h1>Now describe what your group will be about.</h1>
            <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <p> 1. What's the purpose of the group? <br></br>
                 2. Who should join? <br></br>
                 3. What will you do at your events?</p>
            <textarea className='textareaGroup' placeholder="Please write atleast 30 characters" onChange={((e) => setAbout(e.target.value))}></textarea>
            {errors.about && <p className='error'>{errors.about}</p>}
            </div>
            <div className='divider'></div>
            <div className='createFinale'>
            <h1>Final steps...</h1>
            <p>Is this an in person or online group?</p>
            <select className='selectEvent2' onChange={((e) => setType(e.target.value))}>
                <option value=''>(select one)</option>
                <option value='In person'>in person</option>
                <option value='Online'>online</option>
            </select>
            {errors.type && <p className='error'>{errors.type}</p>}
            <p>Is this group private or public?</p>
            <select className='selectEvent2' onChange={((e) => e.target.value == 'true' ? setPriv(true) : setPriv(false))}>
                <option >(select one)</option>
                <option value='true'>private</option>
                <option value='false'>public</option>
            </select>
            {errors.priv && <p className='error'>{errors.priv}</p>}
            <p>Please add an image url for your group below:</p>
            <input className='inputGroup' type="text" placeholder="Image url"></input>
            </div>
            <div className='divider'></div>
            <button className='formButton' onClick={handleSubmit}>Update group</button>
                </div>
            : <LoadingScreenTwo />}
        </div>
    )
}

export default UpdateGroup

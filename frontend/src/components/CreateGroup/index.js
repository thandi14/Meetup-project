import { useState, useEffect } from "react";
import * as groupActions from '../../store/groups'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/";
import LoadingScreenTwo from "../LoadingScreen2";
import './CreateGroup.css'

function CreateGroup() {
    const [ location, setLocation ] = useState('');
    const [ name, setName ] = useState('');
    const [ about, setAbout] = useState('');
    const [ type, setType ] = useState('');
    const [ priv, setPriv ] = useState('')
    const [ data, setData ] = useState({})
    const [ errors, setErrors ] = useState({})
    const [ previewImage, setPreviewImage ] = useState('')
    const dispatch = useDispatch()
    const group = useSelector((store) => store.groups)
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        dispatch(groupActions.createGroup(data, previewImage))
    }, [dispatch, data, previewImage])


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
                es['name'] = "Name is required"
            }
            if (name.length > 60) {
                es['n'] = "Name must be less than 60 characters"
            }
            if (!location) {
                es['location'] = 'Location is required'
            }
            if (!location.includes(',')) {
                es['location'] = 'Invalid format (city, state)'
            }
            if (about.length < 50) {
                es['about'] = 'Description must be at least 50 characters long'
            }
            if (!type) {
                es['type'] = 'Group type is required'
            }
            if (!priv || priv === '') {
                es['priv'] = "Visibility type is required"
            }
            if (!previewImage || previewImage && !hasValidExtension) {
                es['previewImage'] = "Image URL must end in .png, .jpg, or .jpeg"
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
                    state,
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
            else if (!name || !location) {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
            }

        }


    return (
        <div>
            {!isLoading ?
            <div className='formGroup'>
            <div className='introCreate'>
            <h2 className='formTitle'>START A NEW GROUP</h2>
            <h1>We'll walk you through a few steps to build your local community</h1>
            </div>
            <div className='divider'></div>
            <div className='createLocation'>
            <h1>Set your group's location.</h1>
            <p>Meetus groups meet locally, in person and online. We'll connect you with people in your area.</p>
            <input className='inputGroup' type='text' placeholder="City, STATE" onChange={((e) => setLocation(e.target.value))}></input>
            {errors.location && <p className='error'>{errors.location}</p>}
            </div>
            <div className='divider'></div>
            <div className='createName'>
            <h1>What will your groups name be?</h1>
            <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <input className='inputGroup' type='text' placeholder="What is your group name?" onChange={((e) => setName(e.target.value))}></input>
            {errors.name && <p className='error'>{errors.name}</p>}
            {name.length > 60 && <p className='error'>{"Name must be less than 60 characters"}</p>}
            </div>
            <div className='divider'></div>
            <div className='createAbout'>
            <h1>Describe the purpose of your group.</h1>
            <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <p className='numbers'> 1. What's the purpose of the group? <br></br>
                 2. Who should join? <br></br>
                 3. What will you do at your events?</p>
            <textarea className='textareaGroup' placeholder="Please write at least 50 characters" onChange={((e) => setAbout(e.target.value))} value={about} ></textarea>
            {errors.about || about.length < 51 && about.length >= 1 ? <p className='error'>Please write at least 50 characters</p> : <div></div>}
            {about.length > 50 ? delete errors.about : null}
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
            <input onChange={((e) => setPreviewImage(e.target.value))} className='inputGroup' type="text" placeholder="Image url"></input>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}
            </div>
            <div className='divider'></div>
            <button className='formButton' onClick={handleSubmit}>Create Group</button>
                </div>
            : <LoadingScreenTwo group={'groups'}/>}
        </div>
    )

}
export default CreateGroup

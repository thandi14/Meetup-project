

function CreateGroup() {
    return (
        <div>
            <div className='introCreate'>
            <h2>BECOME AN ORGANIZER</h2>
            <h1>We'll walk you through a few steps to build your local community</h1>
            </div>
            <div className='divider'></div>
            <div className='createLocation'>
            <h1>First, set your group's location.</h1>
            <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area and more can join you online.</p>
            <input type='text' placeholder="City, STATE"></input>
            </div>
            <div className='divider'></div>
            <div className='createName'>
            <h1>What will your groups name be?</h1>
            <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <input type='text' placeholder="What is you group name?"></input>
            </div>
            <div className='divider'></div>
            <div className='createAbout'>
            <h1>Now describe what your group will be about.</h1>
            <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
            <p> 1, What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
            <textarea placeholder="Please write atleast 30 characters"></textarea>
            </div>
            <div className='divider'></div>
            <div className='createFinale'>
            <h1>Final steps...</h1>
            <p>Is this an in person or online group?</p>
            <select></select>
            <p>Is this group private or public?</p>
            <select></select>
            <p>Please add an image url for your group below:</p>
            <input type="text" placeholder="Image url"></input>
            </div>
            <div className='divider'></div>
            <button>Create group</button>
        </div>
    )
}

export default CreateGroup

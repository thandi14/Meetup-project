import { Link } from "react-router-dom"
import './Home.css'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session'

function HomePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
     dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
        <section className="one">
        <div className='intro'>
        <h1 className='oneText'>The people platform- Where interests become friendships</h1>
        <p className='oneP'>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
        </div>
        <div>
        <img className='imgOne' src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080'></img>
        </div>
        </section>
        <section className='two'>
            <h2 className='twoText'>How Meetup works</h2>
            <caption className='twoCap'>Meet new people who share your interests through online and in-person events. It’s free to create an account.</caption>
        </section>
        <section className='three'>
            <div className="group">
            <img className='groupImg'src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384'></img>
            <Link className ='groupLink' to='/groups'>See all groups</Link>
            <caption className='groupText'>Do what you love, meet others who love it, find your community. The rest is history!</caption>
            </div>
            <div className="event">
            <img className='eventImg'src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384'></img>
            <Link className='eventLink' to='/events'>Find an event</Link>
            <caption className="eventText">Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</caption>
            </div>
            <div className="start">
            <img className= 'startImg'src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384'></img>
            {!isLoaded ? <div className='startLinkOff'>Start a new group</div> : <Link className='startLink' to='/'>Start a new group</Link>}
            <caption className='startText'>You don’t have to be an expert to gather people together and explore shared interests.</caption>
            </div>
        </section>
        <section className='four'>
            {isLoaded ? <div></div> : <button className='button'> Join Meetup</button>}
        </section>
        </>
    )
}


export default HomePage

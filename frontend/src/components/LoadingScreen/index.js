import { useHistory } from "react-router-dom/"
import { useSelector } from "react-redux/es/hooks/useSelector"
import './LoadingScreen.css'

function LoadingScreen() {

    return (
        <div className="backgroundLoad">
            <img className='load' src='https://www.crmcrate.com/wp-content/uploads/2022/09/Spinner-0.6s-363px.gif'></img>
        </div>
    )
}

export default LoadingScreen

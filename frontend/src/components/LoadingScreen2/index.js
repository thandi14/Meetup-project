import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"

function LoadingScreenTwo() {
    const groupDetails = useSelector((store) => store.groups)
    const dispatch = useDispatch()

    const history = useHistory()

    console.log(groupDetails)

    setTimeout(() => {
        if (groupDetails.id) {
              history.push(`/groups/${groupDetails.id}`)
        }
    }, 5000)

    return (
        <div>Loading</div>
    )
}

export default LoadingScreenTwo

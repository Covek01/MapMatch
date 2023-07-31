import {Button} from "@mui/material"
import UserService from "Services/UserService"
import RequestUtilityFactory from "Components/profile_page/objects/RequestUtilityFactory"
import { useState } from "react"

const UnfriendButton = (user, isFriend) => {

    const utility = RequestUtilityFactory.createRequestUlilityByName("Friend request")

    const [isFriendHere, setIsFriendHere] = useState(isFriend)



    return (
        <Button sx={{fontSize:"12px"}} variant="contained"
                color="secondary"
                onClick={async (e) => {
                utility.unfriendFromMe(user.user.id)
                setIsFriendHere(false)
                }}
                >Unfriend
        </Button>
    )
}

export default UnfriendButton
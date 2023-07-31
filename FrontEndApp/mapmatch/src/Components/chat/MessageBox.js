import UserService from 'Services/UserService'
import { useState, useEffect, Box } from 'react'
import randomColor from 'randomcolor'
const MessageBox = ({ message }) => {
    const [comesFromMe, setComesFromMe] = useState(false)

    useEffect(() => {
        const doesItComeFromMe = async () => {
            const myusername = (await UserService.getMyUsername()).data
            if (message.user === myusername) {
                setComesFromMe(true)
                console.log(comesFromMe)
            }
            console.log(comesFromMe)
        }

        doesItComeFromMe()
    }, [])

    return (
        <div>
            {comesFromMe && (
                <div className="message-div-to-make-it-flex-me">
                    <div>
                        <div className="message-bg-primary-me">
                            <div className="message-text">
                                {message.message}
                            </div>
                        </div>
                        <div className="from-user">{message.user}</div>
                    </div>
                </div>
            )}
            {!comesFromMe && (
                <div className="message-div-to-make-it-flex">
                    <div>
                        <div
                            className="message-bg-primary"
                        >
                            <div className="message-text">
                                {message.message}
                            </div>
                        </div>
                        <div className="from-user">{message.user}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageBox

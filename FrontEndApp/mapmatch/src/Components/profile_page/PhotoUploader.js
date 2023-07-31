import { ContactPageSharp } from '@mui/icons-material'
import UserService from 'Services/UserService'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function PhotoUploadComponent({ setNewPhoto }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [uint8ArrayNew, setUint8ArrayNew] = useState(null)
    const [id, setId] = useState(null)
    useEffect(() => {
        const getMyId = async () => {
            try {
                const { data, status } = await UserService.getMyId()
                if (status == 200) {
                    setId(data)
                    console.log(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        getMyId()
    }, [])
    // useEffect(() => {
    //     const setPhoto = async () => {
    //         try {
    //             const ph = uint8ArrayNew.toString()
    //             const { data, status } = await UserService.setProfilePhoto(
    //                 id,
    //                 ph
    //             )
    //             if (status == 200) {
    //                 console.log(data)
    //             }
    //         } catch (error) {
    //             if (axios.isAxiosError(error)) {
    //                 console.error(error.message)
    //             }
    //         }
    //     }

    //     setPhoto()
    // }, [id, uint8ArrayNew])

    const handlePhotoChange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        const photoUrl = URL.createObjectURL(file)

        reader.onload = (event) => {
            setSelectedPhoto(reader.result)
            console.log(event)
            let uint8Array
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1] // Extract base64 string
                const binaryString = window.atob(base64String) // Decode base64 string to binary
                const length = binaryString.length
                uint8Array = new Uint8Array(length)
                for (let i = 0; i < length; i++) {
                    uint8Array[i] = binaryString.charCodeAt(i) // Assign binary values to uint8Array
                }
            } else {
                uint8Array = new Uint8Array(reader.result)
            }
            setNewPhoto(uint8Array.buffer)
            setUint8ArrayNew(uint8Array)
        }

        reader.readAsDataURL(file)

        // setNewPhoto(photoUrl)
    }

    return (
        <div className="popup-container">
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {selectedPhoto && (
                <div>
                    <img
                        src={selectedPhoto}
                        alt="Uploaded Photo"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                </div>
            )}
        </div>
    )
}

export default PhotoUploadComponent

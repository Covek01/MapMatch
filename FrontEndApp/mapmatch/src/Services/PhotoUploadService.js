import { responsiveFontSizes } from "@mui/material";
import axios from "axios";
import { axiosInstance } from "utils/http";


const apiKey = "6d207e02198a847aa98d0a2a901485a5";

class PhotoUploadService {

    UploadPhotoToApi(img) {
        
    return axios.post(`https://www.filestackapi.com/api/store/S3?key=Am2E2oJEiR8CMRAGd1Aimz`,img,{
        headers:{
            'Content-Type':'image/png'
        }
    })

    }

    
}


export default new PhotoUploadService()

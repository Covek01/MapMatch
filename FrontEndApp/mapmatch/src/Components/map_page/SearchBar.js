import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import UserService from 'Services/UserService';
import axios from 'axios';
import { useSnackbar } from "Context/SnackbarContext/SnackbarContext";
import { useSearchParams } from 'react-router-dom';


export default function SearchBar({ setSelectedUserIndex, otherUsersData,
  userId, setSearchClicked }) {
  const [initialSearch, setInitialSearch] = React.useState(true);

  const [searchText, setSearchText] = React.useState("");
  const { openSnackbar } = useSnackbar();
  const [isVisibl, setIsVisible] = React.useState(null);
  let [searchParams, setSearchParams] = useSearchParams();


  const [profileUsername, setProfileUsername] = React.useState(null);



  // useEffect(()=>{
  //     setProfileUsername(searchParams.get("focus"));
  //     console.log(searchParams.get("focus"), "OVO SU SEARCH PARAMETRI");
  // },[])

  // React.useEffect(() => {
  //   if(profileUsername!=null){
  //     setSearchText(profileUsername);
  //   }

  // }, [profileUsername]);

  // React.useEffect(()=>{
  //   if(searchText===profileUsername){
  //     console.log(otherUsersData, "DA VIDIM DAL SU UCITANIII");
  //     handleSearch();
  //   }
  // },[searchText])

  // React.useEffect(() => {

  //   setSearchText(searchParams.get("focus"));
  //   handleSearch();

  // }, [otherUsersData])

  React.useEffect(() => {
    if (initialSearch) {
      let pom = null;
      const checkVisibility = async () => {
        try {
          const { data, status } = await UserService.canBeSeen(userId, searchParams.get("focus"));
          if (status == 200) {
            setIsVisible(data);
            pom = data;
            return data;
          }

        } catch (error) {
          if (axios.isAxiosError(error)) {

            openSnackbar({ message: "User not on the map", severity: "info" });
          }
        }
      }
      
        if (checkVisibility()) {

          if (handleSearch()) {
            setInitialSearch(false);
          }
        } else {
          setInitialSearch(false);
          if (searchParams != "") {
            openSnackbar({ message: "User not on the map", severity: "info" });
          }
        }
      
    }

  }, [otherUsersData])

  function handleSearchParamSet() {
    if (searchText === searchParams.get("focus")) {
      handleSearch();
    }
    setSearchParams(`focus=${searchText}`);
  }


  function handleSearch() {
    const getIdByUsername = async () => {
      try {
        const { data, status } = await UserService.getIdFromUsername(searchParams.get("focus"));
        if (status == 200) {
          let found = false;
          for (let i = 0; i < otherUsersData.length; i++) {
            if (data == otherUsersData[i].id) {
              setSelectedUserIndex(data);
              found = true;
              setInitialSearch(false);
              setSearchClicked((prev) => !prev);

            }
          }
          if (!found && searchText != "") {
            setSelectedUserIndex(-1);
            openSnackbar({ message: "User not on the map", severity: "info" });
          }
        }
        else {
          setSelectedUserIndex(-1);
          openSnackbar({ message: "User not on the map", severity: "info" });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setSelectedUserIndex(-1)
          openSnackbar({ message: "User not on the map", severity: "info" });
        }
      }
    }
    if (searchText != "" || initialSearch == true) {

      getIdByUsername();
    } else {
      setSelectedUserIndex(null);
    }

  }

  React.useEffect(() => {
    handleSearch();

  }, [searchParams]);

  function handleSearchChange(event) {
    setSearchText(event.target.value)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper style={{ display: 'flex', justifyContent: 'center' }}
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={handleSearchChange}
          value={searchText}
        />
        <IconButton
          onClick={handleSearchParamSet}
          type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>

      </Paper>
    </div>
  );
}
import React, { useContext, useEffect, useState } from 'react';
import { Button, Navbar, Nav, NavItem, Input, Label } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import NotesTakingContext from '../contextProvider/NotesTakingContext';
import validator from "validator";

const ViewNotes = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(NotesTakingContext);


    const [allNotesData, setAlNotesData] = useState([]);
    // filteredNotesData is the notes data filtered based on the search content
    const [filteredNotesData, setFilteredNotesData] = useState([]);
    const [searchVal, setSearchVal] = useState('');


    const getAllNotes = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userProfile._id}/notes`, config)
          .then(res => {
            setAlNotesData(res.data.data);
            setFilteredNotesData(res.data.data);

            setApiCallError("");
          })
          .catch(err => {
            setApiCallError(err.response.data.message);
          })
      }catch(error){
        setApiCallError(error.message);
      }
    }

    // When the component is mounted
    useEffect(() => {
      if(! accessToken){
        // If there is no accessToken, then navigating to login page
        navigate('/login');
    }

    // Calling "getAllNotes" function to get all notes data
      getAllNotes();

      // eslint-disable-next-line
    }, []);


    const handleDeleteNote = async (id) => {
      try{
        await axios.delete(`${serverUrl}/api/${userProfile._id}/notes/${id}`, config)
        .then(res => {
          getAllNotes();
          setApiCallError("");
        })
        .catch(err => {
          setApiCallError(err.response.data.message);
        })
    }catch(error){
      setApiCallError(error.message);
    }
  }


  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  }

  // This function filters the notes based on the search content
  const filteringFun = (searchVal) => {
      if(! validator.isEmpty(searchVal)){
        setFilteredNotesData(allNotesData.filter(note => note["noteTitle"].includes(searchVal) || note["noteDescription"].includes(searchVal)));
      }else{
        setFilteredNotesData(allNotesData);
      }
  }

  useEffect(() => {
    filteringFun(searchVal);

    // eslint-disable-next-line
  }, [searchVal]);

  return (
    <div >
      <Navbar  expand="md" className='Navbar-class' fixed='top'>
            <Nav className="mr-auto" navbar style={{alignItems : "center"}}>
                <NavItem>
                <h6 style={{color:"white"}}>Notes-Taking Application</h6>
                </NavItem>
            </Nav>
            <Nav className='ml-auto' navbar style={{alignItems : "center"}}>
                <NavItem style={{color : "white"}}>
                {userProfile.email}
                </NavItem>
                <NavItem>
                    <Button className='home-page-Button-class' color='warning' size='sm' onClick={logoutUserFun}>Log Out</Button>
                </NavItem>
            </Nav>
        </Navbar>



      
      <h6 style={{color : "green"}}>All Notes</h6>
      {/* Showing the "apiCallError", if any error occurs */}
      <h6 className='apiCallError-h6-class'>{apiCallError}</h6>
      <br />

      <Label>Search</Label>
      <Input type='text' placeholder='Search notes here' name='searchFilter' value={searchVal} onChange={handleSearchChange} />

      <br />
      <br />

      <div>
            {filteredNotesData.length > 0 ? (
              // If there are notes in the database
              <div>
                {/* Displaying Ideas */}
                <p className='blue-color-p-class'>Ideas</p>

                <div>
                  {filteredNotesData.filter(doc => doc.noteCategory === "Idea").map((val, index) => {
                      return <div key={val._id} className='note-main-div-class'>
                        <div className='note-button-class'>

                            <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditNote/${val._id}` )} >🖊️</Button>
                            
                            <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteNote(val._id)} >🗑️</Button>
                            <hr />
                        </div>
                        
                        <p><b>{val.noteTitle}</b></p>
                        <div>{val.noteDescription}</div>
                        <div>
                            <hr />
                            <div className='note-date-class'>{val.createdDate}</div>
                            <div className='note-status-class'>{val.noteStatus}</div>
                        </div>                          
                        
                      </div>
                    })}

                </div>
               

                    <br />
                    <br />


                    {/* Displaying reminders) */}
                    <p className='blue-color-p-class'>Reminders</p>
                  
                      <div>
                        {filteredNotesData.filter(doc => doc.noteCategory === "Reminder").map((val, index) => {
                            return <div key={val._id} className='note-main-div-class'>
                              <div className='note-button-class'>

                                  <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditNote/${val._id}` )} >🖊️</Button>
                                  
                                  <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteNote(val._id)} >🗑️</Button>
                                  <hr />
                              </div>
                              
                              <p><b>{val.noteTitle}</b></p>
                              <div>{val.noteDescription}</div>
                              <div>
                                  <hr />
                                  <div className='note-date-class'>{val.createdDate}</div>
                                  <div className='note-status-class'>{val.noteStatus}</div>
                              </div>                               
                              
                            </div>
                          })}

                      </div>


                    <br />
                    <br />


                    {/* Displaying tasks) */}
                    <p className='blue-color-p-class'>Tasks</p>
                        <div>
                          {filteredNotesData.filter(doc => doc.noteCategory === "Task").map((val, index) => {
                              return <div key={val._id} className='note-main-div-class'>
                                <div className='note-button-class'>

                                    <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditNote/${val._id}` )} >🖊️</Button>
                                    
                                    <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteNote(val._id)} >🗑️</Button>
                                    <hr />
                                </div>
                                
                                <p><b>{val.noteTitle}</b></p>
                                <div>{val.noteDescription}</div>
                                <div>
                                    <hr />
                                    <div className='note-date-class'>{val.createdDate}</div>
                                    <div className='note-status-class'>{val.noteStatus}</div>
                                </div>                                 
                                
                              </div>
                            })}

                        </div>


                    <br />
                    <br />


                    {/* Displaying informations) */}
                    <p className='blue-color-p-class'>Informations</p>
                      <div>
                        {filteredNotesData.filter(doc => doc.noteCategory === "Information").map((val, index) => {
                            return <div key={val._id} className='note-main-div-class'>
                              <div className='note-button-class'>

                                  <Button color='warning' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => navigate(`/${userProfile._id}/addOrEditNote/${val._id}` )} >🖊️</Button>
                                  
                                  <Button color='danger' className='action-buttons' style={{fontSize:"smaller"}} onClick={() => handleDeleteNote(val._id)} >🗑️</Button>
                                  <hr />
                              </div>
                              
                              <p><b>{val.noteTitle}</b></p>
                              <div>{val.noteDescription}</div>
                              <div>
                                  <hr />
                                  <div className='note-date-class'>{val.createdDate}</div>
                                  <div className='note-status-class'>{val.noteStatus}</div>
                              </div>
                                             
                            </div>
                          })}

                      </div>


                    <br />
                    <br />
                    <br />
                <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>

                <br />
                <br />
                <br />

              </div>
               ) : 

               <div>
                  <h6>Either no notes are added or no matches found for the search content.</h6>
                  <br />
                  <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userProfile._id}/userDashboard`)}>To dashboard</Button>
                </div>

               }

      </div>
  </div>
  )
}

export default ViewNotes;



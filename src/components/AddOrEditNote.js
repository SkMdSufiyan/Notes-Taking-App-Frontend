import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Card, Input, CardBody, Navbar, Nav, NavItem } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
import NotesTakingContext from '../contextProvider/NotesTakingContext';

import "react-datepicker/dist/react-datepicker.css";


const AddOrEditNote = () => {
    const serverUrl = process.env.REACT_APP_SERVER_BASE_URL; // Server URL
    const navigate = useNavigate();


    const {accessToken, userProfile, apiCallError, setApiCallError, logoutUserFun, config} = useContext(NotesTakingContext);

    const {userID, noteID} = useParams();

    let pageIs = "";
    if(noteID){
      pageIs = "Edit note page";
    }else{
      pageIs = "Add note page";
    }


    const todayDate = new Date().toLocaleDateString();
    const  emptyNoteFormData = {
        "noteTitle" : "",
        "noteDescription" : "",
        "noteOwnerID" : userID,
        "createdDate" : todayDate,
        "noteCategory" : "",
        "noteStatus" : ""
    };



    const emptyNoteFormErrors = {
      "noteTitleError" : "",
      "noteDescriptionError" : "",
      "noteOwnerIDError" : "",
      "createdDateError" : "",
      "noteCategoryError" : "",
      "noteStatusError" : ""
    }


    // Initializing the states
    const [noteFormData, setNoteFormData] = useState(emptyNoteFormData);
    const [noteFormErrors, setNoteFormErrors] = useState(emptyNoteFormErrors);

    // "isAllValidData" will be true if all the mandatory fields are filled and validated
    // If "isAllValidData" is true, then the submit button will be enabled
    const [isAllValidData, setIsAllValidData] = useState(false);

    // "isAddOrEditSuccess" will be true if the user registration is successfull
    const [isAddOrEditSuccess, setIsAddOrEditSuccess] = useState(false);


// The "getNoteByID" function is for populating the "noteFormData" with the data of the note when it is UPDATE operation
    const getNoteByID = async () => {
      try{
          await axios.get(`${serverUrl}/api/${userID}/notes/${noteID}`, config)
          .then(res => {
            setNoteFormData(res.data.data);
            setIsAllValidData(true);
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

      if(noteID){
        // If this is UPDATE operation, calling the "getNoteByID" function to populate the noteFormData
        getNoteByID(); 
      }

      // eslint-disable-next-line
    }, []);



    // Function for making a POST request to ADD a new note
    const addNewNoteFun = async (noteFormData) => {
        try{
            await axios.post(`${serverUrl}/api/${userID}/notes`, noteFormData, config)
                .then(res => {
                    setIsAddOrEditSuccess(true);

                    setNoteFormData(emptyNoteFormData);
                    setApiCallError("");
                })
                .catch(err => {
                    setApiCallError(err.response.data.message);
                    setIsAddOrEditSuccess(false);
                })
        }catch(error){
            setApiCallError(error.message);
            setIsAddOrEditSuccess(false);
        }
    }


    // Function for making a PUT call to UPDATE a note
    const updateNoteFun = async (noteFormData) => {
      try{
          await axios.put(`${serverUrl}/api/${userID}/notes/${noteID}`, noteFormData, config)
              .then(res => {
                  setIsAddOrEditSuccess(true);
                  setNoteFormData(emptyNoteFormData);
                  setApiCallError("");
              })
              .catch(err => {
                  setApiCallError(err.response.data.message);
                  setIsAddOrEditSuccess(false);
              })
      }catch(error){
          setApiCallError(error.message);
          setIsAddOrEditSuccess(false);
      }
  }


    // Function for handling the state of "isAllValidData"
    const declareAllValidDataFunction = () => {
        // Checking whether any of the mandatory input fields is empty (not filled)
        const emptyInputFields = Object.values(noteFormData).filter(val => val === "").length;
        // Checking whether any of the fields of "noteFormErrors" contains error value
        const errorsInTheForm = Object.values(noteFormErrors).filter(val => val !== "").length;

        // Changing the state of "isAllValidData"
        if( ! emptyInputFields && ! errorsInTheForm ){
            setIsAllValidData(true);  
        }else{
            setIsAllValidData(false);
        }

    }


    useEffect(() => {
         // Calling the function "declareAllValidDataFunction" to set the state of "isAllValidData", based on which submit button will be disabled or enabled
        declareAllValidDataFunction();
        // eslint-disable-next-line
    }, [noteFormData, noteFormErrors]);


    // Function for handling the input field changes
    const handleNoteFormChange = (e) => {
        setNoteFormData({...noteFormData, [e.target.name] : e.target.value});


        // Validating  noteDescription field
        if(e.target.name === "noteDescription"){
            if(! validator.isEmpty(e.target.value)){
                setNoteFormErrors({...noteFormErrors, "noteDescriptionError" : ""});
            }else{
                setNoteFormErrors({...noteFormErrors, "noteDescriptionError" : "Enter a valid description"});
            }
        }

        // Validating noteTitle field
        if(e.target.name === "noteTitle"){
            if(! validator.isEmpty(e.target.value)){
                setNoteFormErrors({...noteFormErrors, "noteTitleError" : "" });
            }else{
                setNoteFormErrors({...noteFormErrors, "noteTitleError" : "Enter a valid title"});
            }
        }

        // Validating noteCategory field
        if(e.target.name === "noteCategory"){
            if(validator.isEmpty(e.target.value)){
                setNoteFormErrors({...noteFormErrors, "noteCategoryError" : "Note category is required"});
            }else{
                setNoteFormErrors({...noteFormErrors, "noteCategoryError" : "" });
            }
        }


        // Validating noteStatus field
        if(e.target.name === "noteStatus"){
            if(validator.isEmpty(e.target.value)){
                setNoteFormErrors({...noteFormErrors, "noteStatusError" : "Note status is required"});
            }else{
                setNoteFormErrors({...noteFormErrors, "noteStatusError" : "" });
            }
        }

    }

    //  Function for handling the onClick event of submit button (form submission)
    const handleSubmitNoteForm = (e) => {
        e.preventDefault();
        if(noteID){
          updateNoteFun(noteFormData);

        }else{
          addNewNoteFun(noteFormData);
        }
    }


  return (
    <div className='component-main-div'>
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


        

        <p className='blue-color-p-class'>{pageIs}</p>
        {/* Showing the "apiCallError", if any error occurs */}
        <h6 className='apiCallError-h6-class'>{apiCallError}</h6>

          <div>

              { ! isAddOrEditSuccess ? (
                // When the page is just loaded, and the data is not submitted yet
                // Then showing the note form
                  
                  <Card style={{width: '18rem'}}>
                    <span>After submitting the form kindly wait for some time it may take some time to process</span>
                      <CardBody>
                                                                          
                          <Label>Note title</Label><span>*</span>
                          <Input type='text' placeholder='Enter note title' name='noteTitle' value={noteFormData.noteTitle} onChange={handleNoteFormChange} />
                          <p><span>{noteFormErrors.noteTitleError} </span></p>
                          {/* <br /> */}

                          <Label>Note description</Label><span>*</span>
                          {/* <Input type='text' placeholder='Enter note description' name='noteDescription' value={noteFormData.noteDescription} onChange={handleNoteFormChange} /> */}

                          <textarea type='text' placeholder='Enter note description' name='noteDescription' value={noteFormData.noteDescription} onChange={handleNoteFormChange} />

                          <p><span>{noteFormErrors.noteDescriptionError} </span></p>
                          {/* <br /> */}

                          <Label>Note owner ID</Label><span>*</span>
                          <Input type='text' placeholder='Enter note addresse' name='noteOwnerID' value={noteFormData.noteOwnerID} onChange={handleNoteFormChange} disabled={true} />
                          <p><span>{noteFormErrors.noteOwnerIDError} </span></p>
                          {/* <br /> */}
                          

                          <Label>Created date</Label><span>*</span>
                          <Input type='text' placeholder='Enter created date' name='createdDate' value={noteFormData.createdDate} onChange={handleNoteFormChange} disabled={true} />
                          <p><span>{noteFormErrors.createdDateError} </span></p>
                          {/* <br /> */}
                          
                          <Label>Category</Label><span>*</span>
                          <select name='noteCategory' value={noteFormData.noteCategory} onChange={handleNoteFormChange}>
                              <optgroup label='Select category'>
                                  <option value={""} disabled>Select category</option>
                                  <option value={"Idea"}>Idea</option>
                                  <option value={"Reminder"}>Reminder</option>
                                  <option value={"Task"}>Task</option>
                                  <option value={"Information"}>Information</option>
                              </optgroup>
                          </select>
                          <br />
                        


                          <Label>Note status</Label><span>*</span>
                          <select name='noteStatus' value={noteFormData.noteStatus} onChange={handleNoteFormChange}>
                              <optgroup label='Select status'>
                                  <option value={""} disabled>Select status</option>
                                  <option value={"Pending"}>Pending</option>
                                  <option value={"Completed"}>Completed</option>
                              </optgroup>
                          </select>
                          <br />
                          <br />
                          

                          <Button className='Button-class' color='success' disabled={ ! isAllValidData } onClick={handleSubmitNoteForm}>Submit</Button>

                          {noteID ? 
                        //   If it is UPDATE operation
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/viewNotes`)}>Cancel</Button>

                            : 

                            // If it is POST operation (adding new note)
                            <Button className='Button-class' color='warning' onClick={()=>navigate(`/${userID}/userDashboard`)}>Cancel</Button>
                          }
                      </CardBody>
                      <br />
                      
                  </Card>     
                  
              ) : "" }  


              { isAddOrEditSuccess ? (
                  // If the form is submitted and the note is added or updated successfully
                  <Card style={{width: '18rem'}}>
                      <CardBody>
                          <h6 className='apiCallSuccess-h6-class'>{noteID ? "Note is updated successfully" : "Note is added successfully"}</h6>

                          <br />
                          <br />
                          {noteID ? 
                            <Button color='primary' onClick={()=>navigate(`/${userID}/viewNotes`)}>To notes page</Button>
                            : 
                            <Button color='primary' onClick={()=>navigate(`/${userID}/userDashboard`)}>To dashboard</Button>
                          }
                      </CardBody>
                  </Card>
              ) : "" }
                  
          </div>
        
            
            
    </div>
  )
}

export default AddOrEditNote;



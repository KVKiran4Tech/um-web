import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById, addEmployee, updateEmployeePersonalInformation, 
    updateEmployeeContactInformation, updateEmployeeFinancialDetails, 
    updateEmployeeAdminSection } from '../../store/reducers/employeeSlice';
import { Modal, Box, TextField, Button, Typography, Grid2 as Grid, MenuItem, 
    IconButton, Tooltip, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, InputLabel, Select } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Tabs from "../../components/tabPanel/Tabs";
import Panel from "../../components/tabPanel/Panel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';


const EmployeeFormModal = ({ employeeID, reloadGrid }) => {
    const [open, setOpen] = useState(false);
    let [formData, setFormData] = useState({
        aadhaarNumber: "",
        bankAccountNumber: "",
        addressLine1: "",
        addressLine2: "",
        alternativeContactNumber: "",
        alternativeEmail: "",
        backgroundVerificationAgencyName: "",
        bankName: "",
        bloodGroup: "",
        city: "",
        contactNumber: "",
        createdByID: 0,
        createdDate: "",
        dateOfBirth: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        emergencyContactPersonID: "",
        emergencyContactRelation: "",
        employeeID: 0,
        firstName: "",
        gender: "",
        highestDegreeEarned: "",
        bankIFSCCode: "",
        insuranceEndDate: "",
        insurancePolicyNumber: "",
        insuranceStartDate: "",
        insurerName: "",
        isBackgroundVerificationCompleted: true,
        isPhysicalVerificationCompleted: true,
        landmark: "",
        lastName: "",
        modifiedByID: 1,
        modifiedDate: "",
        panNumber: "",
        personalEmailID: "",
        previousOrgName: "",
        state: "",
        uanNumber: "",
        zip: "",
        activationDate: "",
        deactivationDate: "",
        activatedBy: "",
        deactivatedBy: "",
        activationComments: "",
        deactivationComments: ""
    });
    const [touched, setTouched] = useState({});

    const [documentType, setDocumentType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);

    const [attachments, setAttachments] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (employeeID && open) {
            dispatch(fetchEmployeeById(employeeID)).then((response) => {
                const data = response.payload;
                setFormData({
                    ...data,
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "",
                    createdDate: data.createdDate ? data.createdDate.split('T')[0] : "",
                    modifiedDate: data.modifiedDate ? data.modifiedDate.split('T')[0] : "",
                    insuranceStartDate: data.insuranceStartDate ? data.insuranceStartDate.split('T')[0] : "",
                    insuranceEndDate: data.insuranceEndDate ? data.insuranceEndDate.split('T')[0] : ""
                });
            });
        }
    }, [dispatch, employeeID, open]);

    useEffect(() => {
        if (updateSuccess) {
            handleClose();
            reloadGrid();
            setUpdateSuccess(false);
        }
    }, [updateSuccess, reloadGrid]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0] || null;
        setUploadedFile(file);
    };

    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
        setUploadedFile(null);
    }

    const handleAddAttachmentFile = () => {
        if(uploadedFile && documentType) {
            setAttachments([...attachments, {uploadedFile, documentType, lastModifiedDate: new Date()}]);
            setDocumentType('');
            setUploadedFile(null);
        }
    }

    const handleDeleteAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch(name) {
            case "aadhaarNumber": {
                if (!/^\d*$/.test(value) || value.length > 12) return;
                break;
            }
            case "contactNumber": {
                if (!/^\d*$/.test(value) || value.length > 10) return;
                break;
            }
            case 'hasBackgroundVerification': {
                if (value === "Yes") {
                    formData = {...formData, hasPhysicalVerificationDone : "No"};
                    formData.agencyName = "";
                }
                break;
            }
        }
        
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const isFieldValid = (field) => {
        if (field === "personalEmailID" || field === "alternativeEmail") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(formData[field]);
        }
        else if(field === "alternativeContactNumber" || field === "emergencyContactNumber") {
            const contactNumberRegex = /^\d{10}$/;
            return contactNumberRegex.test(formData[field]);
        }
        return formData[field] && formData[field].trim() !== "";
    };

    const getFieldError = (field) => {
        return !isFieldValid(field) && touched[field] ? "This field is required" : "";
    };

    const isPanelValid = (fields) => {
        return fields.every((field) => isFieldValid(field));
    };

    const handlePISave = async () => {
        try{
            const piData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                aadhaarNumber: formData.aadhaarNumber,
                pan: formData.panNumber,
                contactNumber: formData.contactNumber,
                bloodGroup: formData.bloodGroup,
                personalEmailID: formData.personalEmailID,
                loggedInUserID: -1
            }
            if (employeeID) {
                let reqObj = {...piData, employeeID};
                await dispatch(updateEmployeePersonalInformation(reqObj));
            } else {
                await dispatch(addEmployee(piData));
            }
            setUpdateSuccess(true);
        } catch(err){
            console.error(err);
        } finally {
            handleClose();
        }
    };
      
    const handleCISave = async () => {
        try{
            const ciData = {
                employeeID,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                state: formData.state,
                city: formData.city,
                zip: formData.zip,
                landmark: formData.landmark,
                alternativeContactNumber: formData.alternativeContactNumber,
                alternativeEmail: formData.alternativeEmail,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactRelation: formData.emergencyContactRelation,
                emergencyContactPersonID: formData.emergencyContactPersonID,
                emergencyContactNumber: formData.emergencyContactNumber,
                highestDegreeEarned: formData.highestDegreeEarned,
                previousOrgName: formData.previousOrgName
            }
            if (employeeID) {
                await dispatch(updateEmployeeContactInformation(ciData));
                setUpdateSuccess(true);
            }
        } catch(err){
            console.error(err);
        } finally {
            handleClose();
        }
    }

    const handleFDSave = async () => {
        try{
            const fdData = {
                employeeID,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber,
                bankIFSCCode: formData.bankIFSCCode,
                uanNumber: formData.uanNumber,
                insurancePolicyNumber: formData.insurancePolicyNumber,
                insurerName: formData.insurerName,
                insuranceStartDate: formData.insuranceStartDate,
                insuranceEndDate: formData.insuranceEndDate
            }
            if (employeeID) {
                await dispatch(updateEmployeeFinancialDetails(fdData));
                setUpdateSuccess(true);
            }
        }
        catch(err){
            console.error(err);
        } finally {
            handleClose();
        }
    }

    const handleASSave = async () => {
        try{
            const aData = {
                hasBackgroundVerification: formData.hasBackgroundVerification,
                agencyName: formData.agencyName,
                hasPhysicalVerificationDone: formData.hasPhysicalVerificationDone
            }
            if (employeeID) {
                let data = await dispatch(updateEmployeeAdminSection(...aData, employeeID));
            }
        }
        catch(err){
            
        } finally {
            handleClose();
        }
    }

    const handleUploadSave = async () => {
        
    }


    return (
        <div>
            {
                employeeID ? 
                (
                    <IconButton
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={handleOpen}
                        sx={{ width: "50px", Height: "50px" }}
                    >
                        <Tooltip title="Edit Employee" arrow><FontAwesomeIcon icon={faEdit} /></Tooltip>
                    </IconButton>
                )
                : <Button variant="contained" color="primary" onClick={handleOpen}>Add New</Button>
            }
            
            <Modal
                open={open}
                onClose={handleClose}
                slotProps={{ BackdropProps: { onClick: (e) => e.stopPropagation() } }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', bgcolor: 'background.paper', boxShadow: 24, p: 4, height: 650, width: 1100 }}>
                    <Grid container spacing={3}>
                        <Grid size={6}>
                            <Typography id="modal-title" variant="h6" sx={{ fontWeight: 900 }}>Employee Form</Typography>
                        </Grid>
                        <Grid size={6} sx={{ textAlign: 'right'}}>
                            <CloseRoundedIcon style={{ 'color': "red", 'cursor' : "pointer"}} onClick={handleClose} />
                        </Grid>
                        <Tabs selected={0} isReadOnly={!(employeeID)}>
                            <Panel title="Personal Information">
                                <Grid container rowSpacing={2} columnSpacing={3} sx={{paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent"}}>
                                    <Grid size={5} sx={{ marginTop: 1 }}>
                                        <TextField
                                        fullWidth
                                        label="First Name"
                                        variant="outlined"
                                        size="small"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        sx={{height: 50}}
                                        error={!isFieldValid("firstName") && touched.firstName}
                                        helperText={getFieldError("firstName")}
                                        />
                                    </Grid>
                                    <Grid size={5} sx={{ marginTop: 1 }} >
                                        <TextField
                                        fullWidth
                                        label="Last Name"
                                        variant="outlined"
                                        size="small"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={!isFieldValid("lastName") && touched.lastName}
                                        helperText={getFieldError("lastName")}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                        select
                                        fullWidth
                                        label="Gender"
                                        variant="outlined"
                                        size="small"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={!isFieldValid("gender") && touched.gender}
                                        helperText={getFieldError("gender")}
                                        >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            variant="outlined"
                                            size="small"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("dateOfBirth") && touched.dateOfBirth}
                                            helperText={getFieldError("dateOfBirth")}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                        fullWidth
                                        label="Aadhaar Number"
                                        variant="outlined"
                                        size="small"
                                        name="aadhaarNumber"
                                        value={formData.aadhaarNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        type='number'
                                        error={touched.aadhaarNumber && (!/^\d{12}$/.test(formData.aadhaarNumber) || formData.aadhaarNumber.length !== 12)}
                                        helperText={touched.aadhaarNumber && (!/^\d{12}$/.test(formData.aadhaarNumber) || formData.aadhaarNumber.length !== 12) ? "Aadhaar Number must be a 12-digit number" : ""}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                            fullWidth
                                            label="Pan Number"
                                            variant="outlined"
                                            size="small"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("panNumber") && touched.panNumber}
                                            helperText={getFieldError("panNumber")}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                            fullWidth
                                            label="Contact Number"
                                            variant="outlined"
                                            size="small"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={touched.contactNumber && (!/^\d{10}$/.test(formData.contactNumber) || formData.contactNumber.length !== 10)}
                                            helperText={touched.contactNumber && (!/^\d{10}$/.test(formData.contactNumber) || formData.contactNumber.length !== 10) ? "Contact Number must be a 10-digit number" : ""}  
                                            type='number'
                                            slotProps={{ htmlInput: { maxLength: 10 } }}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                        select
                                        fullWidth
                                        label="Blood Group"
                                        variant="outlined"
                                        size="small"
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={!isFieldValid("bloodGroup") && touched.bloodGroup}
                                        helperText={getFieldError("bloodGroup")}
                                        >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid size={5}>
                                        <TextField
                                        fullWidth
                                        label="Personal Email ID"
                                        variant="outlined"
                                        size="small"
                                        name="personalEmailID"
                                        value={formData.personalEmailID}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={!isFieldValid("personalEmailID") && touched.personalEmailID}
                                        helperText={getFieldError("personalEmailID")}
                                        />
                                    </Grid>
                                    <Grid size={10} sx={{ mt: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handlePISave("PI")}
                                                disabled={!isPanelValid(["firstName", "lastName", "gender", "dateOfBirth", "aadhaarNumber", "panNumber", "contactNumber", "bloodGroup", "personalEmailID"])}
                                            >
                                            Save
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Panel>
                            <Panel title="Contact Information">
                                <Grid container rowSpacing={1} columnSpacing={3} sx={{paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent"}}>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Address</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Address Line 1"
                                                variant="outlined"
                                                size="small"
                                                name="addressLine1"
                                                value={formData.addressLine1}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("addressLine1") && touched.addressLine1}
                                                helperText={getFieldError("addressLine1")}
                                                maxLength={200}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Address Line 2"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("addressLine2") && touched.addressLine2}
                                                helperText={getFieldError("addressLine2")}
                                                maxLength={200}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                variant="outlined"
                                                size="small"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("state") && touched.state}
                                                helperText={getFieldError("state")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Zip"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("city") && touched.city}
                                                helperText={getFieldError("city")}
                                                maxLength={10}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Landmark"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("zip") && touched.zip}
                                                helperText={getFieldError("zip")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Alternative Contact Number</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Alternative Contact Number"
                                                variant="outlined"
                                                size="small"
                                                name="alternativeContactNumber"
                                                value={formData.alternativeContactNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.alternativeContactNumber && (!/^\d{10}$/.test(formData.alternativeContactNumber) || formData.alternativeContactNumber.length !== 10)}
                                                helperText={touched.alternativeContactNumber && (!/^\d{10}$/.test(formData.alternativeContactNumber) || formData.alternativeContactNumber.length !== 10) ? "Alternative Contact Number must be a 10-digit number" : ""}  
                                                type='number'
                                                slotProps={{ htmlInput: { maxLength: 10 }, inputLabel: { shrink: true } }}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Alternative Email"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="alternativeEmail"
                                                value={formData.alternativeEmail}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("alternativeEmail") && touched.alternativeEmail}
                                                helperText={getFieldError("alternativeEmail")}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Emergency Contact Section</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Name"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="emergencyContactName"
                                                value={formData.emergencyContactName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactName") && touched.emergencyContactName}
                                                helperText={getFieldError("emergencyContactName")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Relation"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="emergencyContactRelation"
                                                value={formData.emergencyContactRelation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactRelation") && touched.emergencyContactRelation}
                                                helperText={getFieldError("emergencyContactRelation")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact ID"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="emergencyContactPersonID"
                                                value={formData.emergencyContactPersonID}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactPersonID") && touched.emergencyContactPersonID}
                                                helperText={getFieldError("emergencyContactPersonID")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Number"
                                                variant="outlined"
                                                size="small"
                                                name="emergencyContactNumber"
                                                value={formData.emergencyContactNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.emergencyContactNumber && (!/^\d{10}$/.test(formData.emergencyContactNumber) || formData.emergencyContactNumber.length !== 10)}
                                                helperText={touched.emergencyContactNumber && (!/^\d{10}$/.test(formData.emergencyContactNumber) || formData.emergencyContactNumber.length !== 10) ? "Emergency Contact Number must be a 10-digit number" : ""}  
                                                type='number'
                                                slotProps={{ htmlInput: { maxLength: 10 }, inputLabel: { shrink: true } }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Other Info</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Highest Degree Earned"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="highestDegreeEarned"
                                                value={formData.highestDegreeEarned}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("highestDegreeEarned") && touched.highestDegreeEarned}
                                                helperText={getFieldError("highestDegreeEarned")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Last Company Name"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="previousOrgName"
                                                value={formData.previousOrgName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("previousOrgName") && touched.previousOrgName}
                                                helperText={getFieldError("previousOrgName")}
                                                maxLength={80}
                                            />
                                        </Grid>
                                    </Grid>
                                    {
                                        employeeID && (
                                        <Grid size={10} sx={{ mt: 2, mb: 2 }} >
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleCISave()}
                                                    disabled={!isPanelValid(["addressLine1", "addressLine2", "state", "city", "zip", "landmark", 
                                                        "alternativeContactNumber", "alternativeEmail", "emergencyContactName", "emergencyContactRelation", 
                                                        "emergencyContactPersonID", "emergencyContactNumber", "highestDegreeEarned", "previousOrgName" ])}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </Grid>
                                        )
                                    }
                                </Grid>
                            </Panel>
                            <Panel title="Financial Details">
                                <Grid container rowSpacing={1} columnSpacing={3} sx={{paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent"}}>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Bank Account Details</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Bank Name"
                                                variant="outlined"
                                                size="small"
                                                name="bankName"
                                                value={formData.bankName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                error={!isFieldValid("bankName") && touched.bankName}
                                                helperText={getFieldError("bankName")}
                                                maxLength={100}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Bank Account Number"
                                                variant="outlined"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                size="small"
                                                name="bankAccountNumber"
                                                value={formData.bankAccountNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("bankAccountNumber") && touched.bankAccountNumber}
                                                helperText={getFieldError("bankAccountNumber")}
                                                maxLength={50}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                        <TextField
                                            fullWidth
                                            label="IFSC code"
                                            variant="outlined"
                                            size="small"
                                            name="bankIFSCCode"
                                            value={formData.bankIFSCCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("bankIFSCCode") && touched.bankIFSCCode}
                                            helperText={getFieldError("bankIFSCCode")}
                                            maxLength={50}
                                        />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ fontWeight: 900, mt:3 }}>PF Details</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="UAN Number"
                                                variant="outlined"
                                                size="small"
                                                name="uanNumber"
                                                value={formData.uanNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("uanNumber") && touched.uanNumber}
                                                helperText={getFieldError("uanNumber")}
                                                maxLength={50}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ fontWeight: 900, mt:3 }}>Insurance Details</Typography>
                                    <Grid container rowSpacing={2} columnSpacing={3} size={12}>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Insurance Policy Number"
                                                variant="outlined"
                                                size="small"
                                                name="insurancePolicyNumber"
                                                value={formData.insurancePolicyNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("insurancePolicyNumber") && touched.insurancePolicyNumber}
                                                helperText={getFieldError("insurancePolicyNumber")}
                                                maxLength={50}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Insurance Company Name"
                                                variant="outlined"
                                                size="small"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                name="insurerName"
                                                value={formData.insurerName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("insurerName") && touched.insurerName}
                                                helperText={getFieldError("insurerName")}
                                                maxLength={50}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Insurance Start Date"
                                                variant="outlined"
                                                size="small"
                                                type="date"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                name="insuranceStartDate"
                                                value={formData.insuranceStartDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("insuranceStartDate") && touched.insuranceStartDate}
                                                helperText={getFieldError("insuranceStartDate")}
                                            />
                                        </Grid>
                                        <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Insurance End Date"
                                                variant="outlined"
                                                size="small"
                                                type="date"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                name="insuranceEndDate"
                                                value={formData.insuranceEndDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("insuranceEndDate") && touched.insuranceEndDate}
                                                helperText={getFieldError("insuranceEndDate")}
                                            />
                                        </Grid>
                                    </Grid>
                                    {
                                        employeeID && (
                                        <Grid size={10} sx={{ mt: 2, mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleFDSave()}
                                                disabled={!isPanelValid(["bankName", "bankAccountNumber", "bankIFSCCode", 
                                                    "uanNumber", "insurancePolicyNumber", "insurerName", 
                                                    "insuranceStartDate", "insuranceEndDate", ])}
                                            >
                                                Save
                                            </Button>
                                            </Box>
                                        </Grid>
                                        )
                                    }
                                    </Grid>
                            </Panel>
                            <Panel title="Admin Section">
                                <Grid container rowSpacing={2} columnSpacing={3} sx={{paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent"}}>
                                    <Grid size={10}>
                                        <FormControl component="fieldset" >
                                            <FormLabel component="legend">Background Verification Completed</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-label="background-verification"
                                                name="hasBackgroundVerification"
                                                value={formData.hasBackgroundVerification ?? "No"}
                                                onChange={handleChange}
                                            >
                                                <FormControlLabel value="Yes" control={<Radio />} labelPlacement="end" label="Yes" />
                                                <FormControlLabel value="No" control={<Radio />} labelPlacement="end" label="No" />
                                                <FormControlLabel value="NA" control={<Radio />} labelPlacement="end" label="N/A" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    {
                                        formData.hasBackgroundVerification === "Yes" && 
                                        <>
                                            <Grid size={5}>
                                            <TextField
                                                fullWidth
                                                label="Agency Name"
                                                variant="outlined"
                                                size="small"
                                                name="agencyName"
                                                value={formData.agencyName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("agencyName") && touched.agencyName}
                                                helperText={getFieldError("agencyName")}
                                                maxLength={80}
                                            />
                                            </Grid>
                                            <Grid size={10}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Physical Verification Completed</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-label="physical-verification"
                                                    name="hasPhysicalVerificationDone"
                                                    value={formData.hasPhysicalVerificationDone ?? "No"}
                                                    onChange={handleChange}
                                                >
                                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                                    <FormControlLabel value="NA" control={<Radio />} label="N/A" />
                                                </RadioGroup>
                                            </FormControl>
                                            </Grid>
                                        </>
                                    }
                                    {
                                        employeeID && (
                                        <Grid size={10} sx={{ mt: 2, mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleASSave()}
                                                disabled={!isPanelValid(["hasBackgroundVerification"])}
                                            >
                                                Save
                                            </Button>
                                            </Box>
                                        </Grid>
                                        )   
                                    }
                                </Grid>
                            </Panel>
                            <Panel title="Uploads">
                                <Grid container rowSpacing={0} columnSpacing={3} sx={{paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent"}}>
                                    <Typography variant="h7" sx={{ fontWeight: 900 }}>Upload Employee Documents</Typography>
                                    <Grid container rowSpacing={0} columnSpacing={3} size={12} sx={{mt: 2}}>
                                        <Grid size={5}>
                                            <FormControl fullWidth >
                                                <InputLabel id="document-type-label">Document Type</InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="document-type-label"
                                                    id="document-type"
                                                    label="Document Type"
                                                    value={documentType}
                                                    onChange={ handleDocumentTypeChange }
                                                >
                                                    <MenuItem value="adhaar">Adhaar</MenuItem>
                                                    <MenuItem value="pan">PAN</MenuItem>
                                                    <MenuItem value="payslips">Payslips</MenuItem>
                                                    <MenuItem value="educationCertificates">Education Certificates</MenuItem>
                                                    <MenuItem value="previousExperienceCertificates">Previous Experience Certificates</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={3}>
                                            <TextField 
                                                fullWidth
                                                size="small"
                                                disabled
                                                value={uploadedFile ? uploadedFile.name : ''}
                                                placeholder="No file chosen"
                                                sx={{ mt: 0, mb: 0 }}
                                            />
                                        </Grid>
                                        <Grid size={2}>
                                            <Button 
                                                variant="contained" 
                                                component="label"
                                                disabled={documentType === ""}
                                            >
                                                Browse
                                                <input 
                                                    type="file" 
                                                    hidden 
                                                    onChange={handleFileUpload}
                                                />
                                            </Button>
                                        </Grid>
                                        <Grid size={1}>
                                            <FontAwesomeIcon icon={faSquarePlus}
                                                size='2x'
                                                color={ (documentType && uploadedFile) ? 'green' : 'gray' }
                                                onClick={handleAddAttachmentFile}
                                                style={{ cursor: (documentType && uploadedFile) ? "pointer" : "default"}}
                                                disabled={!(documentType || uploadedFile)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box gridColumn="span 12" sx={{mt: 6}}>
                                        <Typography variant="h7" sx={{ fontWeight: 900}}>Uploaded Documents</Typography>
                                    </Box>
                                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} gridColumn="span 12" sx={{mt:3, maxHeight: 300}}>
                                        <Box gridColumn="span 3">
                                            <Typography sx={{ fontWeight: 700}}>Document Type</Typography> 
                                        </Box>
                                        <Box gridColumn="span 4">
                                            <Typography sx={{ fontWeight: 700}}>Name</Typography>
                                        </Box>
                                        <Box gridColumn="span 2">
                                            <Typography sx={{ fontWeight: 700}}>Size in KB's</Typography>
                                        </Box>
                                        <Box gridColumn="span 2">
                                            <Typography sx={{ fontWeight: 700}}>Last Modified Date</Typography>
                                        </Box>
                                        <Box gridColumn="span 1">
                                            <Typography sx={{ fontWeight: 700}}>Actions</Typography>
                                        </Box>
                                        {attachments.map((attachment, index) => (
                                            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} gridColumn="span 12" key={index} sx={{height: 25}}>
                                                <Box gridColumn="span 3"><Typography>{attachment.documentType}</Typography></Box>
                                                <Box gridColumn="span 4"><Typography>{attachment.uploadedFile?.name}</Typography></Box>
                                                <Box gridColumn="span 2"><Typography>{attachment.uploadedFile?.size}</Typography></Box>
                                                <Box gridColumn="span 2"><Typography>{attachment.lastModifiedDate?.toLocaleDateString()}</Typography></Box>
                                                <Box gridColumn="span 1">
                                                    <FontAwesomeIcon icon={faSquareMinus} size='lg' color='red' style={{ cursor: 'pointer' }} onClick={() => handleDeleteAttachment(index)} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Grid container size={12}>
                                        <Grid size={6}></Grid>
                                        <Grid size={5} sx={{ textAlign: 'right', m: 2}}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleUploadSave()}
                                            >
                                                Save
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Panel>
                        </Tabs>
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default EmployeeFormModal;
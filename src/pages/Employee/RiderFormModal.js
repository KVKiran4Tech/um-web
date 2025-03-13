import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiderById, addRider, updateRiderPersonalInformation } from '../../store/reducers/riderSlice';
import {
    Modal, Box, TextField, Button, Typography, Grid2 as Grid, MenuItem,
    IconButton, Tooltip, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, InputLabel, Select
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Tabs from "../../components/tabPanel/Tabs";
import Panel from "../../components/tabPanel/Panel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import { reference } from '@popperjs/core';

const RiderFormModal = ({ riderID, reloadGrid }) => {
    const [open, setOpen] = useState(false);
    let [formData, setFormData] = useState({
        vendorName: "",
        referenceName: "",
        fullName: "",
        gender: "",
        dateOfBirth: "",
        aadharCardNumber: "",
        panNumber: "",
        bloodGroup: "",
        contactNumber: "",
        emailId: "",
        lastCompanyName: "",
        highestDegreeEarned: "",
        emergencyContactPhone: "",
        emergencyContactID: "",
        emergencyContactRelation: "",
        emergencyContactName: "",
        alternativeEmail: "",
        alternativeContactNumber: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        zip: "",
        landmark: ""
    });

    const dispatch = useDispatch();
    const [touched, setTouched] = useState({});
    const [documentType, setDocumentType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (riderID && open) {
            dispatch(fetchRiderById(riderID)).then((response) => {
                const data = response.payload;
                setFormData({
                    ...data,
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ""
                });
            });
        }
    }, [dispatch, riderID, open]);

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
        if (uploadedFile && documentType) {
            setAttachments([...attachments, { uploadedFile, documentType, lastModifiedDate: new Date() }]);
            setDocumentType('');
            setUploadedFile(null);
        }
    }

    const handleDeleteAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "aadharCardNumber": {
                if (!/^\d*$/.test(value) || value.length > 12) return;
                break;
            }
            case "contactNumber": {
                if (!/^\d*$/.test(value) || value.length > 10) return;
                break;
            }
            case 'hasBackgroundVerification': {
                if (value === "Yes") {
                    formData = { ...formData, hasPhysicalVerificationDone: "No" };
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
        if (field === "emailId" || field === "alternativeEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(formData[field]);
        }
        else if (field === "alternativeContactNumber" || field === "emergencyContactNumber") {
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
        try {
            const piData = {
                fullName: formData.fullName,
                vendorName: formData.vendorName,
                referenceName: formData.referenceName,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                aadharCardNumber: formData.aadharCardNumber,
                pan: formData.panNumber,
                contactNumber: formData.contactNumber,
                bloodGroup: formData.bloodGroup,
                emailId: formData.emailId,
                loggedInUserID: -1
            }
            if (riderID) {
                let reqObj = { ...piData, riderID };
                await dispatch(updateRiderPersonalInformation(reqObj));
            } else {
                await dispatch(addRider(piData));
            }
            setUpdateSuccess(true);
        } catch (err) {
            console.error(err);
        } finally {
            handleClose();
        }
    };

    return (
        <>
            {
                riderID ?
                    (
                        <IconButton
                            color="primary"
                            size="small"
                            style={{ marginRight: 8 }}
                            onClick={handleOpen}
                            sx={{ width: "50px", Height: "50px" }}
                        >
                            <Tooltip title="Edit Rider" arrow><FontAwesomeIcon icon={faEdit} /></Tooltip>
                        </IconButton>
                    )
                    : <Button variant="contained" color="primary" onClick={handleOpen}>Add New</Button>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', bgcolor: 'background.paper', boxShadow: 24, p: 4, height: 650, width: 1100 }}>
                    <Grid container spacing={3} >
                        <Grid size={6}>
                            <Typography id="modal-title" variant="h6" sx={{ fontWeight: 900 }}>Rider Form</Typography>
                        </Grid>
                        <Grid size={6} sx={{ textAlign: 'right' }}>
                            <CloseRoundedIcon style={{ 'color': "red", 'cursor': "pointer" }} onClick={handleClose} />
                        </Grid>
                        <Tabs selected={0} isReadOnly={!(riderID)} >
                            <Panel title="Personal Information">
                                <Grid container rowSpacing={2} columnSpacing={3} sx={{ paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent" }}>
                                    <Grid size={5} sx={{ marginTop: 1 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            variant="outlined"
                                            size="small"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            sx={{ height: 32 }}
                                            error={!isFieldValid("fullName") && touched.firstName}
                                            helperText={getFieldError("fullName")}
                                        />
                                    </Grid>
                                    <Grid size={5} sx={{ marginTop: 1 }} >
                                        <TextField
                                            fullWidth
                                            label="Vendor Name"
                                            variant="outlined"
                                            size="small"
                                            name="  "
                                            value={formData.vendorName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("vendorName") && touched.vendorName}
                                            helperText={getFieldError("vendorName")}
                                        />
                                    </Grid>
                                    <Grid size={5} sx={{ marginTop: 0.4 }} >
                                        <TextField
                                            fullWidth
                                            label="Reference Name"
                                            variant="outlined"
                                            size="small"
                                            name="referenceName"
                                            value={formData.referenceName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("referenceName") && touched.referenceName}
                                            helperText={getFieldError("referenceName")}
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
                                            name="aadharCardNumber"
                                            value={formData.aadharCardNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            type='number'
                                            error={touched.aadharCardNumber && (!/^\d{12}$/.test(formData.aadharCardNumber) || formData.aadharCardNumber.length !== 12)}
                                            helperText={touched.aadharCardNumber && (!/^\d{12}$/.test(formData.aadharCardNumber) || formData.aadharCardNumber.length !== 12) ? "Aadhaar Number must be a 12-digit number" : ""}
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
                                            fullWidth
                                            label="Email ID"
                                            variant="outlined"
                                            size="small"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={!isFieldValid("emailId") && touched.emailId}
                                            helperText={getFieldError("emailId")}
                                        />
                                    </Grid>
                                    <Grid size={10} sx={{ mt: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handlePISave("PI")}
                                                disabled={!isPanelValid(["fullName", "vendorName", "referenceName", "gender", "dateOfBirth", "aadharCardNumber", "panNumber", "contactNumber", "bloodGroup", "emailId"])}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Panel>
                            <Panel title="Contact Information" >
                                <Box sx={{ overflowY: 'auto', maxHeight: 350 }}>
                                    <Typography variant="h7" sx={{ paddingLeft: 5, marginBottom: 2, fontWeight: "bold" }}>
                                        Alternative Contact Section
                                    </Typography>
                                    <Grid container rowSpacing={1} columnSpacing={3} sx={{ paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent" }}>
                                        <Grid size={5} sx={{ marginTop: 1 }}>
                                            <TextField
                                                fullWidth
                                                label="Alternative Contact Number"
                                                variant="outlined"
                                                size="small"
                                                name="alternativeContactNumber"
                                                type="number"
                                                value={formData.alternativeContactNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                sx={{ height: 32 }}
                                                error={!isFieldValid("alternativeContactNumber") && touched.alternativeContactNumber}
                                                helperText={getFieldError("alternativeContactNumber")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1,mb:1 }} >
                                            <TextField
                                                fullWidth
                                                label="Alternative Email"
                                                variant="outlined"
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
                                    <Typography variant="h7" sx={{ paddingLeft: 5, marginBottom: 2, fontWeight: "bold" }}>
                                        Emergency Contact 
                                    </Typography>
                                    <Grid container rowSpacing={3} columnSpacing={3} sx={{ paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent" }}>
                                        <Grid size={5} sx={{ marginTop: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Name"
                                                variant="outlined"
                                                size="small"
                                                name="emergencyContactName"
                                                value={formData.emergencyContactName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                sx={{ height: 32 }}
                                                error={!isFieldValid("emergencyContactName") && touched.emergencyContactName}
                                                helperText={getFieldError("emergencyContactName")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 2 }} >
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Relation"
                                                variant="outlined"
                                                size="small"
                                                name="emergencyContactRelation"
                                                value={formData.emergencyContactRelation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactRelation") && touched.emergencyContactRelation}
                                                helperText={getFieldError("emergencyContactRelation")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1 }} >
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact ID"
                                                variant="outlined"
                                                size="small"
                                                name="emergencyContactID"
                                                value={formData.emergencyContactID}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactID") && touched.emergencyContactID}
                                                helperText={getFieldError("emergencyContactID")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1,mb:1 }} >
                                            <TextField
                                                fullWidth
                                                label="Emergency Contact Phone"
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                name="emergencyContactPhone"
                                                value={formData.emergencyContactPhone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("emergencyContactPhone") && touched.emergencyContactPhone}
                                                helperText={getFieldError("emergencyContactPhone")}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ paddingLeft: 5, marginBottom: 2, fontWeight: "bold" }}>
                                        Address
                                    </Typography>
                                    <Grid container rowSpacing={3} columnSpacing={3} sx={{ paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent" }}>
                                        <Grid size={5} sx={{ marginTop: 2 }}>
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
                                                sx={{ height: 32 }}
                                                error={!isFieldValid("addressLine1") && touched.addressLine1}
                                                helperText={getFieldError("addressLine1")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 2 }} >
                                            <TextField
                                                fullWidth
                                                label="Address Line 2"
                                                variant="outlined"
                                                size="small"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("addressLine2") && touched.addressLine2}
                                                helperText={getFieldError("addressLine2")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1 }} >
                                            <TextField
                                                fullWidth
                                                label="State"
                                                variant="outlined"
                                                size="small"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("state") && touched.state}
                                                helperText={getFieldError("state")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1 }} >
                                            <TextField
                                                fullWidth
                                                label="City"
                                                variant="outlined"
                                                size="small"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("city") && touched.city}
                                                helperText={getFieldError("city")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1 }} >
                                            <TextField
                                                fullWidth
                                                label="Zip"
                                                variant="outlined"
                                                size="small"
                                                name="zip"
                                                type="number"
                                                value={formData.zip}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("zip") && touched.zip}
                                                helperText={getFieldError("zip")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 1,mb:2 }} >
                                            <TextField
                                                fullWidth
                                                label="Landmark"
                                                variant="outlined"
                                                size="small"
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("landmark") && touched.landmark}
                                                helperText={getFieldError("landmark")}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h7" sx={{ paddingLeft: 5, marginBottom: 2, fontWeight: "bold" }}>
                                        Other Info
                                    </Typography>
                                    <Grid container rowSpacing={1} columnSpacing={3} sx={{ paddingLeft: 5, overflowY: "auto", maxHeight: 400, backgroundColor: "transparent" }}>
                                        <Grid size={5} sx={{ marginTop: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Highest Degree Earned"
                                                variant="outlined"
                                                size="small"
                                                name="highestDegreeEarned"
                                                value={formData.highestDegreeEarned}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                sx={{ height: 32 }}
                                                error={!isFieldValid("highestDegreeEarned") && touched.highestDegreeEarned}
                                                helperText={getFieldError("highestDegreeEarned")}
                                            />
                                        </Grid>
                                        <Grid size={5} sx={{ marginTop: 2 }} >
                                            <TextField
                                                fullWidth
                                                label="Last Company Name"
                                                variant="outlined"
                                                size="small"
                                                name="lastCompanyName"
                                                value={formData.lastCompanyName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={!isFieldValid("lastCompanyName") && touched.lastCompanyName}
                                                helperText={getFieldError("lastCompanyName")}
                                            />
                                        </Grid>
                                        <Grid size={10} sx={{ mt: 2, mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handlePISave("PI")}
                                                    disabled={!isPanelValid(["lastCompanyName", "highestDegreeEarned"])}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Panel>
                        </Tabs>
                    </Grid>
                </Box>
            </Modal>
        </>
    )
}

export default RiderFormModal;
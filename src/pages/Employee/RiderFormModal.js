import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiderById } from '../../store/reducers/riderSlice';
import { Modal, Box, TextField, Button, Typography, Grid2 as Grid, MenuItem, 
    IconButton, Tooltip, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, InputLabel, Select } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Tabs from "../../components/tabPanel/Tabs";
import Panel from "../../components/tabPanel/Panel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';

const RiderFormModal = ({ riderID, reloadGrid }) => {
    const [open, setOpen] = useState(false);
    const [touched, setTouched] = useState({});

    let [formData, setFormData] = useState({

    });
    const dispatch = useDispatch();

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


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                    <Grid container spacing={3}>
                        <Grid size={6}>
                            <Typography id="modal-title" variant="h6" sx={{ fontWeight: 900 }}>Rider Form</Typography>
                        </Grid>
                        <Grid size={6} sx={{ textAlign: 'right'}}>
                            <CloseRoundedIcon style={{ 'color': "red", 'cursor' : "pointer"}} onClick={handleClose} />
                        </Grid>
                        <Tabs selected={0} isReadOnly={!(riderID)}>
                            <Panel title="Personal Information"></Panel>
                            <Panel title="Contact Information"></Panel>
                            <Panel title="Financial Details"></Panel>
                            <Panel title="Additional Checks"></Panel>
                        </Tabs>
                    </Grid>
                </Box>
            </Modal>
        </>
    )
}

export default RiderFormModal;
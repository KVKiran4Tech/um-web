import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRiders } from '../../store/reducers/riderSlice';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import { TextField, Box, Container, CssBaseline, Typography, Grid2 as Grid, IconButton, Button, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import RiderFormModal from './RiderFormModal';

const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
};

const RiderList = () => {
    const { riders, loading, error } = useSelector(state => state.riders);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [filteredRiders, setFilteredRiders] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        dispatch(fetchRiders());
    }, [dispatch]);

    useEffect(() => {
        setFilteredRiders(riders);
    }, [riders]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
        setFilteredRiders(
            riders.filter((rider) =>
                Object.keys(rider).some((key) =>
                    String(rider[key]).toLowerCase().includes(value)
                )
            )
        );
    };

    const handleActivate = (row) => {
        // Add logic to handle activating the rider
        console.log("Activate", row);
    };

    const reloadGrid = () => {
        dispatch(fetchRiders());
    };

    const columns = [
        { field: 'fullName', headerName: 'Full Name', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 0.5 },
        { field: 'dateOfBirth', headerName: 'DOB', flex: 0.6, sortable: true },
        { field: 'emailId', headerName: 'Email', flex: 1 },
        { field: 'contactNumber', headerName: 'Contact Number', flex: 0.6 },
        { field: 'bloodGroup', headerName: 'Blood Group', flex: 0.5 },
        { field: 'vendorName', headerName: 'Vendor Name', flex: 1 },
        { field: 'referenceName', headerName: 'Reference Name', flex: 1 },
        {
          field: 'actions',
          headerName: 'Actions',
          flex: 0.6,
          sortable: false,
          filterable: false,
          renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <RiderFormModal riderID={params.row.riderID} reloadGrid={reloadGrid} />
              <IconButton
                color="secondary"
                size="small"
                onClick={() => handleActivate(params.row)}
                sx={{ width: "50px", Height: "50px" }}
              >
                <Tooltip title="Activate Rider" arrow>
                  <FontAwesomeIcon icon={(true) ? faSquare : faCheckSquare} color='blue' />
                </Tooltip>
              </IconButton>
            </div>
          ),
        },
    ];


    return (
        <Container component="main" maxWidth={false} sx={{ maxwidth: '100%'  }}>
            <CssBaseline />

        </Container>
    )

}

export default RiderList;
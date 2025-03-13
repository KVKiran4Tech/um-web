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
        { field: 'aadharCardNumber', headerName: 'Aadhaar Number', flex: 0.6  },
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
            <Box sx={{ mt: 0 }}>
                <Typography component="h3" variant="h5">
                    Riders
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            size="small"
                            id="search"
                            label="Search"
                            name="search"
                            autoComplete="off"
                            onChange={handleSearch}
                            sx={{ width: '50%' }}
                        />
                    </Grid>
                    <Grid size={6} sx={{ textAlign: 'right', marginTop: 2.5 }}>
                        <RiderFormModal reloadGrid={reloadGrid} />
                    </Grid>
                </Grid>
                <Box sx={{ minHeight: "100%", width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row.riderID}
                        rows={filteredRiders}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20, 50]}
                        paginationMode="client"
                        rowCount={filteredRiders.length}
                        disableRowSelectionOnClick
                        rowHeight={35}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        sx={{
                            "& .MuiDataGrid-footerContainer": {
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "nowrap"
                            },
                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                margin: "0 8px"
                            },
                            "& .MuiTablePagination-toolbar": {
                                alignItems: "center", // Ensures vertical centering of the pagination toolbar content
                                display: "flex",
                                flexWrap: "nowrap"
                            }
                        }}
                    />
                </Box>
            </Box>
        </Container>
    )

}

export default RiderList;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees } from '../../store/reducers/employeeSlice';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import { TextField, Box, Container, CssBaseline, Typography, Grid2 as Grid, IconButton, Button, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import EmployeeFormModal from './EmployeeFormModal';


const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
};

const EmployeeList = () => {
    const { employees, loading, error } = useSelector(state => state.employees);
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
        setFilteredEmployees(
            employees.filter((employee) =>
                Object.keys(employee).some((key) =>
                    String(employee[key]).toLowerCase().includes(value)
                )
            )
        );
    };

    const handleActivate = (row) => {
        // Add logic to handle activating the employee
        console.log("Activate", row);
    };

    const reloadGrid = () => {
        dispatch(fetchEmployees());
    };

    const iconStyle = { color: "black", fontSize: "1.5em" }

    const columns = [
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1  },
        { field: 'gender', headerName: 'Gender', flex: 0.5  },
        { field: 'dateOfBirth', headerName: 'DOB', flex: 0.6, sortable: true },
        { field: 'personalEmailID', headerName: 'Email', flex: 1  },
        { field: 'contactNumber', headerName: 'Contact Number', flex: 0.6  },
        { field: 'bloodGroup', headerName: 'Blood Group', flex: 0.5 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.6,
            sortable: false, filterable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <EmployeeFormModal employeeID={params.row.employeeID} reloadGrid={reloadGrid} />
                    <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleActivate(params.row)}
                        sx={{ width: "50px", Height: "50px" }}
                    >
                        <Tooltip title="Activate Employee" arrow>
                            <FontAwesomeIcon icon={(true)? faSquare : faCheckSquare } color='blue' />
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
                    Employees
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
                        <EmployeeFormModal reloadGrid={reloadGrid} />
                    </Grid>
                </Grid>
                <Box sx={{ minHeight: "100%", width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row.employeeID}
                        rows={filteredEmployees}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20, 50]}
                        paginationMode="client"
                        rowCount={filteredEmployees.length}
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
    );
}

export default EmployeeList;


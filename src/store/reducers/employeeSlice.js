import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://localhost:7248/api/';

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    let url = `${API_BASE_URL}Employee`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    return response.json();
    
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve(employees);
    //     }, 2000);
    //   });
});

export const fetchEmployeeById = createAsyncThunk('employees/fetchEmployeeById', async (id) => {
    const response = await fetch(`${API_BASE_URL}Employee/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch employee');
    }
    return response.json();
});


export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee) => {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
        redirect: "follow"
    };
    let url = `${API_BASE_URL}'Employee/ValidateAndCreateEmployeeID`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        throw new Error('Failed to add employee');
    }
    return response.json();
});

export const updateEmployeePersonalInformation = createAsyncThunk('employees/updateEmployeePersonalInformation', async (employeePI) => {
    let url = `${API_BASE_URL}Employee/ValidateAndCreateEmployeeID`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeePI)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update Employee Personal Information');
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return { message: await response.text() };
    }
});

export const updateEmployeeContactInformation = createAsyncThunk('employees/updateEmployeeContactInformation', async (employeeCI) => {
    let url = `${API_BASE_URL}Employee/UpdateContactInformation`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeCI)
    });
    if (!response.ok) {
        throw new Error('Failed to update Employee Contact Information');
    }
    return response.json();
});

export const updateEmployeeFinancialDetails = createAsyncThunk('employees/updateEmployeeFinancialDetails', async (employeeFD) => {
    let url = `${API_BASE_URL}Employee/UpdateFinancialDetails`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeFD)
    });
    if (!response.ok) {
        throw new Error('Failed to update Employee Financial Details');
    }
    return response.json();
});

export const updateEmployeeAdminSection = createAsyncThunk('employees/updateEmployeeAdminSection', async (employeeAS) => {
    const response = await fetch(`${API_BASE_URL}/${employeeAS.employeeID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeAS)
    });
    if (!response.ok) {
        throw new Error('Failed to update Employee Admin Section');
    }
    return response.json();
});

const employeeSlice = createSlice({ 
    name: 'employees', 
    initialState: { employees: [], loading: false, error: '', successMessage: '' },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.successMessage = 'Fetched All Employees successfully';
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchEmployeeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.successMessage = 'Fetched Employee by id successfully';
                state.employees = state.employees.map((employee) => {
                    if (employee.employeeID === action.payload.employeeID) {
                        return action.payload;
                    }
                    return employee;
                });
            })
            .addCase(fetchEmployeeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                state.successMessage = 'Added New Employee successfully';
                state.employees.push(action.payload);
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateEmployeePersonalInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeePersonalInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                if (action.payload === true) {
                    state.successMessage = 'Employee Personal Information updated successfully';
                } else {
                    state.employees = state.employees.map((employee) => {
                        if (employee.employeeID === action.payload.employeeID) {
                            return action.payload;
                        }
                        return employee;
                    });
                }
            })
            .addCase(updateEmployeePersonalInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateEmployeeContactInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeContactInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                if (action.payload === true) {
                    state.successMessage = 'Employee Contact Information updated successfully';
                } else {
                    state.employees = state.employees.map((employee) => {
                        if (employee.employeeID === action.payload.employeeID) {
                            return action.payload;
                        }
                        return employee;
                    });
                }
            })
            .addCase(updateEmployeeContactInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateEmployeeFinancialDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeFinancialDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = '';
                if (action.payload === true) {
                    state.successMessage = 'Employee Financial Details updated successfully';
                } else {
                    state.employees = state.employees.map((employee) => {
                        if (employee.employeeID === action.payload.employeeID) {
                            return action.payload;
                        }
                        return employee;
                    });
                }
            })
            .addCase(updateEmployeeFinancialDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateEmployeeAdminSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeAdminSection.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = state.employees.map((employee) => {
                    if (employee.employeeID === action.payload.employeeID) {
                        return action.payload;
                    }
                    return employee;
                });
            })
            .addCase(updateEmployeeAdminSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    }
})

export default employeeSlice.reducer;
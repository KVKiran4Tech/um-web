import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://localhost:7248/api/';

const riders = [
  { riderID: 1, vendorName:"Vendor A",referenceName:"Ref A",fullName:"John Doe",gender:"Male",dateOfBirth:"1990-01-01",aadharCardNumber:"123456789012",panNumber:"ABCDE1234F",bloodGroup:"O+",contactNumber:"9876543210",emailId:"johndoe@example.com"},
  { riderID: 2, vendorName:"Vendor B",referenceName:"Ref B",fullName:"Jane Smith",gender:"Female",dateOfBirth:"1985-05-15",aadharCardNumber:"234567890123",panNumber:"FGHIJ5678K",bloodGroup:"A-",contactNumber:"8765432109",emailId:"janesmith@example.com"},
  { riderID: 3, vendorName:"Vendor C",referenceName:"Ref C",fullName:"Alice Johnson",gender:"Female",dateOfBirth:"1992-07-20",aadharCardNumber:"345678901234",panNumber:"KLMNO9012P",bloodGroup:"B+",contactNumber:"7654321098",emailId:"alicejohnson@example.com"},
  { riderID: 4, vendorName:"Vendor D",referenceName:"Ref D",fullName:"Bob Brown",gender:"Male",dateOfBirth:"1988-03-30",aadharCardNumber:"456789012345",panNumber:"QRSTU3456V",bloodGroup:"AB+",contactNumber:"6543210987",emailId:"bobbrown@example.com"},
  { riderID: 5, vendorName:"Vendor E",referenceName:"Ref E",fullName:"Charlie Davis",gender:"Male",dateOfBirth:"1993-08-25",aadharCardNumber:"567890123456",panNumber:"WXYZA6789B",bloodGroup:"O-",contactNumber:"5432109876",emailId:"charliedavis@example.com"},
  { riderID: 6, vendorName:"Vendor F",referenceName:"Ref F",fullName:"Dana Lee",gender:"Female",dateOfBirth:"1995-12-10",aadharCardNumber:"678901234567",panNumber:"CDEFG8901H",bloodGroup:"B-",contactNumber:"4321098765",emailId:"danalee@example.com"},
  { riderID: 7, vendorName:"Vendor G",referenceName:"Ref G",fullName:"Eve Martinez",gender:"Female",dateOfBirth:"1987-11-05",aadharCardNumber:"789012345678",panNumber:"HIJKL0123M",bloodGroup:"A+",contactNumber:"3210987654",emailId:"evemartinez@example.com"},
  { riderID: 8, vendorName:"Vendor H",referenceName:"Ref H",fullName:"Frank Nelson",gender:"Male",dateOfBirth:"1991-04-18",aadharCardNumber:"890123456789",panNumber:"NOPQR4567S",bloodGroup:"AB-",contactNumber:"2109876543",emailId:"franknelson@example.com"},
  { riderID: 9, vendorName:"Vendor I",referenceName:"Ref I",fullName:"Grace O'Connor",gender:"Female",dateOfBirth:"1994-07-12",aadharCardNumber:"901234567890",panNumber:"TUVWX8901Y",bloodGroup:"O+",contactNumber:"1098765432",emailId:"graceoconnor@example.com"},
  { riderID: 10, vendorName:"Vendor J",referenceName:"Ref J",fullName:"Hank Parker",gender:"Male",dateOfBirth:"1989-02-22",aadharCardNumber:"012345678901",panNumber:"YZABC2345D",bloodGroup:"A-",contactNumber:"0987654321",emailId:"hankparker@example.com"},
  { riderID: 11, vendorName:"Vendor K",referenceName:"Ref K",fullName:"Ivy Quinn",gender:"Female",dateOfBirth:"1996-06-07",aadharCardNumber:"123456789012",panNumber:"EFGHI6789J",bloodGroup:"B+",contactNumber:"9876543210",emailId:"ivyquinn@example.com"},
  { riderID: 12, vendorName:"Vendor L",referenceName:"Ref L",fullName:"Jack Ryan",gender:"Male",dateOfBirth:"1990-09-14",aadharCardNumber:"234567890123",panNumber:"KLMNO1234P",bloodGroup:"O-",contactNumber:"8765432109",emailId:"jackryan@example.com"},
  { riderID: 13, vendorName:"Vendor M",referenceName:"Ref M",fullName:"Karen Scott",gender:"Female",dateOfBirth:"1986-10-30",aadharCardNumber:"345678901234",panNumber:"QRSTU5678V",bloodGroup:"A+",contactNumber:"7654321098",emailId:"karenscott@example.com"},
  { riderID: 14, vendorName:"Vendor N",referenceName:"Ref N",fullName:"Leo Turner",gender:"Male",dateOfBirth:"1992-03-03",aadharCardNumber:"456789012345",panNumber:"WXYZA9012B",bloodGroup:"AB+",contactNumber:"6543210987",emailId:"leoturner@example.com"},
  { riderID: 15, vendorName:"Vendor O",referenceName:"Ref O",fullName:"Mia Wallace",gender:"Female",dateOfBirth:"1997-05-20",aadharCardNumber:"567890123456",panNumber:"CDEFG3456H",bloodGroup:"B-",contactNumber:"5432109876",emailId:"miawallace@example.com"}
];

export const fetchRiders = createAsyncThunk('riders/fetchRiders', async () => {
  // let url = `${API_BASE_URL}Rider`;
  // const response = await fetch(url);
  // if (!response.ok) {
  //     throw new Error('Failed to fetch riders');
  // }
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(riders);
    }, 2000);
  });
});

export const addRider = createAsyncThunk('riders/addRider', async (rider) => {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rider),
        redirect: "follow"
    };
    const response = await fetch(API_BASE_URL+'Riders/ValidateAndCreateRiderID', requestOptions);
    if (!response.ok) {
        throw new Error('Failed to add rider');
    }
    return response.json();
});

export const updateRiderPersonalInformation = createAsyncThunk('riders/updateEmployeePersonalInformation', async (RiderPI) => {
    let url = `${API_BASE_URL}Rider`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(RiderPI)
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


export const fetchRiderById = createAsyncThunk('riders/fetchRiderById', async (id) => {
  // const response = await fetch(`${API_BASE_URL}rider/${id}`);
  // if (!response.ok) {
  //     throw new Error('Failed to fetch rider');
  // }
  // return response.json();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(riders.find((rider) => rider.riderID === id));
    }, 2000);
  });
});



const riderSlice = createSlice({ 
  name: 'riders', 
  initialState: { riders: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
          state.loading = false;
          state.riders = action.payload;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      })
      .addCase(fetchRiderById.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(fetchRiderById.fulfilled, (state, action) => {
          state.loading = false;
          state.riders = state.riders.map((rider) => {
              if (rider.riderID === action.payload.riderID) {
                  return action.payload;
              }
              return rider;
          });
      })
      .addCase(fetchRiderById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      })
  }
});

export default riderSlice.reducer;
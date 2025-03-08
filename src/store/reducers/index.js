import { combineReducers } from 'redux';
import employeeReducer from './employeeSlice';
import riderReducer from './riderSlice';


const rootReducer = combineReducers({
  employees: employeeReducer,
  riders: riderReducer
});

export default rootReducer;
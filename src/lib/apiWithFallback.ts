import { employeeAPI, attendanceAPI, departmentAPI, locationAPI } from './api';

export const attendanceAPIWithFallback = attendanceAPI;
export const employeeAPIWithFallback = employeeAPI;
export { departmentAPI as departmentAPIWithFallback } from './api';
export { locationAPI as locationAPIWithFallback } from './api';

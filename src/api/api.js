import axios from 'axios'
import store from '../vuex/store'
let base='';
export const getUserList = params => {return axios.post(`http://localhost:8080/public_service/user/listUsers`,params); };
export const findUser = params => {return axios.post(`http://localhost:8080/public_service/user/findUser`,params); };
export const createUser = params => {return axios.post(`http://localhost:8080/public_service/user/createUser`,params); };
export const userUpdate = params => {return axios.post(`http://localhost:8080/public_service/user/update`,params); };
export const findCollege = params => {return axios.post(`http://localhost:8080/public_service/college/findCollege`,params); };
export const listColleges = params => {return axios.post(`http://localhost:8080/public_service/college/listColleges`); };
export const createCollege = params => {return axios.post(`http://localhost:8080/public_service/college/createCollege`,params); };
export const deleteCollege = params => {return axios.post(`http://localhost:8080/public_service/college/deleteCollege`,params); };
export const collageUpdate = params => {return axios.post(`http://localhost:8080/public_service/college/update`,params); };
export const getOptions = params => {return axios.post(`http://localhost:8080/public_service/college/getOptions`,params); };
export const findDepartmentById = params => {return axios.post(`http://localhost:8080/public_service/department/findDepartmentById`,params); };
export const listDepartments = params => {return axios.post(`http://localhost:8080/public_service/department/listDepartments`,params); };
export const createDepartment = params => {return axios.post(`http://localhost:8080/public_service/department/createDepartment`,params); };
export const deleteDepartment = params => {return axios.post(`http://localhost:8080/public_service/department/deleteDepartment`,params); };
export const updateDepartment = params => {return axios.post(`http://localhost:8080/public_service/department/update`,params); };
export const findStudentById = params => {return axios.post(`http://localhost:8080/public_service/student/findStudentById`,params); };
export const listStudents = params => {return axios.post(`http://localhost:8080/public_service/student/listStudents`,params); };
export const createStudent = params => {return axios.post(`http://localhost:8080/public_service/student/createStudent`,params); };
export const studentUpdate = params => {return axios.post(`http://localhost:8080/public_service/student/update`,params); };
export const findRecordById = params => {return axios.post(`http://localhost:8080/public_service/record/findRecordById`,params); };
export const listRecords = params => {return axios.post(`http://localhost:8080/public_service/record/listRecords`,params); };
export const createRecord = params => {return axios.post(`http://localhost:8080/public_service/record/create`,params); };
export const recordUpdate = params => {return axios.post(`http://localhost:8080/public_service/record/update`,params); };
export const deleteRecord = params => {return axios.post(`http://localhost:8080/public_service/record/delete`,params); };



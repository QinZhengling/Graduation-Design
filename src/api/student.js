import request from '@/utils/request'

export default {
  getStudentList(searchModel) {
    return request({
      url: '/admin/studentList',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.studentName,
        college: searchModel.studentCollege,
        specializedSubject: searchModel.specializedSubject,
        studentClass: searchModel.studentClass
      }
    })
  },
  addStudentInfo(studentInfo) {
    return request({
      url: '/admin/addStudentInfo',
      method: 'post',
      data: studentInfo
    })
  },
  getStudentId(student_id) {
    return request({
      url: `/admin/student/${student_id}`,
      method: 'get'
    })
  },
  updateStudent(student) {
    return request({
      url: '/admin/updateStudent',
      method: 'put',
      data: student
    })
  },
  saveStudent(student) {
    if (student.id == null && student.id == undefined) {
      console.log(111);
      return this.addStudentInfo(student)
    } else {
      console.log(222);
      return this.updateStudent(student)
    }
  },
  deletedStudent(student_id) {
    return request({
      url: `/admin/student/${student_id}`,
      method: 'delete',
    })
  },
}

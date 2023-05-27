import request from '@/utils/request'

export default {
  getTeacherList(searchModel) {
    return request({
      url: '/admin/teacherList',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        college: searchModel.college,
      }
    })
  },
  addTeacher(teacher) {
    return request({
      url: '/admin/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getTeacherId(id) {
    return request({
      url: `/admin/${id}`,
      method: 'get'
    })
  },
  updateTeacher(teacher) {
    return request({
      url: '/admin/updateTeacher',
      method: 'put',
      data: teacher
    })
  },
  saveTeacher(teacher) {
    if (teacher.id == null && teacher.id == undefined) {
      console.log(111);
      return this.addTeacher(teacher)
    } else {
      console.log(222);
      return this.updateTeacher(teacher)
    }
  },
  deletedTeacher(id) {
    return request({
      url: `/admin/${id}`,
      method: 'delete',
    })
  },
}

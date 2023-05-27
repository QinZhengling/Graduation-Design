import request from '@/utils/request'

export default {
  getClassList(searchModel) {
    return request({
      url: '/admin/classList',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        classname: searchModel.studentName,
        college: searchModel.studentCollege,
        specializedSubject: searchModel.specializedSubject
      }
    })
  },
  addClassInfo(classInfo) {
    return request({
      url: '/admin/addClass',
      method: 'post',
      data: classInfo
    })
  },
  getClassId(class_id) {
    return request({
      url: `/admin/classInfo/${class_id}`,
      method: 'get'
    })
  },
  updateClass(classinfo) {
    return request({
      url: '/admin/updateClass',
      method: 'put',
      data: classinfo
    })
  },
  saveClass(classinfo) {
    if (classinfo.id == null && classinfo.id == undefined) {
      return this.addClassInfo(classinfo)
    } else {
      return this.updateClass(classinfo)
    }
  },
  deletedClass(class_id) {
    return request({
      url: `/admin/classInfo/${class_id}`,
      method: 'delete',
    })
  },
}

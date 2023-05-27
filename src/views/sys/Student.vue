<template>
  <div>
    <el-card id="search" class="box-card">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.studentName" placeholder="学生名称查询" clearable />
          <el-input v-model="searchModel.studentCollege" placeholder="学院查询" clearable />
          <el-input v-model="searchModel.specializedSubject" placeholder="专业查询" clearable />
          <el-input v-model="searchModel.studentClass" placeholder="班级查询" clearable />
          <el-button type="primary" round icon="el-icon-search" @click="getStudentList">搜索</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openEditUi(null)"></el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="userList" style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="studentId" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="studentName" label="姓名" width="140">
        </el-table-column>
        <el-table-column prop="studentCollege" label="学院" width="180">
        </el-table-column>
        <el-table-column prop="specializedSubject" label="专业" width="140">
        </el-table-column>
        <el-table-column prop="studentClass" label="班级" width="140">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 0">男</span>
            <span v-if="scope.row.gender == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="living" label="宿舍">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
              @click="openEditUi(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleted(scope.row)"></el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchModel.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="searchModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 用户信息添加 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="clearFrom">
      <el-form :model="studentfrom" :rules=rules ref="studentFormRef">
        <el-form-item label="学生名称" prop="studentName" :label-width="formLabelWidth">
          <el-input v-model="studentfrom.studentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="studentId">
          <el-input v-model="studentfrom.studentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="studentfrom.id == null || studentfrom.id == undefined" label="密码"
          :label-width="formLabelWidth" prop="password">
          <el-input v-model="studentfrom.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="学院" :label-width="formLabelWidth" prop="studentCollege">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth" prop="specializedSubject">
          <el-input v-model="studentfrom.specializedSubject" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth" prop="studentClass">
          <el-input v-model="studentfrom.studentClass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍" :label-width="formLabelWidth" prop="living">
          <el-input v-model="studentfrom.living" autocomplete="off"></el-input>
        </el-form-item>
        <el-radio-group v-model="radio" @change="changeTheme" class="radio">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
        <el-upload class="upload" ref="upload" action="string" :file-list="fileList" :auto-upload="false"
          :http-request="uploadFile" 自定义上传的方法 :on-change="handleChange" :on-preview="handlePreview"
          :on-remove="handleRemove" multiple="multiple" v-if="studentfrom.id == null || studentfrom.id == undefined">
          <el-button size="small" type="primary" @click="delFile" class="select">选取文件</el-button>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStudent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/student'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      var reg_tel = /^[\u4e00-\u9fa5]+\d{2}-\d{2}$/u;
      if (!reg_tel.test(value)) {
        return callback(new Error('班级格式错误,如软件19-03'));
      }
      callback();
    };
    return {
      options: [{
        value: '石油与天然气工程学院'
        // label: '石油与天然气工程学院'
      }, {
        value: '冶金与材料工程学院',
        // label: '系主任'
      }, {
        value: '机械与动力工程学院',
        // label: '教务处'
      }, {
        value: '电气工程学院',
        // label: '教务处'
      }, {
        value: '化学化工学院',
        // label: '教务处'
      }, {
        value: '建筑工程学院',
        // label: '教务处'
      }, {
        value: '安全工程学院（应急管理学院）',
        // label: '教务处'
      }, {
        value: '智能技术与工程学院',
        // label: '教务处'
      }, {
        value: '马克思主义学院',
        // label: '教务处'
      }, {
        value: '工商管理学院',
        // label: '教务处'
      }, {
        value: '法政与经贸学院',
        // label: '教务处'
      }, {
        value: '数理与大数据学院',
        // label: '教务处'
      }, {
        value: '外国语学院',
        // label: '教务处'
      }, {
        value: '人文艺术学院',
        // label: '教务处'
      }, {
        value: '职业技术师范学院（继续教育学院、自考办）',
        // label: '教务处'
      }],
      fileList: [],
      value: '',
      radio: 1,
      title: null,
      dialogFormVisible: false,
      studentfrom: {},
      studentAccount: {},
      formLabelWidth: '130px',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      rules: {
        studentName: [
          { required: true, message: '请输入学生名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10字符之间', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '请输入初始工号', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16字符之间', trigger: 'blur' }
        ],
        studentClass: [
          { required: true, message: '请输入学生班级', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16字符之间', trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    deleted(student) {
      this.$confirm(`您确认删除用户${student.studentName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.deletedStudent(student.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          });
          this.getStudentList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveStudent() {
      // console.log(this.radio);
      console.log(this.value);
      this.$refs.studentFormRef.validate((valid) => {
        if (valid) {
          console.log(this.studentfrom);
          this.studentfrom.gender = this.radio
          this.studentfrom.studentCollege = this.value
          if (this.title == "修改学生") {
            studentApi.saveStudent(this.studentfrom).then(res => {
              this.$message({
                message: res.message,
                type: 'success'
              })
            })
          }
          else {
            this.studentfrom.credit = 0
            let StudentFrom = JSON.stringify(this.studentfrom);
            let format = new FormData();
            format.append("file", this.fileList[0].raw)
            format.append("data", StudentFrom)
            studentApi.saveStudent(format).then(res => {
              this.$message({
                message: res.message,
                type: 'success'
              })
            })
          }
          this.dialogFormVisible = false
          this.getStudentList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    delFile() {
      this.fileList = [];
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log(this.fileList, "sb");
    },
    //自定义上传文件
    uploadFile(file) {
      this.formData.append("file", file.file);
      // console.log(file.file, "sb2");
    },
    //删除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件
    handlePreview(file) {
      console.log(file);
    },
    clearFrom() {
      this.studentfrom = {}
      this.$refs.studentFormRef.clearValidate();
    },

    changeTheme(val) {
      console.log(val)
      return val;
    },
    openEditUi(id) {
      if (id == null) {
        this.title = "新增学生"
      }
      else {
        this.title = "修改学生"
        studentApi.getStudentId(id).then(res => {
          this.studentfrom = res.data;
          console.log(res.data);
          this.radio = res.data.gender
          this.value = res.data.studentCollege
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getStudentList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getStudentList();
    },
    getStudentList() {
      // console.log(this.searchModel);
      studentApi.getStudentList(this.searchModel).then(res => {
        console.log(res.data);
        this.userList = res.data.rows;
        this.total = res.data.total;
      });
    },


  },
  mounted() {
    this.getStudentList()
  },
  setup() {
    return {
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
#search .el-input {
  width: 300px;
  margin-right: 20px;
}

.el-dialog .el-input {
  width: 80%;
}

.select {
  display: block;
  position: relative;
  left: 130px;
  top: 35px;
  width: 30%;
  padding-top: -40px;
}

.radio {
  display: block;
  position: relative;
  left: 130px;
  top: 10px;
  width: 20%;
}

.upload {
  position: relative;
  padding-top: 20px;
  width: 160px;
  top: 20px;
  left: 130px;
}

.select {
  position: relative;
  left: 0;
  top: 0px;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 2px 2px 4px 1px rgba(119, 119, 119, 0.25);
}
</style>

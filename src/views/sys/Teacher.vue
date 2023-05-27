<template>
  <div>
    <el-card class="box-card" id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" placeholder="教师名称查询" clearable></el-input>
          <el-input v-model="searchModel.college" placeholder="学院查询" clearable></el-input>
          <el-button type="primary" round icon="el-icon-search" @click="getTeacherList">搜索</el-button>
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
        <el-table-column prop="id" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="teacherId" label="工号" width="180">
        </el-table-column>
        <el-table-column prop="teacherName" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 0">男</span>
            <span v-if="scope.row.gender == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="roles" label="权限" width="180">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.roles == 1">辅导员</el-tag>
            <el-tag v-show="scope.row.roles == 2">系主任</el-tag>
            <el-tag v-show="scope.row.roles == 3">教务处</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="teacherCollege" label="学院">
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
      <el-form :model="teacherfrom" :rules=rules ref="teacherFormRef">
        <el-form-item label="教师名称" prop="teacherName" :label-width="formLabelWidth">
          <el-input v-model="teacherfrom.teacherName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth" prop="teacherId">
          <el-input v-model="teacherfrom.teacherId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="teacherfrom.id == null || teacherfrom.id == undefined" label="密码"
          :label-width="formLabelWidth" prop="password">
          <el-input v-model="teacherfrom.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="teacherfrom.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院" :label-width="formLabelWidth" prop="teacherCollege">
          <el-input v-model="teacherfrom.teacherCollege" autocomplete="off"></el-input>
        </el-form-item>
        <el-radio-group v-model="radio" @change="changeTheme" class="radio">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
        <el-select v-model="value" placeholder="请选择" class="select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTeacher">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher';
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg_tel.test(value)) {
        return callback(new Error('联系电话格式错误'));
      }
      callback();
    };
    return {
      options: [{
        value: '选项1',
        label: '辅导员'
      }, {
        value: '选项2',
        label: '系主任'
      }, {
        value: '选项3',
        label: '教务处'
      }],
      value: '',
      radio: 1,
      title: null,
      dialogFormVisible: false,
      teacherfrom: {},
      formLabelWidth: '130px',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      rules: {
        teacherName: [
          { required: true, message: '请输入教师名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16字符之间', trigger: 'blur' }
        ],
        teacherId: [
          { required: true, message: '请输入初始工号', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16字符之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        teacherCollege: [
          { required: true, message: '请输入教师学院', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    deleted(teacher) {
      this.$confirm(`您确认删除用户${teacher.teacherName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.deletedTeacher(teacher.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          });
          this.getTeacherList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveTeacher() {
      // console.log(this.radio);
      // console.log(this.value);
      this.$refs.teacherFormRef.validate((valid) => {
        if (valid) {
          console.log(this.teacherfrom);
          this.teacherfrom.gender = this.radio
          if (this.value == "辅导员") {
            this.value = 1;
          }
          else if (this.value == "系主任") {
            this.value = 2;
          }
          else {
            this.value = 3;
          }
          this.teacherfrom.roles = this.value
          teacherApi.saveTeacher(this.teacherfrom).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            })
          })
          this.dialogFormVisible = false
          this.getTeacherList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearFrom() {
      this.teacherfrom = {}
      this.$refs.teacherFormRef.clearValidate();
    },

    changeTheme(val) {
      console.log(val)
      return val;
    },
    openEditUi(id) {
      if (id == null) {
        this.title = "新增教师"
      }
      else {
        this.title = "修改教师"
        teacherApi.getTeacherId(id).then(res => {
          this.teacherfrom = res.data;
          console.log(res.data.roles);
          this.radio = res.data.gender
          this.value = this.options[res.data.roles - 1].label
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getTeacherList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getTeacherList();
    },
    getTeacherList() {
      teacherApi.getTeacherList(this.searchModel).then(res => {
        console.log(res.data);
        this.userList = res.data.rows;
        this.total = res.data.total;
      });
    },
  },
  mounted() {
    this.getTeacherList()
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
}

.radio {
  display: block;
  position: relative;
  left: 130px;
  top: 10px;
  width: 20%;
}
</style>

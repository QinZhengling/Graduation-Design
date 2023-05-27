<template>
  <div>
    <el-card class="box-card" id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.studentName" placeholder="班级名称查询" clearable></el-input>
          <el-input v-model="searchModel.studentCollege" placeholder="学院查询" clearable></el-input>
          <el-input v-model="searchModel.specializedSubject" placeholder="专业查询" clearable></el-input>
          <el-button type="primary" round icon="el-icon-search" @click="getClassList">搜索</el-button>
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
        <el-table-column prop="className" label="班级" width="220">
        </el-table-column>
        <el-table-column prop="classSize" label="人数" width="220">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="220">
        </el-table-column>
        <el-table-column prop="specializedSubject" label="专业" width="220">
        </el-table-column>
        <el-table-column prop="college" label="学院" width="280">
        </el-table-column>
        <el-table-column label="操作" width="220">
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
      <el-form :model="classfrom" :rules=rules ref="classFormRef">
        <el-form-item label="班级" :label-width="formLabelWidth" prop="className">
          <el-input v-model="classfrom.className" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth" prop="grade">
          <el-input v-model="classfrom.grade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院" :label-width="formLabelWidth" prop="college">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth" prop="specializedSubject">
          <el-input v-model="classfrom.specializedSubject" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="辅导员ID" :label-width="formLabelWidth" prop="teacherId">
          <el-input v-model="classfrom.teacherId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classApi from "@/api/classInfo"
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
        value: '石油与天然气工程学院',
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
      classfrom: {},
      formLabelWidth: '130px',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      rules: {
        // className: [
        //   { required: true, message: '请输入学生名', trigger: 'blur' },
        //   { min: 2, max: 10, message: '长度在2-10字符之间', trigger: 'blur' }
        // ],
        // studentId: [
        //   { required: true, message: '请输入初始工号', trigger: 'blur' },
        //   { min: 6, max: 16, message: '长度在6-16字符之间', trigger: 'blur' }
        // ],
        className: [
          { required: true, message: '请输入班级', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    deleted(classinfo) {
      this.$confirm(`您确认删除班级${classinfo.className}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classApi.deletedClass(classinfo.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          });
          this.getClassList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveClass() {
      // console.log(this.radio);
      console.log(this.value);
      this.$refs.classFormRef.validate((valid) => {
        if (valid) {
          console.log(this.classfrom);
          this.classfrom.college = this.value
          classApi.saveClass(this.classfrom).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getClassList();
          })
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearFrom() {
      this.classfrom = {}
      this.$refs.classFormRef.clearValidate();
    },

    changeTheme(val) {
      console.log(val)
      return val;
    },
    openEditUi(id) {
      if (id == null) {
        this.title = "新增班级"
      }
      else {
        this.title = "修改班级"
        classApi.getClassId(id).then(res => {
          this.classfrom = res.data;
          console.log(res.data);
          this.radio = res.data.gender
          this.value = res.data.college
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getClassList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getClassList();
    },
    getClassList() {
      // console.log(this.searchModel);
      classApi.getClassList(this.searchModel).then(res => {
        console.log(res.data);
        this.userList = res.data.rows;
        this.total = res.data.total;
      });
    },


  },
  mounted() {
    this.getClassList()
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

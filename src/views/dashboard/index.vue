<template>
  <div class="dashboard-container">
    <el-card class="box-card card1">
      <div class="welcome">
        欢迎来到后台管理中心<br />
      </div>
      <div class="word1">欢迎访问创新学分认定管理系统后台中心，使用时请注意相关事项！</div>
      <div class="img"><img src="@/assets/welcome.svg" alt="" /></div>
    </el-card>
    <!-- <el-card class="card2">
      <div class="txt">学生人数</div>
      <div class="number">99人</div>
    </el-card>

    <el-card class="card3">
      <div class="txt">教师人数</div>
      <div class="number">99人</div>
    </el-card>
    <el-card class="card4">
      <div class="txt">班级数量</div>
      <div class="number">99人</div>
    </el-card> -->
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      searchModel: {}
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

#search .el-input {
  width: 300px;
  margin-right: 20px;
}

.card1 {
  position: relative;
  height: 300px;
}

.welcome {
  position: absolute;
  top: 80px;
  left: 100px;
  font-size: 56px;
  font-weight: 600;
}

.word1 {
  position: absolute;
  top: 150px;
  left: 104px;
  font-size: 18px;
  color: rgb(103, 107, 107);
}

.img {
  position: absolute;
  top: -146px;
  right: 210px;
  width: 600px;
}

.img img {
  width: 100%;
  height: 100%;
}

.card2 {
  position: relative;
  top: 15px;
  width: 49%;
  float: left;
  background-image: linear-gradient(to bottom right, rgb(143, 132, 237), rgb(167, 70, 211));
  box-shadow: 5px 15px 30px rgba(167, 70, 211, 0.5);
  border-radius: 20px 80px 20px;
  border: none;

  .txt {
    font-size: 36px;
    position: relative;
    left: 140px;
    top: 12px;
    color: #fff;
  }

  .number {
    font-size: 42px;
    position: relative;
    left: 485px;
    top: -30px;
    margin-bottom: -30px;
    color: #fff;
  }

}

.card3 {
  position: relative;
  top: 15px;
  left: 2%;
  width: 49%;
  background-image: linear-gradient(to bottom right, rgb(143, 132, 237), rgb(167, 70, 211));
  box-shadow: 5px 15px 30px rgba(167, 70, 211, 0.5);
  border-radius: 20px 80px 20px;
  border: none;

  .txt {
    font-size: 36px;
    position: relative;
    left: 140px;
    top: 12px;
    color: #fff;
  }

  .number {
    font-size: 42px;
    position: relative;
    left: 485px;
    top: -30px;
    margin-bottom: -30px;
    color: #fff;
  }
}

.card4 {
  position: relative;
  margin: auto;
  width: 50%;
  margin-top: 40px;
  background-image: linear-gradient(to bottom right, rgb(143, 132, 237), rgb(167, 70, 211));
  box-shadow: 5px 15px 30px rgba(167, 70, 211, 0.5);
  border-radius: 20px 80px 20px;
  border: none;

  .txt {
    font-size: 36px;
    position: relative;
    left: 140px;
    top: 12px;
    color: #fff;
  }

  .number {
    font-size: 42px;
    position: relative;
    left: 485px;
    top: -30px;
    margin-bottom: -30px;
    color: #fff;
  }
}
</style>

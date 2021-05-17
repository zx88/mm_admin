<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="../assets/logo.png"
          alt=""
        >
        <span>喵喵网管理后台</span>
      </div>
      <el-button
        type="danger"
        @click="logout"
      >
        退出登录
      </el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div
          class="toggle_button"
          @click="toggleCollapse"
        >
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" />
        </div>
        <el-menu
          :default-active="$route.path"
          router
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#00B17C"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="menuIcon[item.id]" />
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="item2 in item.children"
              :key="item2.id"
              :index="'/' + item2.path"
              @click="saveNavState('/' + item2.path)"
            >
              <template slot="title">
                <i class="el-icon-menu" />
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单
      menulist: [],
      menuIcon: {
        125: 'el-icon-user',
        103: 'el-icon-set-up',
        101: 'el-icon-shopping-bag-2',
        102: 'el-icon-tickets',
        145: 'el-icon-data-analysis'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 切换导航栏折叠展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container{
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    color: #fff;
    >div{
        display: flex;
        align-items: center;
        margin-left: 10px;
        img{
            margin-right: 10px;
            width: 50px;
        }
    }
    .el-button{
      margin-right: 15px;
    }
}
.el-aside {
    background-color: #333744;
    // display: block;
    // position: absolute;
    // left: 0;
    // top: 60px;
    // bottom: 0;
    .el-menu{
        border-right: none;
    }
}
.el-main {
    background-color: #E9EEF3;
    // position: absolute;
    // left: 200px;
    // right: 0;
    // top: 60px;
    // bottom: 0;
    // overflow-y: scroll;
}
.toggle_button{
    background-color: #4a5064;
    text-align: center;
    color: #FFF;
    line-height: 25px;
    cursor: pointer;
}
</style>

<template>
  <div>
    <!-- 面包靴导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }"> 首页 </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="ID"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: #21a67c"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level == 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select 
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="addCateDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      catelist: [],
      //请求参数
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总条数
      total: 0,
      //表格数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 自定义魔板列
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          // 自定义魔板列
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          // 自定义魔板列
          type: "template",
          template: "opt",
        },
      ],
      // 添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 父级分类id
        cat_pid: 0,
        // 分类等级
        cat_level: 0,
      },
      // 添加表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类对象
      ParentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(this.catelist);
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pageNum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败!");
      }
      this.ParentCateList = res.data
    },
    // 选择项发生变化
    parentCateChange () {
      console.log(this.selectedKeys);
    }
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
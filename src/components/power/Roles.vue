<template>
  <div>
    <!-- 面包靴导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }"> 首页 </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['borbottom', i1 === 0 ? 'bortop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bortop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleById(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRoleDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="roleDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="addRoleRules"
        :model="addRole"
        :rules="addRoleRules"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input
            v-model="addRole.roleName"
            placeholder="请输入角色名"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="addRole.roleDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <!-- 主体区域 -->
      <el-form
        ref="editRoleRules"
        :model="editRole"
        :rules="editRoleRules"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRigheDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all 
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="setRightDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="allotRights">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      rolelist: [],
      // 添加角色的表单数据
      addRole: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表单验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 添加角色对话框显示和隐藏
      roleDialogVisible: false,
      //控制修改用户对话框隐藏和显示
      editDialogVisible: false,
      //查询到的角色对象
      editRole: {},
      //修改表单验证规则
      editRoleRules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      //控制分配权限对话框显示和隐藏
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defkeys: [],
      roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      // this.$message.success("获取角色列表成功!");
      this.rolelist = res.data;
    },
    // 展示编辑角色对话框
    async editRoleById(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.editRole = res.data;
      this.editDialogVisible = true;
    },
    // 提交编辑角色
    editRoleInfo() {
      this.$refs.editRoleRules.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRole.roleId}`,
          {
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色信息失败");
        }
        //成功后隐藏对话框/刷新列表/提示成功
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("修改角色信息成功");
      });
    },
    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除操作");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
    // 添加角色对话框关闭
    roleDialogClosed() {
      this.$refs.addRoleRules.resetFields();
      this.addRole = { ...this.addRole, roleDesc: "", roleName: "" };
    },
    // 添加角色
    addRoles() {
      this.$refs.addRoleRules.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`roles`, this.addRole);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    //根据id删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除操作");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      // this.getRolesList();
      role.children = res.data;
    },
    // 显示分配权限对话框
    async showSetRoleDialog(role) {
      this.roleId = role.id

      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败!");
      }
      this.$message.success("获取权限列表成功!");
      this.rightsList = res.data;
      // 递归获取三级权限id
      this.getLeafKeys(role, this.defkeys)

      this.setRightDialogVisible = true;
    },
    getLeafKeys (node, arr) {
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 分配权限对话框关闭
    setRigheDialogClosed () {
      this.defkeys = []
    },
    // 点击确定为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      console.log(this.roleId);
      console.log(idStr);
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr} );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功!");
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bortop {
  border-top: 1px solid #eee;
}
.borbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
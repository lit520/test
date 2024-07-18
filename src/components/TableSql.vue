<template>
  <div>
    <h1>用户列表</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>
            <button @click="updateUser(user.id)">更新</button>
            <button @click="deleteUser(user.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <input v-model="newName" placeholder="输入新用户名" />
    <button @click="addUser">添加用户</button>
  </div>
</template>  
  
<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      newName: "",
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/api/query");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async addUser() {
      if (!this.newName.trim()) return;
      try {
        await axios.post("http://localhost:3000/api/add", {
          name: this.newName,
          age: 20,
        });
        this.newName = "";
        this.fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
    async updateUser(userId) {
      try {
        await axios.put(`http://localhost:3000/api/update/${userId}`, {
          name: "更新后的名字",
        });
        this.fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:3000/api/delete/${userId}`);
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },
};
</script>  
  
<style scoped>
/* 你的样式 */
</style>
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
        await axios.post(`http://localhost:3000/api/update/${userId}`, {
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
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

/* 标题样式 */
h1 {
  color: #333;
  text-align: center;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

/* 操作按钮样式 */
td button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

td button:first-child {
  background-color: #4caf50; /* 绿色 */
  color: white;
}

td button:last-child {
  background-color: #f44336; /* 红色 */
  color: white;
}

td button:hover {
  opacity: 0.8;
}

/* 输入框和添加按钮样式 */
input[type="text"] {
  padding: 10px;
  margin-top: 20px;
  width: calc(100% - 22px); /* 减去两边padding的大小 */
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="button"] {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="button"]:hover {
  opacity: 0.8;
}
</style>
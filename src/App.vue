<template>
  <TableSql />
</template>

<script>
import TableSql from "./components/TableSql.vue";

export default {
  name: "App",
  components: {
    TableSql,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

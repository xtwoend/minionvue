<template>
<Col :span="spanLeft" class="layout-menu-left" :xs="0" :sm="0" :md="4" :lg="4">
  <Menu :active-name="$store.state.options.activeMenu" :open-names="groupActive" theme="light" width="auto" @on-select="openPage" @on-open-change="openGroup">
    <div class="layout-logo-left"></div>
    <div class="search">
      <Input v-model="search" icon="search" placeholder="Search..." ></Input>
    </div>
    <MenuItem name="dashboard">
      <Icon type="speedometer"></Icon>
      Dashboard
    </MenuItem>
    <Submenu name="post-group">
      <template slot="title">
        <Icon type="ios-paper"></Icon>
        Posts
      </template>
      <MenuItem name="posts">List</MenuItem>
      <MenuItem name="posts/create">Create</MenuItem>
      <MenuItem name="category">Category</MenuItem>
      <MenuItem name="tags">Tags</MenuItem>
    </Submenu>
  </Menu>
</Col>
</template>

<script>
export default {
  name: 'aside',
  data () {
    return {
      spanLeft: 4,
      currentActive: '',
      groupActive: [],
      search: ''
    }
  },
  methods: {
    openPage (page) {
      this.$store.commit('options/SET_ACTIVE', page)
      this.$router.push('/' + page)
    },
    openGroup (group) {
      this.groupActive = group
    }
  }
}
</script>

<style lang="css" scoped>
.search {
  width: 90%;
  margin: 15px auto;
}
</style>

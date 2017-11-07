<template>
<Row type="flex" class="layout">
  <aside-bar/>
  <Col :span="spanRight" :xs="24" :sm="24" :md="20" :lg="20">
    <top-navbar/>
    <nuxt/>
  </Col>
</Row>
</template>

<script>
import Navbar from '~/components/common/header'
import Aside from '~/components/common/aside'

export default {
  components: {
    'top-navbar': Navbar,
    'aside-bar': Aside
  },
  data () {
    return {
      spanLeft: 4,
      spanRight: 20
    }
  }
}
</script>

<style>
.layout{
  /*border: 1px solid #d7dde4;*/
  /*border-radius: 4px;*/
  background: #eee;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.layout-breadcrumb{
  padding: 10px 15px 0;
}
.layout-content{
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  /*background: #fff;*/
  /*border-radius: 4px;*/
}
.layout-content-main{
  padding: 10px;
}
.layout-copy{
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left{
  background: #fafafa;
}
.layout-header{
  position: sticky;
  /*height: 60px;*/
  background: #fafafa;
  box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05);
  z-index: 1000;
}
.layout-logo-left{
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.layout-ceiling-main a{
  color: #9ba7b5;
}
.layout-hide-text .layout-text{
  display: none;
}
.ivu-col{
  transition: width .2s ease-in-out;
}

.ivu-row-flex {
  height: 100vh;
}
.ivu-menu-light {
  background-color: #fafafa;
}

.sub--navbar {
  display: flex;
  justify-content: space-between;
  padding: 9px 15px;
  height: 50px;
  background-color: #fafafa;
  box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05);
  z-index: 999;
  position: relative;
}
.main-content {
  position: relative;
  height: 100%;
}

@media (max-width: 768px) {
  .layout {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .vbox > .scrollable {
    position: relative !important;
  }
}
</style>

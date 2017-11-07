<template>
<div>
  <div class="sub--navbar">
    <Breadcrumb>
      <BreadcrumbItem href="/dashboard">
        <Icon type="ios-home"></Icon>
      </BreadcrumbItem>
      <BreadcrumbItem>Posts</BreadcrumbItem>
    </Breadcrumb>
    <ButtonGroup class="toolbar">
      <Button type="info" icon="plus" @click="$router.push('posts/create')">Create</Button>
      <Button type="success" icon="refresh" @click="refreshData">Refresh</Button>
      <Button type="error" icon="trash-a" @click="deleteItem">Delete</Button>
    </ButtonGroup>
  </div>
  <div class="layout-content">
    <Card :bordered="false">
      <p slot="title">Posts</p>
      <div slot="extra">
        <Input v-model="search" icon="search"  placeholder="Search..." style="width: 300px" @on-enter="searchData"></Input>
      </div>
      <div>
        <Table :columns="tableHeaders" :data="data" size="small" ref="table" class="no-border" stripe @on-sort-change="sortData" @on-selection-change="selectData"></Table>
        <Page :total="total" :current="currentPage" size="small" show-total class="pagging-table" @on-change="toPage" :page-size="rpp"></Page>
      </div>
    </Card>
  </div>
  <div class="layout-copy">
    2017 &copy; minionCMS
  </div>
</div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  // middleware: 'auth',
  data () {
    return {
      tableHeaders: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Title',
          key: 'title',
          width: 400,
          sortable: true
        },
        {
          title: 'Category',
          key: 'categories',
          width: 200,
          sortable: true
        },
        {
          title: 'Comments',
          key: 'comment_count',
          width: 150,
          align: 'center',
          sortable: true
        },
        {
          title: 'Created At',
          key: 'created_at',
          width: 180,
          sortable: true
        },
        {
          title: ' ',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'edit'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    console.log(params.index)
                  }
                }
              }, 'Edit')
            ])
          }
        }
      ],
      search: '',
      data: [],
      currentPage: 1,
      total: 0,
      rpp: 10,
      query: {},
      selected: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    sortData (params) {
      this.query.sort = params.key
      this.query.order = params.order
      this.fetchData()
    },
    selectData (selected) {
      this.selected = selected
    },
    searchData () {
      this.query.q = this.search
      this.fetchData()
    },
    toPage (page) {
      this.currentPage = page
      this.fetchData()
    },
    refreshData () {
      this.fetchData()
    },
    deleteItem () {
      if (this.selected.length === 0) {
        this.$Modal.confirm({
          title: 'Ops..',
          content: 'Please select first..'
        })
      } else {
        let ids = []
        _.forEach(this.selected, function (v, k) {
          ids.push(v.id)
        })
        let _this = this
        this.$Modal.confirm({
          title: 'Delete Item',
          content: 'Data yang telah di hapus tidak akan bisa di undo. Apakah anda yankin?',
          loading: true,
          onOk: async function () {
            let res = await axios.post('http://minion5.5.dev/api/v1/posts/delete', {
              ids: ids
            })
            if (res.data.success) {
              _this.fetchData()
              this.$Modal.remove()
              this.$Message.info('data berhasil di hapus')
            }
          }
        })
      }
    },
    async fetchData () {
      this.query.page = this.currentPage
      this.query.rpp = this.rpp
      let { data } = await axios.get('http://minion5.5.dev/api/v1/posts', { params: this.query })
      this.data = data.data
      this.total = data.meta.pagination.total
      this.currentPage = data.meta.pagination.current_page
      this.rpp = data.meta.pagination.per_page
    }
  }
}
</script>

<style lang="css" scoped>
.ivu-card {
    border-radius: 0;
}
.ivu-card-body {
    padding: 0 !important;
}
.no-border {
    border: none !important;
}
.pagging-table {
    padding: 14px;
    text-align: right;
}
.ivu-page-total {
    float: left;
}
.ivu-card-extra.search {
  top: 9px !important;
}
</style>

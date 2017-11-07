<template>
<div>
  <div class="category-wrapper">
    <div v-for="cat in categories">
      <div class="checkbox i-checks no-margin">
        <label>
          <input type="checkbox" name="categories" v-model="category" :value="cat.id" @change="selected">
          {{ cat.name }}
          <i></i>
        </label>
      </div>
      <div class="checkbox i-checks no-margin sub-category" v-if="cat.children.length > 0" v-for="sub in cat.children">
        <label>
          <input type="checkbox" name="categories" v-model="category" :value="sub.id" @change="selected">
            &boxh;{{ sub.name }}
          <i></i>
        </label>
      </div>
    </div>
  </div>
  <a @click.stop.prevent="categoryForm = !categoryForm">+ Add New Category</a>
  <div v-if="categoryForm">
    <FormItem label="">
      <Input v-model="newCategory.name"></Input>
    </FormItem>
    <FormItem label="">
      <Select v-model="newCategory.parent_id" style="width:100%">
        <Option v-for="parent in categories" :value="parent.id" :key="parent.value">{{ parent.name }}</Option>
      </Select>
    </FormItem>
    <Button type="primary" size="small" @click="addCategory">Add New Category</Button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import forEach from 'lodash/forEach'

export default {
  name: 'category',
  props: {
    data: {
      type: Array,
      default: ''
    },
    checked: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      category: this.checked,
      categories: this.data,
      categoryForm: false,
      newCategory: {
        name: '',
        parent_id: 0
      }
    }
  },
  methods: {
    selected () {
      this.$emit('selectcat', this.category)
    },
    async addCategory () {
      try {
        let { data } = await axios.post('http://minion5.5.dev/api/v1/categories', this.newCategory)
        this.categories = this.categories.concat(data.data)
        this.category.push(data.data.id)
        this.categoryForm = false
      } catch (e) {
        let res = e.response.data
        forEach(res.errors, (val, key) => {
          this.errors.add(key, val.join(', '), 'unique')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  margin-right: 15px;
}
.category-wrapper {
  background-color: #fdfdfd;
  padding: 10px;
  border: 1px solid #ddd;
}
.no-margin {
  margin-bottom: 0;
  margin-top: 0; 
}
// .sub-category {
//   > label {
//     padding-left: 45px;
//   }
// }
</style>
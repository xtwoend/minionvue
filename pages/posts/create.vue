<template>
<div class="main-content">
  <div class="sub--navbar">
    <Breadcrumb>
      <BreadcrumbItem href="/dashboard">
        <Icon type="ios-home"></Icon>
      </BreadcrumbItem>
      <BreadcrumbItem href="/posts">Posts</BreadcrumbItem>
      <BreadcrumbItem>Create</BreadcrumbItem>
    </Breadcrumb>
    <ButtonGroup class="toolbar">
      <Button type="success" @click="saveFrom">Simpan</Button>
      <Button type="warning" @click="resetForm">Reset</Button>
    </ButtonGroup>
  </div>
  <Form ref="post-form" :model="form" :rules="formValidate" label-position="top">
    <Row class="form--wrapper">
      <Col class="form--content" :xs="24" :sm="24" :md="18" :lg="18">
        <div class="vbox">
          <div class="scrollable wrapper hover wf">
            <FormItem label="">
              <Input v-model="form.title" placeholder="Masukan judul disini" size="large" class="form--title"></Input>
            </FormItem>
            <FormItem label="">
              <Input v-model="form.slug">
                <span slot="prepend">{{ domain }}</span>
              </Input>
            </FormItem>
            <FormItem label="">
              <Input v-model="form.excerpt" type="textarea" :autosize="true" placeholder="excerpt.. "></Input>
            </FormItem>
            <vue-editor v-model="form.content" ref="editor"></vue-editor>
          </div>
        </div>
      </Col>
      <Col class="form--aside" :xs="24" :sm="24" :md="6" :lg="6">
        <div class="vbox">
          <div class="scrollable wrapper hover wf">
            <h4 class="font-thin form--label">Future Image</h4>
            <div class="future-image" @click="openMedia" ref="futureImageEl">
              <img :src="futureImage" v-if="futureImage">
              <Icon type="image" size="42" v-else></Icon>
            </div>
            <div class="line"></div>
            <h4 class="font-thin form--label">Publish</h4>
            <div class="checkbox i-checks">
              <label>
                <input type="checkbox" name="published" v-model="form.published">
                Publish
                <i></i>
              </label>
            </div>
            <FormItem label="Publish immediately">
              <DatePicker v-model="form.published_at" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 100%;"></DatePicker>
            </FormItem>
            <div class="checkbox i-checks">
              <label>
                <input type="checkbox" name="comment_status" v-model="form.comment_status">
                Allow Comments
                <i></i>
              </label>
            </div>
            <div class="checkbox i-checks">
              <label>
                <input type="checkbox" name="comment_status" v-model="form.pinned">
                Pinned this post
                <i></i>
              </label>
            </div> 
            <div class="line"></div>
            <h4 class="font-thin form--label">Categories</h4>
            <category :data="categories" :checked="form.categories" @selectcat="selectCategory" v-if="syncCat"></category>
          </div>
        </div>
      </Col>
    </Row>
  </Form>
  <media :show="mediaShow" @on-close="mediaShow = false" :filters="filters" title="Set Future Image" @on-insert="setImageFuture" ref="gallery"></media>
</div>
</template>

<script>
import media from '~/components/media/modal'
import category from '~/components/common/category'
import axios from 'axios'

export default {
  name: 'create',
  components: {
    media,
    category
  },
  data () {
    return {
      form: {
        title: '',
        slug: '',
        excerpt: '',
        content: '## title sample',
        published: true,
        comment_status: false,
        pinned: false,
        published_at: new Date(),
        categories: []
      },
      formValidate: {},
      categories: [],
      syncCat: false,
      domain: 'http://minion.dev/',
      titleMedia: 'Media Gallery',
      cursor: {},
      mediaShow: false,
      filters: {},
      futureImage: false
    }
  },
  watch: {
    'form.title': function () {
      this.form.slug = this.sanitizeTitle(this.form.title)
    }
  },
  methods: {
    openMedia () {
      this.mediaShow = !this.mediaShow
    },
    setImageFuture (item) {
      // console.log(item)
      this.futureImage = item[0].url
      this.mediaShow = false
    },
    saveFrom () {
      // 
    },
    resetForm () {
      this.form = {
        title: '',
        slug: '',
        excerpt: '',
        content: '## title sample',
        published: true,
        comment_status: false,
        pinned: false,
        published_at: new Date(),
        categories: []
      }
    },
    showContent (html) {
      // 
    },
    async getCategories () {
      let { data } = await axios.get('http://minion5.5.dev/api/v1/categories')
      this.categories = data.data
      this.syncCat = true
    },
    selectCategory (val) {
      this.form.categories = val
    },
    sanitizeTitle (title) {
      let slug = ''
      let titleLower = title.toLowerCase()
      slug = titleLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, 'e')
      slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, 'a')
      slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, 'o')
      slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, 'u')
      slug = slug.replace(/đ/gi, 'd')
      slug = slug.replace(/\s*$/g, '')
      slug = slug.replace(/\s+/g, '-')
      return slug
    }
  },
  mounted () {
    this.getCategories()
  }
}
</script>

<style lang="less">
.form--wrapper {
  position: relative;
  // display: flex;
  justify-content: space-between;
  .form--content {
    // flex: 2;
    // width: 100%;
    height: 100vh;
    .wrapper {
      padding: 15px;
    }
  }
  .form--aside {
    // flex: 1;
    // width: 300px;
    // max-width: 300px;
    background: #fff;
    height: 100vh;
    .wrapper {
      padding: 15px;
    }
  }
}
.wf {
  bottom: 100px !important;
}
.vbox {
  position: relative;
  height: 100%;
  > .scrollable {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.editor {
  display: flex;
  padding-top: 15px;
  height: 90%;
}

.btn-media {
  font-weight: 500;
  background-color: #fff
}
.font-thin {
  font-weight: 300;
}

.form--label {
  font-size: 18px;
}

.line {
  margin: 20px 0;
  font-size: 0;
  border-bottom: 1px dashed #eaeef1;
  margin-right: -15px;
  margin-left: -15px;
}
.ivu-input-large {
  font-size: 22px;
  padding: 6px 7px;
  height: 42px;
  font-weight: 300;
}

.future-image {
  border: 1px solid #ddd;
  height: 180px;
  line-height: 180px;
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 768px) {
  .form--wrapper .form--content {
    height: auto;
  }
  .ivu-breadcrumb {
    display: none;
  }
  .form--wrapper .form--aside {
    // background: #fff;
    // height: 100vh;
    // position: absolute;
    // top: 0;
    // z-index: 100;
    // bottom: 0;
  }
}

</style>

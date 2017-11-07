<template>
<Modal
    :title="title"
    v-model="media"
    @on-cancel="close"
    width="100%"
    class-name="vertical-center-modal media-modal">
    <div class="media--content">
      <!-- :format="['jpg','jpeg','png', 'zip', 'rar', 'mp3', 'mp4', 'tar.gz', 'gz', 'doc', 'docx', 'xls', 'xlsx']" -->
      <Upload
        ref="upload"
        :show-upload-list="true"
        :default-file-list="defaultMedias"
        :on-success="handleSuccess"
        :max-size="204800"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="uploadURL">
        <div style="width: 118px;height:118px;line-height: 118px;">
          <Icon type="camera" size="32"></Icon>
        </div>
      </Upload>
      <div class="upload-list" v-for="item in medias" @click="selected(item, $event)" ref="listItem">
        <template v-if="item.status === 'finished'">
          <img :src="item.preview" v-if="item.preview">
          <Icon :type="format(item.type)" class="icon-file" size="72"></Icon>
          <div class="upload-list-cover">
            <ButtonGroup>
              <Button type="success" icon="ios-eye-outline" @click.native="handleView(item.name)"></Button>
              <Button type="error" icon="ios-trash-outline" @click.nativ="handleRemove(item)"></Button>
            </ButtonGroup>
          </div>
          <div class="file-info">
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
    </div>
    <div slot="footer">
      <Button type="success" @click="insertMedia">Insert to page</Button>
    </div>
</Modal>
</template>

<script>
import axios from 'axios'
export default {
  name: 'modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    filters: {
      type: Object
    },
    multiSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      media: this.show,
      uploadURL: '//minion5.5.dev/api/v1/media/upload',
      type: [],
      medias: [],
      defaultMedias: [],
      imgName: '',
      visible: false,
      itemSelected: [],
      types: [
        {
          id: 0,
          name: 'All media item'
        },
        {
          id: 1,
          name: 'Image'
        },
        {
          id: 2,
          name: 'Audio'
        },
        {
          id: 3,
          name: 'Video'
        },
        {
          id: 4,
          name: 'Zip/RAR'
        },
        {
          id: 5,
          name: 'Othes'
        }
      ]
    }
  },
  watch: {
    show: function () {
      this.media = this.show
    }
  },
  async mounted () {
    await this.items()
    this.medias = this.$refs.upload.fileList
  },
  methods: {
    close () {
      this.$emit('on-close', true)
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      // console.log(file)
      file.preview = res.data.preview
      file.url = res.data.url
      file.name = res.data.name
      file.type = res.data.type
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'Format file salah',
        desc: 'File ' + file.name + ' Formatnya tidak benar, silahkan upload jpg atau png format gambar.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'File melebihi batas ukuran',
        desc: 'File ' + file.name + ' terlalu besar untuk diatasi 2M。'
      })
    },
    handleBeforeUpload () {
      // const check = this.uploadList.length < 5
      // if (!check) {
      //   this.$Notice.warning({
      //     title: 'Max 5 gambar yang bisa diunggah.'
      //   })
      // }
      // return check
    },
    selected (item, e) {
      if (this.multiSelect) {
        e.currentTarget.classList.toggle('selected')
      } else {
        // remove all selected item
        let allItem = this.$refs.listItem
        if (allItem.length > 0) {
          allItem.forEach(function (el) {
            el.classList.remove('selected')
          })
        }
        e.currentTarget.classList.toggle('selected')
        this.itemSelected = [item]
      }
    },
    insertMedia () {
      console.log(this.itemSelected)
      this.$emit('on-insert', this.itemSelected)
    },
    async items () {
      let { data } = await axios.get('//minion5.5.dev/api/v1/media/lists')
      this.defaultMedias = data.data
    },
    format (type) {
      let icon = 'document'
      switch (type) {
        case 'video':
          icon = 'ios-film'
          break
        case 'audio':
          icon = 'ios-musical-notes'
          break
        case 'zip':
          icon = 'document'
          break
        default:
          icon = 'document'
      }
      return icon
    }
  }
}
</script>

<style lang="less">
.media-modal {
  padding: 30px;
  width: 72%;
  max-width: 72%;
  margin: 0 auto;
  overflow: hidden;
  > .ivu-modal {
    top: 0;
    position: relative;
    height: 100%;
    > .ivu-modal-content {
      position: relative;
      height: 100%;
      border-radius: 0px !important;
      .ivu-modal-body {
        padding: 0 !important;
        position: absolute;
        margin: 0;
        top: 51px;
        left: 0;
        right: 0;
        bottom: 58px;
        overflow: auto;
        .toolbar {
          // padding: 0 15px;
          // position: absolute;
          // top: 0;
          // left: 0;
          // right: 0; 
        }
      }
      .ivu-modal-footer {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
      }
    }
  }
}

.media--content {
  // position: absolute;
  height: 100%;
  min-height: 200px;
  padding: 15px;
  .ivu-upload {
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    // border: 1px solid transparent;
    border-radius: 2px;
    overflow: hidden;
    background: #fff;
    position: relative;
    // box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 15px;
    margin-bottom: 15px;
  }

  .upload-list {
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    // line-height: 120px;
    border: 1px solid transparent;
    border-radius: 2px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    &.selected {
      border: 2px solid rgb(51, 153, 255);
    }
  }
  .upload-list {
    img {
      width: 100%;
      height: 100%;
    }
    i.icon-file {
      display: inline-block;
      width: 120px;
      height: 120px;
      text-align: center;
      line-height: 120px;
    }
  }
  .file-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px;
    background: rgba(0,0,0,.6);
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    // top: 0;
    height: 40px;
    padding: 4px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    // background: rgba(0,0,0,.6);
    z-index: 999;
    // display: block;
    .meta {
      display: flex;
      justify-content: space-between;
      div {
        flex: 1;
        padding: 9px;
        cursor: pointer;
      }
    }
  }
  .upload-list:hover .upload-list-cover {
    display: block;
  }
  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}

.ivu-tabs-bar {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .media-modal {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    .ivu-modal {
      margin: 0
    }
  }
}
</style>

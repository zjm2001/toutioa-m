<template>
<div class="channel-edit">
  <van-cell :border="false">
    <div slot="title" class="title-text">我的频道</div>
    <van-button size="mini" plain type="danger" round class="edit-btn" @click="isEdit=!isEdit">{{isEdit ? '完成':'编辑'}}</van-button>
  </van-cell>
<!--  我的频道-->
  <van-grid :gutter="10" class="my-grid">
    <van-grid-item v-for="(channel,index) in myChannels" :key="index" class="grid-item" @click="myChannelsClick(channel,index)">
      <van-icon slot="icon" name="clear" v-show="isEdit&&!fiexChannels.includes(channel.id)" ></van-icon>
      <span slot="text" class="text" :class="{active: index===active}">{{ channel.name }}</span>
    </van-grid-item>
  </van-grid>
<!--  频道推荐-->
  <van-cell :border="false"  >
    <div slot="title" class="title-text">频道推荐</div>
  </van-cell>
  <van-grid :gutter="10" class="recommend-grid">
    <van-grid-item v-for="(channel,index) in recomendChannels"
                   :key="index"
                   :text="channel.name"
                   @click="addchannel(channel)"
                   class="grid-item" icon="plus"/>
  </van-grid>
</div>
</template>

<script>
import { getAllChannel, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'channel-edit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }

  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道不允许删除
    }
  },
  created () {
    this.loadAllChannel()
  },
  methods: {
    // 获取列表全部
    async loadAllChannel () {
      try {
        const { data } = await getAllChannel()
        this.allChannels = data.data.channels
        // console.log(data)
      } catch (err) {
        this.$toast('获取数据失败!')
      }
    },
    // 添加到我的列表
    async addchannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录状态
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败,稍后重试!')
        }
      } else {
        // 未登录状态存储本地
        setItem('TOUTIAO_CHANEELS', this.myChannels)
      }
    },
    // 我的列表点击事件
    myChannelsClick (channel, index) {
      // 判断是编辑状态还是删除状态
      if (this.isEdit) {
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        this.myChannels.splice(index, 1)
        // 删除状态
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        // 编辑状态
        // 子组件向父组件发送数据
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算推荐频道
    recomendChannels () {
      const channels = []
      this.allChannels.forEach(channel => {
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
      // 简便方法可以使用 filter方法遍历 数组,把符合条件元素return
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit{
  padding: 85px 0;
  .title-text{
    font-size: 32px;
    color: #333333;
  }
  .edit-btn{
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border:1px solid #f85959 ;
  }
 /deep/ .grid-item{
    width: 160px;
    height: 86px;
    .van-grid-item__content{
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__icon-wrapper{
        position: unset;
      }
      .van-grid-item__text, .text{
        font-size: 28px;
        color: #222;
        .van-grid-item__text{
          margin-top:0 ;
        }
      }
    }
  }
  /deep/ .my-grid{
    .grid-item{
      .van-icon-clear{
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #b4b4b4;
        z-index: 2;
      }
      .active{
        color: red;
      }
    }
  }
/deep/.recommend-grid{
  .grid-item{
    .van-grid-item__content{
      flex-direction: row;
      .van-icon-plus{
        font-size: 28px;
        margin-right: 6px;
      }
      .van-grid-item__text{
        margin-top:0 ;
      }
    }
  }
}

}
</style>

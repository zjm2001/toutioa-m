<template>
<div class="home-container">
  <van-nav-bar  class="page-nav-bar" fixed>
   <van-button slot="title" type="info" size="small" icon="search" round class="search-btn" to="/search"> 搜索</van-button>
  </van-nav-bar>
<!--  tab频道列表-->
  <van-tabs v-model="active"  animated swipeable class="channel-tabs">
    <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
      <article-list :channel="channel"></article-list>
    </van-tab>
    <div slot="nav-right" class="null"></div>
    <div slot="nav-right" class="hamburger-btn" @click="isEditshow=true">
      <i class='toutiao toutiao-gengduo'></i>
    </div>
  </van-tabs>
<!--  弹出层-->
  <van-popup
    v-model="isEditshow"
    closeable
    position="bottom"
    close-icon-position="top-left"
    :style="{ height: '100%' }">
<!--    插入弹出层组件-->
    <channel-edit :my-channels="channels" :active="active" @update-active="onUpdata"></channel-edit>
  </van-popup>
</div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isEditshow: false // 控制弹出层出现
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    // 获取文章列表
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // // console.log(data)
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANEELS')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdata (index, isEditshow = true) {
      this.active = index
      this.isEditshow = isEditshow
    }
  },
  computed: {
    ...mapState(['user'])
  }

}
</script>

<style lang="less" scoped>
.home-container{
  padding-top: 174px;
   .search-btn{
     width: 555px;
     height: 64px;
     background-color: #5babfb;
     border: none;
     font-size: 28px;
     .van-icon{
       font-size: 35px;
     }
   }
  /deep/ .channel-tabs{
    .van-tabs__wrap{
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
  .van-tab{
     min-width: 200px;
    font-size: 30px;
    color: #777;
    border-right:1px solid #edeff3
    }
    .van-tab--active{
      color: #333;
    }
    .van-tabs__line{
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
    .null{
      flex-shrink: 0;
      width: 50px;
      height: 82px;
    }
    .hamburger-btn{
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity:0.802 ;
      i.toutiao{
        font-size: 33px;
      }
      &:before{
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>

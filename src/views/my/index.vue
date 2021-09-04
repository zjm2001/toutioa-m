<template>
<div>
  <!--  数量区域-->
  <div v-if="user" class="header user-info "  >
    <div class="base-info">
      <div class="left">
        <van-image
          :src="userInfo.photo"
          class="avatar"
          round
          fit="cover"/>
        <span class="name">{{userInfo.name}}</span>
      </div>
      <div class="right">
        <van-button size="mini" round >编辑资料</van-button>
      </div>
    </div>
    <div class="data-stats">
      <div class="data-item">
        <span class="count">{{userInfo.art_count}}</span>
        <span class="text">头条</span>
      </div>
      <div class="data-item">
        <span class="count">{{userInfo.follow_count}}</span>
        <span class="text">关注</span>
      </div>
      <div class="data-item">
        <span class="count">{{ userInfo.fans_count }}</span>
        <span class="text">粉丝</span>
      </div>
      <div class="data-item">
        <span class="count">{{userInfo.like_count}}</span>
        <span class="text">获赞</span>
      </div>
    </div>
  </div>
  <div v-else class="header not-login">
    <div class="login-btn" @click="$router.push('/login')">
      <img src="~@/assets/mobile.png" alt="">
      <span class="text">登录 / 注册</span>
    </div>
  </div>
  <!--  宫格区域-->
  <van-grid :column-num="2" class="grid-nav" clickable>
    <van-grid-item  class="grid-item">
      <i slot="icon" class="toutiao toutiao-shoucang"></i>
      <span  slot="text" class="text">收藏</span>
    </van-grid-item>
    <van-grid-item   class="grid-item">
      <i slot="icon" class="toutiao toutiao-lishi"></i>
      <span  slot="text" class="text">历史</span>
    </van-grid-item>
  </van-grid>
<!--  通知区域-->
  <van-cell title="消息通知" is-link/>
  <van-cell title="小爱同学" is-link class="mb-9"/>
  <van-cell v-if="user" title="退出登录" class="logout-cell" @click="onLogout" clickable/>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'my',
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 如果用户登录了就请求数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    // 点击退出按钮执行
    onLogout () {
      this.$dialog.confirm({
        title: '确认退出登录吗?'
      })
        .then(() => {
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    // 获取用户自己数据
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        // console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  height: 361px;
  background: url("~@/assets/banner.png");
  background-size: cover;
}
.not-login{
  display: flex;
  justify-content: center;
  align-items: center;
  .login-btn{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img{
      width: 132px;
      height: 132px;
      margin-bottom: 15px;

    }
    .text{
      font-size: 28px;
      color: #fff;
    }
  }
}
.user-info{
  .base-info{
    box-sizing: border-box;
    height: 231px;
    padding: 75px 32px 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      align-items: center;
      .avatar{
        width: 132px;
        height: 132px;
        margin-right: 23px;
        border: 4px solid #fff;
      }
      .name{
        font-size: 35px;
        color: #fff;
      }
    }
  }
  .data-stats{
    display: flex;
    .data-item{
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      .count{
        font-size: 36px;
      }
      .text{
        font-size: 23px;
      }
    }
  }
}
.grid-nav{
  margin-bottom: 10px;
  .grid-item{
    height: 141px;
    i.toutiao{
    font-size: 45px;
    }
    .toutiao-shoucang{
      color: #eb5253;
    }
    .toutiao-lishi{
      color: #ff9d1d;
    }
    span.text{
      font-size: 28px;
    }
  }
}
.logout-cell{
  text-align: center;
  color: #eb5253;
  margin-top: 10px;
}
</style>

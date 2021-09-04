<template>
  <div class="login">
    <!--    头部导航区域-->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="cross"  @click="$router.back()"/>
    </van-nav-bar>
    <!--    登录表单-->
    <van-form ref="loginFormRef" @submit="onSubmit">
      <van-field
        name="mobile"
        type="number"
        maxlength="11"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFromRules.mobile">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        type="number"
        maxlength="6"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFromRules.code">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down :time="1000 * 60" format="ss s"  v-if="isCountDown" @finish="isCountDown=false"/>
          <van-button v-else
             @click="onSendSms"
             class="send-sms-btn"
             native-type="button"
             round size="small"
             type="default">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block type="info"
          native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 按需加载登录请求的login
import { login, sendSms } from '@/api/user'

export default {
  name: 'loginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      }, // 双向绑定表单输入数据
      userFromRules: {
        mobile: [{ required: true, message: '请填写手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误' }],
        code: [{ required: true, message: '请填写用户名' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      }, // 表单验证规则
      isCountDown: false // 是否展示倒计时
    }
  },
  created () {
  },
  methods: {
    async  onSubmit () {
      // 和获取表达数据
      const user = this.user
      // 表单验证
      // 调用组件Toast实现弹出 duration默认2000ms 0则是持续出现
      this.$toast.loading({ message: '登录中...', forbidClick: true, duration: 0 })
      // 提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功跳转
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log('登录失败,请稍后重试',err)
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
    },
    // 点击发送验证码按钮   把await和成功后的操作放到try里，失败的放在catch
    async onSendSms () {
      try {
        await this.$refs.loginFormRef.validate('mobile')
        // console.log('验证cg')
      } catch (err) {
        return console.log('验证失败', err)
      }
      this.isCountDown = true
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败 关闭倒计时组件
        this.isCountDown = false
        if (err.response.status === 429) {
          this.$toast('发送频繁,稍后重试')
        }
        this.$toast('发送失败,稍后重试')
      }
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.login {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
    background-color: #ededed;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>

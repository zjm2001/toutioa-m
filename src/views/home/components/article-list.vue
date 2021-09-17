<template>
<div class="article-list">
  <van-pull-refresh
    v-model="isLoading"
    :success-text="text"
    success-duration="1500"
    @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"  >
      <article-item v-for="(article,index) in list" :key="index"  :article="article"></article-item>
<!--      <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />-->
    </van-list>
  </van-pull-refresh>

</div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'article-list',
  data () {
    return {
      list: [], // 存储列表数据信息
      loading: false, // 控住加载状态
      finished: false, // 控住数据加载结束状态
      timestamp: null, // 请求获取下一页数据时间戳
      error: false, // 控制失败提示状态
      isLoading: false, // 控制下拉刷新loading状态
      text: '刷新成功'
    }
  },
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 初始化或者是滚动到底部会触发调用
    async onLoad () {
      // 异步更新数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('萨达萨达萨达的')
        // }
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.loading = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        // console.log('请求失败', err)
      }
    },
    async onRefresh () {
      // 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(),
          with_top: 1
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('萨达萨达萨达的')
        // }
        const { results } = data.data
        this.list.unshift(...results)
        this.text = `刷新成功,更新了${results.length}条数据`
        this.isLoading = false
      } catch (err) {
        this.text = '刷新失败'
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list{
  height: 83vh;
  overflow-y: auto;
}
</style>

<template>
<div>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad">
    <van-cell v-for="(item, index) in list" :key="index" :title="item.title"
    :error.sync="error" error-text="加载失败,点击重试"/>
  </van-list>
</div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'search-result',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        const { results } = data.data
        this.list.push(...results)
        // 2.将数据添加到数组列表中
        // 3.将本次加载loading关闭
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('数据获取失败!')
      }
    }
  }
}
</script>

<style scoped>

</style>

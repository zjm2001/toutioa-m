<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
    // 请求获取数据
      var strID
      if (typeof this.source === 'object') {
        strID = this.source.toString()
      } else {
        strID = this.source
      }
      try {
        const { data } = await getComments({
          type: 'a', // 评论类型
          source: strID, // 源id
          offset: this.offset,
          limit: this.limit
        })
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 文章评论总数量传递到外部
        this.$emit('onload-success', data.data)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<template>
        <van-icon
          :color="value ? '#ffa500': '#a0a0a0 '"
          :name="value ? 'star': 'star-o'"
          :loading="loading"
          @click="onClick"

        />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      // type: { Number, String, Object },
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onClick () {
      this.loading = true
      try {
        if (this.value) {
          // 以收藏,删除收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏,添加收藏
          await addCollect(this.articleId)
        }
        // 更新试图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('操作失败,请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>

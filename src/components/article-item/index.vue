<template>
<div class="article-item">
  我文章列表项
</div>
</template>

<script>
export default {
  name: 'article-item',
  data () {
    return {}
  },
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>

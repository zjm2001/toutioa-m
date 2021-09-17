<template>
<div class="search-suggestion">
  <van-cell
    v-for="(text,index) in suggestions"
    :key="index"
    icon="search"
     @click="$emit('search',text )">
    <div slot="title" v-html="highlight(text)"></div>
  </van-cell>
</div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'search-suggestion',
  data () {
    return {
      suggestions: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 监视函数
  watch: {
    searchText: {
      // 当searchText发生变化之后会调用函数handler 名称是固定的
      // 使用lodash中的debounce进行1000执行一次进行防抖
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 500),
      immediate: true //  该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    // 发起搜索的联想请求
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    highlight (text) {
      const Srt = `<span class="active " >${this.searchText}</span>`
      // 动态生成正则表达式可以手动new RegExp
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, Srt)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion{
 /deep/ span.active{
    color: #5babfb !important;
  }
}
</style>

<template>
<div class="search-container">
<!--  搜索栏-->
  <form action="/">
    <van-search
      v-model="searchText"
      show-action
      background="#2892ff"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
  </form>
<!--  历史记录-->
  <search-history/>
<!--  联想建议-->
  <search-suggestion/>
<!--  搜索结果-->
  <search-result/>
</div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
export default {
  name: 'search-Index',
  data () {
    return {
      searchText: ''
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult

  },
  methods: {
    onSearch (val) {
      console.log(val)
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container{
  .van-search__action{
    color: #fff;
  }
}
</style>

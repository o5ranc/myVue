const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave: false
  devServer: {
    client: {
      overlay: {
        // el-table(특히 확장 행 안의 중첩 테이블)이 크기를 다시 계산할 때 브라우저가 내는
        // "ResizeObserver loop ..." 경고는 동작에 영향이 없어서 개발 서버 오버레이에서만 뺍니다.
        runtimeErrors: (error) => !/ResizeObserver loop/.test(error?.message ?? ''),
      },
    },
  },
})

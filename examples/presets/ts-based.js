module.exports = {
  initialDir: false,
  plugins: [
    {
      name: '@attachments/serendipity-plugin-eslint',
      removeAfterConstruction: true,
      overrideInquiries: {
        environment: '其他项目',
        useTypeScript: true
      }
    },
    {
      name: '@attachments/serendipity-plugin-typescript',
      removeAfterConstruction: true
    }
  ]
}

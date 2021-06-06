const path = require('path')

module.exports = {
  initialDir: false,
  plugins: [
    {
      name: '@attachments/serendipity-plugin-init',
      path: path.resolve(__dirname, '../../../packages/serendipity-plugin-init'),
      removeAfterConstruction: true
    }
  ]
}

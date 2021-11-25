const path = require("path");

module.exports = function(apis) {
  apis.cache(false);

  return {
    plugins: [
      [
        path.resolve(__dirname, "../../../babel-plugin-i18n/lib/index.js"),
        {
          intlKeyPrefix: "Yzl_Test",
          include: "src/i18n"
        }
      ]
    ]
  };
};

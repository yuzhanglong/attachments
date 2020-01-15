const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $messageBox: {
      get() {
        return {
          showSuccessMessage(object, message) {
            object.$message({
              message: message,
              type: 'success'
            });
          },
          showWarningMessage(object, message) {
            object.$message({
              message: message,
              type: 'warning'
            });
          },
          showInfoMessage(object, message) {
            object.$message({
              message: message,
              type: 'info'
            });
          },
          showErrorMessage(object, message) {
            object.$message({
              message: message,
              type: 'error'
            });
          },
        }
      }
    }
  })
};

export default {
  install
}
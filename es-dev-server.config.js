/*
* Configuration for 'es-dev-server'.
*/
module.exports = {
  port: 3000,
  watch: true,
  nodeResolve: true,
  appIndex: 'src/index.html',
  moduleDirs: ['node_modules', 'web_modules'],

  compatibility: 'min',   // aim at evergreen (you may change this to your preferences)

  middlewares: [
    function rewriteIndex(context, next) {
      if (context.url === '/' || context.url === '/index.html') {
        context.url = '/src/index.html';
      }
      return next();
    },
  ],

  responseTransformers: [
    async function transformVue({ url, status, contentType, body }) {
      if (url === '/src/App.vue') {
        //const html = await markdownToHTML(body);
        return {
          body: "html",
          contentType: 'application/json',
        };
      }
    },
  ],
};

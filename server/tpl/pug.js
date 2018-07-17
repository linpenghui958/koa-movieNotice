module.exports = `
doctype html
html(lang='zh-cn')
  head
    meta(charset='utf-8')
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    title Koa Server Html
    link(rel='stylesheet', type='text/css', href='https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css')
    script(src='https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js', type='text/javascript', charset='utf-8')
    script(src='https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.bundle.min.js', type='text/javascript', charset='utf-8')

  body
    .container
      .row
        .col-md-8
          h1 Hi #{you}
          p This is #{me}
        .col-md-4
          p 动态模板引擎pug
`
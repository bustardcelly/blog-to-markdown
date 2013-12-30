var fs = require('fs'),
    system = require('system'),
    page = require('webpage').create(),
    index = 'http://localhost:8080/blog-static/index.html';

page.onError = function (msg, trace) {
  console.log(msg);
  trace.forEach(function(item) {
    console.log('  ', item.file, ':', item.line);
  })
};

page.onConsoleMessage = function(msg) {
  system.stderr.writeLine('console: ' + msg);
};

page.open(index, function() {
  page.includeJs('http://code.jquery.com/jquery-1.10.1.min.js', function() {
    var post,
        postTitle,
        postText,
        replaceAll = function(find, replace, str) {
          return str.replace(find, replace);
        },
        postProcessBlockCode = function(textContent) {
          textContent = replaceAll(/\[as\]/gi, '<pre>', textContent);
          textContent = replaceAll(/\[\/as\]/gi, '</pre>', textContent);
          return textContent;
        },
        postProcessLocation = function(textContent) {
          return replaceAll(/http:\/\/darko.liquidweb.com\/~custardb/gi, 'http://custardbelly.com', textContent);
        },
        posts = page.evaluate(function() {
          var items = $('.post'),
              list = {},
              trimTitle = function(str) {
                str = str.split('http://custardbelly.com/blog/')[1];
                return str.replace(/\/+$/,'');
              };
          items.each(function(index, element) {
            var $titleElement = $('.full-title a', element),
                title = trimTitle($titleElement.attr('href')) + '.html',
                removeAuthor = function(elem) {
                  $('p.by-line', elem).remove();
                },
                removeComments = function(elem) {
                  $('p.comments-link', elem).remove();
                },
                convertSyntaxHiCode = function(elem) {
                  var syntaxHis = $('div.syntaxhighlighter', elem);
                  syntaxHis.each(function(index, elem) {
                    var $codeContainer = $('td.code div.container', elem),
                        textContent = $codeContainer.text();
                    $codeContainer.remove();
                    $(this).replaceWith('<pre>' + $codeContainer.html() + '</pre>');
                  });
                };
            removeAuthor(this);
            removeComments(this);
            convertSyntaxHiCode(this);
            list[title] = $(this).html();
          });
          return list;
        });

    for(postTitle in posts) {
      post = posts[postTitle];
      postText = postProcessBlockCode(post.toString());
      postText = postProcessLocation(postText);
      fs.write('blog-posts/' + postTitle, postText, 'w');
    }
    phantom.exit();
  });
});
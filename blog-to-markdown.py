import re
import os
import sys
import codecs
# If using html2text localling instead of installed via pip/requirements:
# sys.path.insert(0, os.path.join(os.getcwd(), 'html2text'))

import html2text

ROOT_DIR = 'blog-posts'
HTML_EXT = re.compile('(.*?).html', re.IGNORECASE)

def get_file_contents(filepath):
  with codecs.open(filepath, 'r', 'utf-8') as f:
    return f.read()

def convert(root_dir):
  for root, dirs, files in os.walk(root_dir):
    for f in files:
      if HTML_EXT.match(f):
        converter = html2text.HTML2Text()
        converter.body_width = 0
        path = os.path.abspath(os.path.join(root, f))
        markup = get_file_contents(path)
        out = path.split('.html')[0] + '.md'
        with open(out, 'w') as f:
          markdown = converter.handle(markup).encode('utf-8')
          f.write(markdown)

if __name__ == '__main__':
  convert(ROOT_DIR)
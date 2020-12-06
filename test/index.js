var fs = require('fs')
var path = require('path')
var test = require('tape')

var dwebxIgnore = require('..')

test('default ignore with dir', function (t) {
  var ignore = dwebxIgnore(__dirname)
  checkDefaults(t, ignore)

  // DWebX Ignore stuff
  t.ok(ignore(path.join(__dirname, 'index.js')), 'full path index.js is ignored by .dwebxignore')

  t.end()
})

// test('ignore from within hidden folder', function (t) {
//   var dir = path.join(__dirname, '.hidden')
//   var ignore = dwebxIgnore(dir)
//   checkDefaults(t, ignore)
//   t.notOk(ignore(path.join(dir, 'index.js')), 'file allowed inside hidden')

//   t.end()
// })

test('custom ignore extends default (string)', function (t) {
  var ignore = dwebxIgnore(__dirname, { ignore: '**/*.js' })
  t.ok(ignore('.dwebx'), '.dwebx folder ignored')
  t.ok(ignore('foo/bar.js'), 'custom ignore works')
  t.notOk(ignore('foo/bar.txt'), 'txt file gets to come along =)')
  t.end()
})

test('custom ignore extends default (array)', function (t) {
  var ignore = dwebxIgnore(__dirname, { ignore: ['super_secret_stuff/*', '**/*.txt'] })
  t.ok(ignore('.dwebx'), '.dwebx still feeling left out =(')
  t.ok(ignore('password.txt'), 'file ignored')
  t.ok(ignore('super_secret_stuff/file.js'), 'secret stuff stays secret')
  t.notOk(ignore('foo/bar.js'), 'js file joins the party =)')
  t.end()
})

test('ignore hidden option turned off', function (t) {
  var ignore = dwebxIgnore(__dirname, { ignoreHidden: false })

  t.ok(ignore('.dwebx'), '.dwebx still feeling left out =(')
  t.notOk(ignore('.other-hidden'), 'hidden file NOT ignored')
  t.notOk(ignore('dir/.git'), 'hidden folders with dir NOT ignored')
  t.end()
})

test('useDWebxIgnore false', function (t) {
  var ignore = dwebxIgnore(__dirname, { useDWebxIgnore: false })
  t.ok(ignore('.dwebx'), '.dwebx ignored')
  t.notOk(ignore(path.join(__dirname, 'index.js')), 'file in dwebxignore not ignored')
  t.end()
})

test('change dwebxignorePath', function (t) {
  var ignore = dwebxIgnore(path.join(__dirname, '..'), { dwebxignorePath: path.join(__dirname, '.dwebxignore') })
  t.ok(ignore('.dwebx'), '.dwebx ignored')
  t.ok(ignore(path.join(__dirname, '..', 'index.js')), 'file in dwebxignore ignored')
  t.end()
})

test('dwebxignore as buf', function (t) {
  var ignore = dwebxIgnore(__dirname, { dwebxignore: fs.readFileSync(path.join(__dirname, '.dwebxignore')) })
  t.ok(ignore('.dwebx'), '.dwebx ignored')
  t.ok(ignore(path.join(__dirname, 'index.js')), 'file in dwebxignore ignored')
  t.end()
})

test('dwebxignore as str', function (t) {
  var ignore = dwebxIgnore(__dirname, { dwebxignore: fs.readFileSync(path.join(__dirname, '.dwebxignore'), 'utf-8') })
  t.ok(ignore('.dwebx'), '.dwebx ignored')
  t.ok(ignore(path.join(__dirname, 'index.js')), 'file in dwebxignore ignored')
  t.end()
})

test('well-known not ignored', function (t) {
  var ignore = dwebxIgnore(__dirname)
  t.notOk(ignore(path.join(__dirname, '.well-known/dwebx')), 'well known dwebx not ignored')
  t.end()
})

test('node_modules ignored', function (t) {
  var ignore = dwebxIgnore(path.join(__dirname, '..'), { dwebxignorePath: path.join(__dirname, '.dwebxignore') })
  t.ok(ignore(path.join(__dirname, 'node_modules')), 'node_modules ignored')
  t.end()
})

test('node_modules subdir ignored', function (t) {
  var ignore = dwebxIgnore(path.join(__dirname, '..'), { dwebxignorePath: path.join(__dirname, '.dwebxignore') })
  t.ok(ignore(path.join(__dirname, 'node_modules', 'dwebx')), 'node_modules subdir ignored')
  t.end()
})

test('node_modules file ignored', function (t) {
  var ignore = dwebxIgnore(path.join(__dirname, '..'), { dwebxignorePath: path.join(__dirname, '.dwebxignore') })
  t.ok(ignore(path.join(__dirname, 'node_modules', 'dwebx', 'hello.txt')), 'node_modules subdir ignored')
  t.end()
})

test('throws without directory option', function (t) {
  t.throws(function () {
    dwebxIgnore({ opts: true })
  })
  t.end()
})

function checkDefaults (t, ignore) {
  // Default Ignore
  t.ok(
    ['.dwebx', '/.dwebx', '.dwebx/', 'sub/.dwebx'].filter(ignore).length === 4,
    'always ignore .dwebx folder regardless of /')
  t.ok(
    ['.dwebx/foo.bar', '/.dwebx/foo.bar', '.dwebx/dir/foo'].filter(ignore).length === 3,
    'files in .dwebx folder ignored')
  t.ok(ignore('.DS_Store'), 'no thanks DS_Store')

  // Hidden Folder/Files Ignored
  t.ok(
    [
      '.git', '/.git', '.git/',
      '.git/sub', '.git/file.txt', 'dir/.git', 'dir/.git/test.txt'
    ].filter(ignore).length === 7, 'files in .dwebx folder ignored')

  // DWebX Ignore stuff
  t.ok(ignore('.dwebxignore'), 'let .dwebxignore through')

  // Things to Allow
  t.notOk(ignore('folder/asdf.data/file.txt'), 'weird data folder is ok')
  t.notOk(
    ['file.dwebx', 'file.dwebx.jpg', 'the.dwebx-thing'].filter(ignore).length !== 0,
    'does not ignore files/folders with .dwebx in it')
}

const execa = require('execa')
const del = require('del')
const Listr = require('listr')
const split = require('split')
require('any-observable/register/rxjs-all')
// eslint-disable-line import/no-unassigned-import
const Observable = require('any-observable')
const streamToObservable = require('stream-to-observable')
const readPkgUp = require('read-pkg-up')
const hasYarn = require('has-yarn')
const listrInput = require('listr-input')
const chalk = require('chalk')

const exec = (cmd, args) => {
  const cp = execa(cmd, args)

  return Observable.merge(
    streamToObservable(cp.stdout.pipe(split()), { await: cp }),
    streamToObservable(cp.stderr.pipe(split()), { await: cp })
  ).filter(Boolean)
}

module.exports = (input, opts) => {
  input = input || 'patch'

  opts = Object.assign({ cleanup: true, publish: true }, opts)

  if (!hasYarn() && opts.yarn) {
    throw new Error('Could not use Yarn without yarn.lock file')
  }

  // TODO: remove sometime far in the future
  if (opts.skipCleanup) {
    opts.cleanup = false
  }

  const runTests = !opts.yolo
  const runCleanup = opts.cleanup && !opts.yolo
  const runPublish = opts.publish
  const pkg = readPkg()

  const tasks = new Listr([{ title: 'Git', task: () => gitTasks(opts) }], {
    showSubtasks: false
  })

  if (runCleanup) {
    tasks.add([
      { title: 'Cleanup', task: () => del('node_modules') },
      {
        title: 'Installing dependencies using Yarn',
        enabled: () => opts.yarn === true,
        task: () =>
          exec('yarn', [
            'install',
            '--frozen-lockfile',
            '--production=false'
          ]).catch(err => {
            if (
              err.stderr.startsWith('error Your lockfile needs to be updated')
            ) {
              throw new Error(
                'yarn.lock file is outdated. Run yarn, commit the updated lockfile and try again.'
              )
            }
            throw err
          })
      },
      {
        title: 'Installing dependencies using npm',
        enabled: () => opts.yarn === false,
        task: () =>
          exec('npm', ['install', '--no-package-lock', '--no-production'])
      }
    ])
  }

  if (runTests) {
    tasks.add({ title: 'Running tests', task: () => exec('npm', ['test']) })
  }

  tasks.add([
    {
      title: 'Bumping version using Yarn',
      enabled: () => opts.yarn === true,
      task: () => exec('yarn', ['version', '--new-version', input])
    },
    {
      title: 'Bumping version using npm',
      enabled: () => opts.yarn === false,
      task: () => exec('npm', ['version', input])
    }
  ])

  if (runPublish) {
    tasks.add([
      {
        title: 'Publishing package using Yarn',
        enabled: () => opts.yarn === true,
        skip: () => {
          if (pkg.private) {
            return 'Private package: not publishing to Yarn.'
          }
        },
        task: () => {
          const args = ['publish', '--new-version', input]

          if (opts.tag) {
            args.push('--tag', opts.tag)
          }

          return exec('yarn', args).catch(err => {
            throw new Error(err)
          })
        }
      },
      {
        title: 'Publishing package using npm',
        enabled: () => opts.yarn === false,
        skip: () => {
          if (pkg.private) {
            return 'Private package: not publishing to npm.'
          }
        },
        task: (ctx, task) => publish(task, opts.tag)
      }
    ])
  }

  tasks.add({
    title: 'Pushing tags',
    task: () => exec('git', ['push', '--follow-tags'])
  })

  return tasks
    .run()
    .then(() => readPkgUp())
    .then(result => result.pkg)
}

function gitTasks (opts) {
  const tasks = [
    {
      title: 'Check current branch',
      task: () =>
        execa
          .stdout('git', ['symbolic-ref', '--short', 'HEAD'])
          .then(branch => {
            if (branch !== 'master') {
              throw new Error(
                'Not on `master` branch. Use --any-branch to publish anyway.'
              )
            }
          })
    },
    {
      title: 'Check local working tree',
      task: () =>
        execa.stdout('git', ['status', '--porcelain']).then(status => {
          if (status !== '') {
            throw new Error(
              'Unclean working tree. Commit or stash changes first.'
            )
          }
        })
    },
    {
      title: 'Check remote history',
      task: () =>
        execa
          .stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
          .then(result => {
            if (result !== '0') {
              throw new Error('Remote history differs. Please pull changes.')
            }
          })
    }
  ]

  if (opts.anyBranch) {
    tasks.shift()
  }

  return new Listr(tasks)
}

function readPkg () {
  const pkg = readPkgUp.sync().pkg

  if (!pkg) {
    throw new Error(
      "No package.json found. Make sure you're in the correct project."
    )
  }

  return pkg
}

function npmPublish (opts) {
  const args = ['publish']

  if (opts.tag) {
    args.push('--tag', opts.tag)
  }

  if (opts.otp) {
    args.push('--otp', opts.otp)
  }

  return execa('npm', args)
}

function handleError (task, err, tag, message) {
  if (err.stderr.indexOf('one-time pass') !== -1) {
    const title = task.title
    task.title = `${title} ${chalk.yellow('(waiting for input\u2026)')}`

    return listrInput(message || 'Enter OTP:', {
      done: otp => {
        task.title = title

        return npmPublish({ tag, otp })
      }
    }).catch(err =>
      handleError(task, err, tag, 'OTP was incorrect, try again:')
    )
  }

  return Observable.throw(err)
}

function publish (task, tag) {
  return Observable.fromPromise(npmPublish({ tag })).catch(err =>
    handleError(task, err, tag)
  )
}

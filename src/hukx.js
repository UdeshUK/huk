const { Subject } = require('rxjs')
const { first } = require('rxjs/operators')

class hukx {

  constructor(router) {
    this._router = router
  }

  get(path, ...handlers) {
    this._router.get(path, handlers)
  }

  post(path, ...handlers) {
    this._router.post(path, handlers)
  }

  put(path, ...handlers) {
    this._router.put(path, handlers)
  }

  delete(path, ...handlers) {
    this._router.delete(path, handlers)
  }

  pipe(...operators) {
    const subject = new Subject().pipe(...operators)
    return function (req, res) {
      subject.pipe(first()).subscribe(hukx.onNext(req, res), hukx.onError(res))
      subject.next(req)
    }
  }

  error(status, body) {
    return {
      status: status,
      body: body
    }
  }

  static onNext(req, res) {
    return (water) => {
      if (water != req) {
        res.status(200).send(water)
      } else {
        res.status(200)
      }
    }
  }

  static onError(res) {
    return (err) => {
      if (err.status) {
        res.status(err.status).send(err.body)
      } else {
        res.status(500)
      }
    }
  }
}

function createHukx(router) {
  return new hukx(router)
}

exports = module.exports = createHukx
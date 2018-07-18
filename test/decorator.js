class Boy {
  @speak('chinese')
  run () {
    console.log('i can run')
    console.log('i can speak ' + this.language)
  }
}

function speak (language) {
  return function (target, key, descriptor) {
    console.log(target)
    console.log(key)
    console.log(descriptor)
    target.language = language
    return descriptor
  }
}


const luke = new Boy()

luke.run()
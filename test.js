var obj = {
  name: 'a',
  myfoo: function(a,b){
    console.log(this.name , `${a} ${b}`)
  }
}


var obj2 = {
  name: 'apply 調用'
}

obj.myfoo()
obj.myfoo.apply(obj2, [123,234])

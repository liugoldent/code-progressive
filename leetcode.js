var o = {
  a:10,
  b:{
      a: 3,
      fn:function(){
          console.log(this.a); //undefined
      }
  }
}
o.b.fn();

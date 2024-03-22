const test = function(){
  let nameIndex = 0
  for(let i = 1 ; i <= 100; i++){
    const nameList = ['Alice', 'Bob', 'Cindy', 'David']
    const name = nameList[nameIndex]
    
    if(String(i).includes('7')){
      console.log(`${name}: clap`)
    }else{
      console.log(`${name}: ${i}`)
    }
    nameIndex++
    if(nameIndex === nameList.length){
      nameIndex = 0
    }
  }
}
test()
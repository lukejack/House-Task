function get(URL, stateRef,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL, true);
    // register the event handler
    xhr.addEventListener('load',function(){
      if(xhr.status === 200){
        callback(JSON.parse(xhr.response), stateRef);
      }
    },false);
    xhr.send();
}

module.exports =  {get: get};
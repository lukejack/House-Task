
//HTTP GET request
function get(URL, stateRef,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL, true);
    xhr.addEventListener('load',function(){
      if(xhr.status === 200){
        callback(JSON.parse(xhr.response), stateRef);
      }
    },false);
    xhr.send();
}

//Delete an item from a collection in state via an id
function deleteFromCollection(stateRef, collectionName, id){
        stateRef.setState((prevState, props)=>{
            let i = prevState[collectionName].length;
            let newTasks = prevState[collectionName];
            while (i--){
                if (prevState[collectionName][i].id === id){
                    newTasks.splice(i, 1);
                }
            }
            return {
                [collectionName]: newTasks
            };
        });
  }

//Search for an object in a collection by its attribute value
function find(collection, attribute, value){
  for (let i = 0; i < collection.length; i++){
    if (collection[i][attribute] === value)
      return i === 0 ? true : i;
    }
  return false;
}

module.exports =  {get: get, delete: deleteFromCollection, find: find};
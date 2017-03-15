
//HTTP GET request
function get(URL, stateRef, callback, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.response), stateRef);
    }
  }, false);
  xhr.send(data);
}



//HTTP POST
function post(URL, stateRef, callback, data) {
  //console.log('POST: ', URL, data, callback);
  var http = new XMLHttpRequest();
  http.open("POST", URL, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function () {//Call a function when the state changes.
    if (http.readyState == 4 && http.status == 200) {
      callback(JSON.parse(http.responseText), stateRef);
    }
  }
  http.send(data);
}


//Delete an item from a collection in state via an id
function deleteFromCollection(stateRef, collectionName, id) {
  stateRef.setState((prevState, props) => {
    let i = prevState[collectionName].length;
    let newTasks = prevState[collectionName];
    while (i--) {
      if (prevState[collectionName][i].id === id) {
        newTasks.splice(i, 1);
      }
    }
    return {
      [collectionName]: newTasks
    };
  });
}

//Search for an object in a collection by its attribute value
function find(collection, attribute, value) {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i][attribute] === value)
      return i === 0 ? true : i;
  }
  return false;
}

module.exports = { get: get, delete: deleteFromCollection, find: find, post: post };
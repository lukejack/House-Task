
//HTTP GET request
function get(URL, stateRef, callback, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  let timeOut = setTimeout(() => { alert('The server did not respond within 5 seconds. It might be down.'); }, 5000);
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      clearTimeout(timeOut);
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
  let timeOut = setTimeout(() => { alert('The server did not respond within 20 seconds. It might be down.'); }, 20000);
  http.onreadystatechange = function () {//Call a function when the state changes.
    if (http.readyState == 4 && http.status == 200) {
      clearTimeout(timeOut);
      callback(JSON.parse(http.responseText), stateRef);
    }
  }
  if (data) {
    http.send(data);
  } else {
    http.send();
  }
}


//Delete an item from a collection in state via an id
function deleteFromCollection(stateRef, collectionName, id) {
  stateRef.setState((prevState, props) => {
    let i = prevState[collectionName].length;
    let newTasks = prevState[collectionName];
    while (i--) {
      if ((prevState[collectionName][i].id === id) || (prevState[collectionName][i]._id === id)) {
        newTasks.splice(i, 1);
      }
    }
    console.log('Setting state to new tasks: ', newTasks);
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

function time(time) {
  let timeAgo;
  let minutesAgo = ((new Date().getTime()) - time) / 60000;
  if (minutesAgo < 60)
    timeAgo = Math.floor(minutesAgo) + ' minute' +  (Math.floor((minutesAgo)) === 1 ? '' : 's') + ' ago';
  if ((minutesAgo > 60) && (minutesAgo < (60 * 24)))
    timeAgo = Math.floor((minutesAgo / 60)) + ' hour' + ((Math.floor((minutesAgo / 60)) === 1 ) ? '' : 's') + ' ago';
  if (minutesAgo > (60 * 24))
    timeAgo = Math.floor((minutesAgo / (60 * 24))) + ' day' + ((Math.floor((minutesAgo / (60 * 24))) === 1) ? '' : 's' ) + ' ago';
  return timeAgo;
}

module.exports = { get: get, delete: deleteFromCollection, find: find, post: post , time: time};
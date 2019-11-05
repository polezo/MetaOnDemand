
// https://poly.googleapis.com/v1/assets?keywords=spaceship&format=OBJ&key=AIzaSyBC9puPjTcS63cU_HLfcSqOqs3Lrx7QXvk

//https://cors-anywhere.herokuapp.com/

const API_KEY = 'AIzaSyBC9puPjTcS63cU_HLfcSqOqs3Lrx7QXvk';

function init () {
    document.querySelector("#polyQuery").addEventListener("submit",searchPoly)
    document.querySelector("#forward-button").addEventListener("click",nextObj)
    let backward = document.querySelector("#back-button")
    backward.addEventListener("click",prevObj)
    backward.disabled = true;
    document.querySelector("#bigger-button").addEventListener("click",biggify)
    document.querySelector("#smaller-button").addEventListener("click",smallify)
}

document.addEventListener("DOMContentLoaded",init);

let keywords = "Search Me"

function searchPoly( e ) {
    e.preventDefault()
    keywords = e.target[0].value
    e.target.reset()
    fetch(`https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=OBJ&key=${API_KEY}`,
    {header: {'Access-Control-Allow-Origin':'*',}})
        .then(response => response.json())
        .then(saveObjResourcesLocally)
}

let objHolder = [];
let objInt = 0;
let scale = 1;
let pageToken = false;

function saveObjResourcesLocally(searchObjs) {
    objHolder = [];
    searchObjs.assets.forEach(pusher)
    if (searchObjs.nextPageToken) {
    pageToken = searchObjs.nextPageToken
    } else {
        pageToken = false;
    }
    renderCurrentObj(objHolder);
}

function pusher(searchObj) {
    let relevantIndex = indexFinder(searchObj);
    if (searchObj.formats[relevantIndex].resources) {
    objHolder.push({
        displayName: `${searchObj.displayName}`,
        authorName: `${searchObj.authorName}`,
        rootUrl:`${searchObj.formats[relevantIndex].root.url}`,
        mtl: `${searchObj.formats[relevantIndex].resources[0].url}`,
        thumbnail : `${searchObj.thumbnail.url}`
        })
    } else {
        objHolder.push({
            displayName: `${searchObj.displayName}`,
            authorName: `${searchObj.authorName}`,
            rootUrl:`${searchObj.formats[relevantIndex].root.url}`,
            thumbnail : `${searchObj.thumbnail.url}`
        })
    }
}

function indexFinder(searchObj) {
    return searchObj.formats.findIndex(format => format.formatType === "OBJ");
}

function renderCurrentObj(objArr) {
    destroyCurrentObj();
    scale = 1;
    let displayItem = objArr[objInt]
    let stage = document.querySelector('#stage');
    let objItem = document.createElement("a-asset-item");
    objItem.id = "current-obj";
    objItem.setAttribute('src',`${displayItem.rootUrl}`);
    stage.append(objItem);
    let objMat = document.createElement("a-asset-item");
    objMat.id = "current-mtl";
    objMat.setAttribute('src',`${displayItem.mtl}`);
    let objEntity = document.createElement("a-entity");
    stage.append(objMat);
    objEntity.id = "current-entity"
    objEntity.setAttribute('obj-model',"obj: #current-obj; mtl: #current-mtl");
    objEntity.setAttribute('scale',`${scale} ${scale} ${scale}`);
    stage.append(objEntity);
    document.getElementById("bottom-ui").classList.remove("hidden")
    document.getElementById("model-name").innerText = ` ${displayItem.displayName} `
    document.getElementById("model-by").innerText = `Model by: ${displayItem.authorName} `
}

function destroyCurrentObj() {
   currentEntity = document.getElementById("current-entity");
   
   if (document.getElementById("current-mtl")) {
    currentMtl = document.getElementById("current-mtl");
    currentMtl.parentNode.removeChild(currentMtl);
    }

    if (document.getElementById("current-obj")) {
    currentObj = document.getElementById("current-obj");
    currentObj.parentNode.removeChild(currentObj);
    }
   
   currentEntity.parentNode.removeChild(currentEntity);
   
}

function nextObj(e) {
    let objLen = objInt+1
    if (objLen === objHolder.length && pageToken)
    {
        loadMoreObjects()
    } else if (objLen === objHolder.length) {
        alert("There's no more objects for this search!")
    } else {
    objInt++
    document.querySelector("#back-button").disabled = false;
    renderCurrentObj(objHolder);
    }
}

function prevObj(e) {
    objInt--
    if (objInt === 0) {
        e.currentTarget.disabled = true;
    }
    renderCurrentObj(objHolder);
}

function biggify(e) {
    document.querySelector("#current-entity").setAttribute('scale',`${scale*1.1} ${scale*1.1} ${scale*1.1}`);
    scale = scale*1.1
}

function smallify(e) {
    document.querySelector("#current-entity").setAttribute('scale',`${scale*.9} ${scale*.9} ${scale*.9}`);
    scale = scale*.9
}

function loadMoreObjects(){
    objInt = 0;
    let newUrl = `https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=OBJ&key=${API_KEY}&pageToken=${pageToken}`
    fetch(newUrl)
        .then(response => response.json())
        .then(saveObjResourcesLocally)
}
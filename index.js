
// https://poly.googleapis.com/v1/assets?keywords=cheese&format=OBJ&key=AIzaSyBC9puPjTcS63cU_HLfcSqOqs3Lrx7QXvk

//https://poly.googleapis.com/downloads/fp/1572865632197446/fojR5i3h_nh/ap4tcSxbVuP/flying%20sacuer.obj


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
    document.querySelector("#spin-toggle").addEventListener("click",spinToggle)
    document.querySelector("#layout-toggle").addEventListener("click",layoutToggle)
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
    objEntity.innerHTML =`<a-animation attribute="rotation" dur="8000" to="0 360 0" repeat="indefinite" easing="linear">
    </a-animation>`
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
    scale = scale*1.15
}

function smallify(e) {
    document.querySelector("#current-entity").setAttribute('scale',`${scale*.9} ${scale*.9} ${scale*.9}`);
    scale = scale*.85
}

function loadMoreObjects(){
    objInt = 0;
    let newUrl = `https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=OBJ&key=${API_KEY}&pageToken=${pageToken}`
    fetch(newUrl)
        .then(response => response.json())
        .then(saveObjResourcesLocally)
}

let vertical = true;

function layoutToggle() {
let stage = document.querySelector('#stage')
if (vertical) {
    stage.setAttribute("rotation","0 0 0")
    stage.setAttribute("position","0 0 0")
    } else {
    stage.setAttribute("rotation","90 0 0")
    stage.setAttribute("position","0 2 0") 
    }
   vertical = !vertical 
}

let spinning = true;

function spinToggle() {
    let currentEnt = document.querySelector('#current-entity')
    if (spinning){
        currentEnt.innerHTML =``
    } else {
        currentEnt.innerHTML =`<a-animation attribute="rotation" dur="8000" to="0 360 0" repeat="indefinite" easing="linear">
    </a-animation>`;
    console.log("should be spinning")
    }
    spinning = !spinning
}
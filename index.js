

const API_KEY = 'AIzaSyBC9puPjTcS63cU_HLfcSqOqs3Lrx7QXvk';

function init () {
    document.querySelector("#polyQuery").addEventListener("submit",searchPoly)
    document.querySelector("#forward-button").addEventListener("click",nextObj)
    document.querySelector("#back-button").addEventListener("click",prevObj)
    document.querySelector("#bigger-button").addEventListener("click",biggify)
    document.querySelector("#smaller-button").addEventListener("click",smallify)
}

document.addEventListener("DOMContentLoaded",init);

function searchPoly( e ) {
    e.preventDefault()
    let keywords = e.target[0].value
    e.target.reset()
    fetch(`https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=OBJ&key=${API_KEY}`)
        .then(response => response.json())
        .then(saveObjResourcesLocally)
}

let objHolder = [];
let objInt = 0;
let scale = 1;

function saveObjResourcesLocally(searchObjs) {
    objHolder = [];
    searchObjs.assets.forEach(searchObj => { 
    objHolder.push({
        displayName: `${searchObj.displayName}`,
        authorName: `${searchObj.authorName}`,
        rootUrl:`${searchObj.formats[0].root.url}`,
        mtl: `${searchObj.formats[0].resources[0].url}`,
        thumbnail : `${searchObj.thumbnail.url}`
        })
    })
    renderCurrentObj(objHolder);
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
    document.getElementById("model-name").innerText = ` ${displayItem.displayName} by ${displayItem.authorName} `
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
    objInt++
    renderCurrentObj(objHolder);
}

function prevObj(e) {
    objInt--
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
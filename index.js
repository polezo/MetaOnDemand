
console.log("hi")

const API_KEY = 'AIzaSyBC9puPjTcS63cU_HLfcSqOqs3Lrx7QXvk';

function init () {
    document.querySelector("#polyQuery").addEventListener("submit",searchPoly)
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
let currentObj = 0;

function saveObjResourcesLocally(searchObjs) {
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
    let stage = document.querySelector('#stage');
    let objItem = document.createElement("a-asset-item");
    objItem.id = "current-obj";
    objItem.setAttribute('src',`${objArr[currentObj].rootUrl}`);
    stage.append(objItem);
    let objMat = document.createElement("a-asset-item");
    objMat.id = "current-mtl";
    objMat.setAttribute('src',`${objArr[currentObj].mtl}`);
    let objEntity = document.createElement("a-entity");
    objEntity.id = "current-entity"
    stage.append(objMat);
    objEntity.setAttribute('obj-model',"obj: #current-obj; mtl: #current-mtl");
    stage.append(objEntity);
}

function destroyCurrentObj() {
   currentEntity = document.getElementById("current-entity");
   currentEntity.parentNode.removeChild(currentEntity);
}



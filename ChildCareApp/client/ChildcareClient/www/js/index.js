var serverIP = "192.168.0.100"; // This is the local computer IP

//This method created the button from the approriate children
async function createButton(textBtn, childid) {
  $("#btnContainer").append(
    "<button class='ui-btn' data-index-number=" +
      childid +
      " id='childBtn'>" +
      textBtn +
      "</button>"
  );
}

// This variable hold the username of the eduactor. ****take from login*****
var educatorUsername = "saajidh.nizam@cqumail.com";
// this method fetch the details of the childrens an educator
function fetchChildrenDetails() {
  var childByEduURL = `http://${serverIP}:3000/children/${educatorUsername}`;
  $.ajax({
    type: "GET",
    url: childByEduURL,
    dataType: "JSON",
    success: function (data) {
      if (data.length != 0) {
        console.log(data);
        storeChildrenDetails(data);

        var childrendDetailsArray = retrieveChildrensFromLocalStore();

        for (
          var childernNo = 0;
          childernNo < childrendDetailsArray.length;
          childernNo++
        ) {
          var childName = childrendDetailsArray[childernNo].Name;
          var childid = childrendDetailsArray[childernNo]._id;

          createButton(childName, childid);
        }
      } else {
        $("#btnContainer").append("<p>No children assign to you room</p>");
      }
    },
  });
}

var valData;

// this function retrive the details of
// a perticuler child when the educator choose the childe to enter details
// children details are retrived from the database from the fetchChildrenDetails function
function fetchChildrenDetailsById(ChildId) {
  var childrenStorageData = localStorage.getItem(
    "childrenofEducatorLocalStorage"
  );
  var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];

  for (
    var childernNo = 0;
    childernNo < childrenStorageDataArray.length;
    childernNo++
  ) {
    var childName = childrenStorageDataArray[childernNo].Name;
    var childid = childrenStorageDataArray[childernNo]._id;
    var childRoom = childrenStorageDataArray[childernNo].Room;
    if (childid == ChildId) {
      $(".reflection-name").empty();
      $(".reflection-name").append(childName);
      $(".reflection-name").attr("data-index-number", childid);
      $(".reflection-room").empty();
      $(".reflection-room").append(childRoom);
      // add the data-index-number attribute that is used in the form through out
      $("#camera-take-images").attr("data-index-number", childid);
      $("#child-images").attr("data-index-number", childid);
    }
  }
}

// this method store the details of the children from the database in the localStroge
function storeChildrenDetails(childrenEndroledforEducator) {
  try {
    /* create if the loacal storage is not available in the local storage or 
     * clear the values and repoplate the children details when the user load 
    the application*/
    if (localStorage) {
      var childrenofEducatorLocalStorage;
      if (!localStorage["childrenofEducatorLocalStorage"])
        childrenofEducatorLocalStorage = [];
      else localStorage.clear();
      if (!(childrenofEducatorLocalStorage instanceof Array))
        childrenofEducatorLocalStorage = [];
      childrenofEducatorLocalStorage.push(childrenEndroledforEducator);
      // create the childrenofEducatorLocalStorage that contails the children for the educator
      localStorage.setItem(
        "childrenofEducatorLocalStorage",
        JSON.stringify(childrenofEducatorLocalStorage)
      );
      console.log("Given information successfully stored! Thank you.");
    }
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// This Method retrives the Children Details from the localstorage
function retrieveChildrensFromLocalStore() {
  try {
    //Here we are retriving the json object stroed in the childrenofEducatorLocalStorage local storge
    var childrenStorageData = localStorage.getItem(
      "childrenofEducatorLocalStorage"
    );
    var childrenStorageDataArray = JSON.parse(childrenStorageData)[0];
    return childrenStorageDataArray;
  } catch (error) {
    console.error(
      "Error detected while the store data to the local storage" + error
    );
    alert(
      "Unable to retrive details of the children, Please try again in moment. Sorry for the inconvininace"
    );
  }
}

// this is the document.ready fuction handeles the button click events
$(document).ready(function () {
  fetchChildrenDetails();
  $("#btnContainer").on("click", "#childBtn", function () {
    $("body").pagecontainer("change", "#daily-reflections-page", {
      transition: "slide",
    });
    // read the data values in the data attritute to fetch the each child a auctaor list
    // this helps to populate the each child details for create each page for eachild each day
    var childId = $(this).attr("data-index-number");
    fetchChildrenDetailsById(childId);
  });

  //this method used to encode the Base64 image file
  function encodeBase64(image) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(image);
    });
  }

  //This method work with cordova camera plugin
  let app = {
    init: function () {
      document
        .getElementById("camera-take-images")
        .addEventListener("click", app.takephoto);
    },
    takephoto: function () {
      //These are the options of the camera function when the camera take pictures
      let option = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL, // this returens base64 encoded string
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE, // use the image gallery
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK, //use the back camera
        targetWidth: 1024,
      };
      // this take the image from the camera
      navigator.camera.getPicture(app.ftw, app.wtf, option);
    },
    // This fuction is exicuted when the camera is successful
    ftw: function (imageURI) {
      // On successfully captured the image is desplay in the app and send a copy the the server
      sendImagetoServer(imageURI);
    },
    // this even fired when the camera failes
    wtf: function (message) {
      alert(message);
    },
  };

  // this fuction sends the image to the server as bas 64 encoded file
  function sendImagetoServer(imageURI) {
    var base64Img = imageURI;
    var image = new Image();
    image.src = "data:image/jpeg;base64," + base64Img;
    var childImageId = $("#child-images").attr("data-index-number");
    var cemeraAttrbuteId = $("#camera-take-images").attr(
      "data-index-number"
    );
    //add the Image preview to the report check the attrubute in the button and 
    //div tages to match in order to avoid the images loaded in every child's reflection pages  
    if (childImageId == cemeraAttrbuteId) {
      var img = document.createElement("img");
      img.src = "data:image/jpg;base64," + imageURI;
      document.getElementById("child-images").appendChild(img);
    }

    //store the Image captured in the server
    var childimgURL = `http://${serverIP}:3000/img`;

    var form = new FormData();
    form.append("image", image);

    var settings = {
      url: childimgURL,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        fileName: `${new Date().getTime()}.jpg`,
        fileContent: base64Img,
      }),
    };
    // the file is storted succfully it returens the link of the image from the server
    $.ajax(settings).done(function (response) {
      console.log(response.imageurl);
      var imageLink = response.imageurl;
    });
  }

  document.addEventListener("deviceready", app.init);
});

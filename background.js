var portrait = [
	"./imgs/l1.jpg",
	"./imgs/l2.jpg",
	"./imgs/l3.jpg",
	"./imgs/l4.jpg",
	"./imgs/l5.jpg",
	"./imgs/l6.jpg",
	"./imgs/l7.jpg",
	"./imgs/l8.jpg",
	"./imgs/l9.jpg",
	"./imgs/l10.jpg"
];
var landscape = [
	"./imgs/p1.jpg",
	"./imgs/p2.jpg",
	"./imgs/p3.jpg",
	"./imgs/p4.jpg",
	"./imgs/p5.jpg"
];


function preload_image(im_url) {
  let img = new Image();
  img.src = im_url;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function checkCookie() {
  let username = getCookie("id");
  if (!username) {
    return true;
  } else {
    return false;
  }
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function ChangeBackgroundImage() {
    if (detectMob()) {
        var i = Math.floor((Math.random() * (portrait.length - 1)));
        document.body.style.backgroundImage = "url('" + portrait[i] + "')"; 
    } else {
        var i = Math.floor((Math.random() * (landscape.length - 1)));
        document.body.style.backgroundImage = "url('" + landscape[i] + "')"; 
    }
}



portrait.forEach(preload_image);
landscape.forEach(preload_image);


const form = document.querySelector("#messageForm");

async function sendData() {
	if (checkCookie("id")) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "http://192.168.111.234:35943/api/message");
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	    const body = JSON.stringify({
	        from: document.getElementById("from").value,
	        message: document.getElementById("message").value
	      });
	    xhr.onload = () => {
		    if (xhr.readyState == 4 && xhr.status == 200) {
			    var res = JSON.parse(xhr.responseText);
			    if (res["error"] == "Message too negative") {
		        	alert("Din besked er alt for negativ...");
		        	return false;
		        }
		        setCookie("id", res["_id"], 365);
				console.log(JSON.parse(xhr.responseText));
				window.location.href = "https://AlbertDaYoung.github.io/finished.html"; 
		    } else {
		        console.log(`Error: ${xhr.status}`);
		    }
	    };
	    xhr.send(body);
	} else {
		alert("Du har allerede skrevet en besked...");
	}
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});

setInterval(ChangeBackgroundImage, 5000);

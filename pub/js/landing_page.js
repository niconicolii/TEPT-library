"use strict";
const log = console.log;

const intro_wrapper = document.querySelector('#intro_wrapper');
const demo_wrapper = document.querySelector('#demo_wrapper');
const api_wrapper = document.querySelector('#api_wrapper');

function showIntro(){
	intro_wrapper.style.display = 'block';
	demo_wrapper.style.display = 'none';
	api_wrapper.style.display = 'none';
}

function showDemo(){

	intro_wrapper.style.display = 'none';
	demo_wrapper.style.display = 'block';
	api_wrapper.style.display = 'none';
}

function showAPI(){
	intro_wrapper.style.display = 'none';
	demo_wrapper.style.display = 'none';
	api_wrapper.style.display = 'block';
}

const params = new URLSearchParams(window.location.search)
let tab = params.get('tab');
if (tab !== null && tab == 'api'){
    showAPI();
} else if (tab !== null && tab == 'demo') {
	showDemo();
}

/*************** shared function ***********************/

function addComment(e, commentForm, tept, content_name){
	e.preventDefault();
	const comment = commentForm.elements[content_name].value.trim();
	if (comment === ''){
		alert('Comment must not be empty!');
	} else {
		const color = commentForm.elements['hex'].value;
		const effect = commentForm.elements['effect'].value;
		
		const success = tept.createText(comment, null, null, color, null, null, effect);
		if (!success){
			alert('failed!')
		}
	}
}



/*************** first video demo ***********************/

const tept1 = new TEPT();

tept1.setVideo('first_v');

const first_trans = document.querySelector("#first_trans");
first_trans.addEventListener('input', ()=>{
	tept1.changeTransparency(first_trans.value / 100.0);
})


const first_commentForm = document.querySelector('#first_commentForm');
first_commentForm.addEventListener('submit', function(e){
	e.preventDefault();
	const comment = first_commentForm.elements['first_content'].value.trim();
	if (comment === ''){
		alert('Comment must not be empty!');
	} else {
		const color = first_commentForm.elements['first_hex'].value;
		const effect = first_commentForm.elements['first_effect'].value;
		
		const success = tept1.createText(comment, null, null, color, null, null, effect);
		if (!success){
			alert('failed!')
		}
	}
});

const first_colorInput = first_commentForm.elements['first_color'];
const first_hexInput = first_commentForm.elements['first_hex'];
first_colorInput.addEventListener('input', ()=> {
	first_hexInput.value = first_colorInput.value;
})





/*************** second video demo ***********************/
let player;
const tept2 = new TEPT();

// https://developers.google.com/youtube/iframe_api_reference - YouTube Iframe Player API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube_video', {
        width: 640,
        height: 360,
        videoId: 'H8YW1tlsmE8'
    });
    // set video for TEPT
    player.addEventListener('onReady', function(e){
    	tept2.setYoutubeVideo(player, 'youtube_video');
    })
}

const second_trans = document.querySelector("#second_trans");
second_trans.addEventListener('input', ()=>{
	tept2.changeTransparency(second_trans.value / 100.0);
})


const second_commentForm = document.querySelector('#second_commentForm');
second_commentForm.addEventListener('submit', function(e){
	e.preventDefault();
	const comment = second_commentForm.elements['second_content'].value.trim();
	if (comment === ''){
		alert('Comment must not be empty!');
	} else {
		const color = second_commentForm.elements['second_hex'].value;
		const effect = second_commentForm.elements['second_effect'].value;
		
		const success = tept2.createText(comment, null, null, color, null, null, effect);
		if (!success){
			alert('failed!')
		}
	}
});

const second_colorInput = second_commentForm.elements['second_color'];
const second_hexInput = second_commentForm.elements['second_hex'];
second_colorInput.addEventListener('input', ()=> {
	second_hexInput.value = second_colorInput.value;
})


/*************** third video demo ***********************/

const tept3 = new TEPT();
const area = [0.01, 0.6, 0.6, 0.9];
tept3.setVideo('third_v', area);
tept3.changeAlignment("left")
tept3.setDefaultPositionPer(0.02, 1)

const third_commentForm = document.querySelector('#third_commentForm');
third_commentForm.addEventListener('submit', addPushComment);


function addPushComment(e){
	const form = third_commentForm;
	e.preventDefault();
	const comment = form.elements['username'].value.trim() + ': ' +form.elements['third_content'].value.trim();
	if (comment === ''){
		alert('Comment must not be empty!');
	} else {		
		const success = tept3.createText(comment, null, null, null, null, null, 'push up');
		if(!success) {
			alert('Failed to submit comment! Username and/or comment too long!')
		}
	}
}

/*************** fourth video demo ***********************/

const tept4 = new TEPT();
tept4.setVideo('forth_v');
tept4.setDefaultPositionPer(0.5, 0.8);

let startTime;

const caption = document.querySelector('#caption');
const set_time = document.querySelector('#set_time');
set_time.addEventListener('mousedown', (e)=>{
	e.preventDefault();
	startTime = tept4.getVideoTime(tept4.v);
});
set_time.addEventListener('mouseup', (e)=>{
	e.preventDefault();

	const endTime = tept4.getVideoTime(tept4.v);
	
	const comment = caption.value.trim();
	if (comment === ''){
		alert('Comment must not be empty!');
	} else {		
		const success = tept4.createText(comment, startTime, endTime, null, null, null, 'no change');
		if(!success) {
			alert('Failed to submit comment! Username and/or comment too long!')
		}
	}
});


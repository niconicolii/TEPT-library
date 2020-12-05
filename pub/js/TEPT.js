"use strict";
(function(global) {

	function TEPT() {
		this.texts = [];
		this.defaultDuration = 5;
		this.defaultPositionPer = null;
		this.defaultSize = 20;
		this.defaultColor = "white";
		this.defaultEffect = "no change";
		this.alignment = "center";
		this.v;
		this.c;
		this.allTrans = 1.0;
		this.prevTime = 0;	// previous video time
		this.getTextIntervalID;
		this.timerID;
		this.displayingTexts = [];
		this.playAnimate = false;
	}

	TEPT.prototype = {
		getVideoTime: function(v){
			// https://developers.google.com/youtube/iframe_api_reference - YouTube Iframe Player API
			const currentTime = (v.currentTime !== undefined) ? v.currentTime : v.getCurrentTime();
			return currentTime;
		},

		resizeCanvas: function(canvasArea, tept){
			const v = tept.v;
			if (canvasArea){
				tept.c.height = (canvasArea[3] - canvasArea[2]) * v.clientHeight;
				tept.c.width = (canvasArea[1] - canvasArea[0]) * v.clientWidth;
				tept.c.style.top = (v.offsetTop + canvasArea[2] * v.clientHeight).toString() + "px";
				tept.c.style.left = (v.offsetLeft + canvasArea[0] * v.clientWidth).toString() + "px";
			}
			else {
				tept.c.height = v.clientHeight;
				tept.c.width = v.clientWidth;
			    tept.c.style.top = (v.offsetTop).toString() + "px";
			    tept.c.style.left = (v.offsetLeft).toString() + "px";
			}
		},

		setVideo: function(id,canvasArea=null){
			this.v = document.querySelector('#' + id);
			this.v.setAttribute("class", "v");
			// record isYoutube
			this.v.isYoutube = false;

			this.c = document.createElement('canvas');
			this.c.setAttribute("id", "c_" + id);
			this.c.classList.add('c');

			this.v.parentElement.appendChild(this.c);
			
			const tept = this;
			this.v.addEventListener('play', function(e){
				tept.__proto__.resizeCanvas(canvasArea, tept);
				tept.__proto__.displayTexts(tept);
			});
			this.v.addEventListener('pause', ()=>{
				tept.__proto__.pauseTexts(tept);
			});
			this.v.addEventListener('seeked', function(e){
				tept.displayingTexts = [];
				tept.playAnimate = false;
				// set time out to avoid calling animation() more than one time
				setTimeout(() => {
					tept.__proto__.displayTexts(tept);
				}, 100)	
				
			})

			// resize canvas when window resized
			window.addEventListener("resize", function(){
				setTimeout(function(){
					tept.resizeCanvas(canvasArea, tept);
				}, 300);
			});
		},

		setYoutubeVideo: function(player, container_id, canvasArea=null){
			this.v = player;
			this.v.isYoutube = true;

			const container = document.querySelector('#' + container_id);
			container.setAttribute('class', 'v');

			this.c = document.createElement('canvas');
			this.c.setAttribute("id", "c_"+ container_id);
			this.c.classList.add('c');

			container.parentElement.appendChild(this.c);
			
			const tept = this;

			// https://developers.google.com/youtube/iframe_api_reference - YouTube Iframe Player API
			this.v.addEventListener('onStateChange', function(e){
				if(e.data == YT.PlayerState.PLAYING){
					// if video's attributes not set, set now;
					if(!tept.v.clientWidth){
						tept.v.offsetTop = container.offsetTop;
						tept.v.offsetLeft = container.offsetLeft;
						tept.v.clientHeight = container.clientHeight;
						tept.v.clientWidth = container.clientWidth;
					}

					tept.__proto__.resizeCanvas(canvasArea, tept);
					if (Math.abs(tept.prevTime - tept.__proto__.getVideoTime(tept.v)) > 1.5 || 
						Math.round(tept.__proto__.getVideoTime(tept.v)) == 0){
						// stop playing Animate first other wise we are calling two animate()
						tept.displayingTexts = [];
					}
					// set time out to avoid calling animation() more than one time
					tept.playAnimate = false;
					setTimeout(()=>{
						tept.__proto__.displayTexts(tept);
					}, 100);
					
				}
				else if (e.data == YT.PlayerState.PAUSED){
					tept.__proto__.pauseTexts(tept);
				}
			})

			// resize canvas when window resized
			window.addEventListener("resize", function(){
				setTimeout(function(){
					tept.v.offsetTop = container.offsetTop;
					tept.v.offsetLeft = container.offsetLeft;
					tept.v.clientHeight = container.clientHeight;
					tept.v.clientWidth = container.clientWidth;
					tept.resizeCanvas(canvasArea, tept);
				}, 300);
			});
		},

		changeTransparency: function (transparency){
			this.allTrans = transparency;
		},

		setDefaultDuration: function (duration){
			this.defaultDuration = duration;
		},

		setDefaultSize: function(size){
			this.defaultSize = size;
		},

		setDefaultColor(color){
			this.defaultColor = color;
		},

		setDefaultPositionPer: function(x, y){
			this.defaultPositionPer = [x,y];
		},

		setDefaultEffect: function(effect){
			this.defaultEffect = effect;
		},

		changeAlignment: function(align){
			this.alignment = align;
		},

		createText: function(content, startTime=null, endTime=null, 
			    	color=null, size=null, 
			    	positionPer=null, effect=null){
			let ifShowNow = false;	// indicate if text should be shown right away

			effect = effect ? effect : this.defaultEffect;

			// only left to right and right to left effects can accept a text longer than the canvas width
			const ctx = this.c.getContext('2d');
			if (ctx.measureText(content).width >= this.c.width && 
				effect !== 'left to right' && effect !== 'right to left') {
				return false;
			}
			const halfWidth = ctx.measureText(content).width / 2;

			if(startTime == null){
				startTime = this.getVideoTime(this.v);
				startTime += 0.2;
			}
			// if it is a no change text and with out an end time, set end time to start time + default time
			if (effect == 'no change' && endTime == null){
				endTime = startTime + this.defaultDuration;
			}
			size = size ? size : this.defaultSize;
			color = color ? color : this.defaultColor;

			const ifAdjust = positionPer ? false : true;
			positionPer = positionPer ? positionPer : this.defaultPositionPer;

			const newText = new Text(content, startTime, endTime, color, size, positionPer, effect, ifAdjust, halfWidth);
			this.texts.push(newText);
			return true;
		},

		displayTexts: function(tept){
			tept.playAnimate = true;
		    this.animate(tept);
			
			if (!tept.getTextIntervalID){
				const this_temp = this;
				tept.getTextIntervalID = setInterval(function(){
					const currTime = Math.floor(tept.__proto__.getVideoTime(tept.v) * 10) / 10;
					const pendingTexts = tept.texts.filter(text =>{
						Math.floor(text.startTime * 10) / 10 
						return Math.floor(text.startTime * 10) / 10 >= currTime;
					});
					this_temp.getAllOnDisplay(pendingTexts, tept);
				}, 100);	
			}
		    if (!tept.timerID){
		    	const this_temp = this;
		    	tept.timerID = setInterval(function(){
		    		tept.prevTime = this_temp.getVideoTime(tept.v);
		    	}, 1000);
		    }
		},

		pauseTexts: function(tept){
			tept.playAnimate = false;
			clearInterval(tept.getTextIntervalID);
			clearInterval(tept.timerID);
			tept.getTextIntervalID = null;
			tept.timerID = null;
		},

		getAllOnDisplay: function(pendingTexts, tept){
			// add text to list of currently displaying texts if at start time
			const currTime = Math.floor(this.getVideoTime(tept.v) * 10) / 10;
			pendingTexts = pendingTexts.sort((a,b) => a.startTime - b.startTime);
			for(let text of pendingTexts){
				if(Math.floor(text.startTime * 10) / 10 <= currTime){
					text.adjust(tept.c, tept.displayingTexts);
					tept.displayingTexts.push(pendingTexts.shift());
				} else {
					break;
				}
			}
		},

		animate: function(tept){
			if (tept.playAnimate){
				requestAnimationFrame(() => {
					this.animate(tept);
				});
			};
			const ctx = tept.c.getContext('2d');
			ctx.clearRect(0, 0, tept.c.width, tept.c.height);
			ctx.globalAlpha = tept.allTrans;
			for (let text of tept.displayingTexts){
				ctx.font = text.size + "px Arial";
				ctx.fillStyle = text.color;
				ctx.textAlign = tept.alignment;
				ctx.fillText(text.content, text.act_position[0], text.act_position[1]);
			}

			// remove all text that should not be displayed
			tept.displayingTexts = tept.displayingTexts.filter(text => {
				return text.update(tept.c, this.getVideoTime(tept.v), tept.displayingTexts);
			});
		}
	}

	// text object that is on text to be shown with the video
	// Possible effects will be: ['no change', 'left to right', 'right to left', 
	//							  'top to bottom', 'bottom to top']
	class Text{
		constructor(content, startTime, endTime, 
				    color, size, positionPer, effect, ifAdjust, halfWidth){
			this.content = content;
			this.startTime = startTime;
			this.endTime = endTime;
			this.color = color;
			this.size = size;
			this.positionPer = positionPer;
			this.effect = effect;
			this.ifAdjust = ifAdjust;
			this.halfWidth = halfWidth;

			// actual position displaying on screen
			this.act_position = [];
			// change in x and y position when displaying on screen
			switch(this.effect) {
				case 'no change':
					this.dx = 0;
					this.dy = 0;
					// inital position is middle bottom if no position specified by user
					if(!this.positionPer){
						this.positionPer = [0.5,0.9];  
					} 
					break;
				case 'left to right':
			  		this.dx = 2;
			  		this.dy = 0;
			  		// inital position is left up if no position specified by user
			  		if(!this.positionPer){
						this.positionPer = [0,0.1];  
					}					
			    	break;
			  	case 'right to left':
			    	this.dx = -2;
			    	this.dy = 0;
			    	// inital position is right up if no position specified by user
			  		if(!this.positionPer){
						this.positionPer = [1,0.1];  
					}
			    	break;
			  	case 'top to bottom':
			  		this.dx = 0;
			  		this.dy = 2;
			  		// inital position is middle top if no position specified by user
			  		if(!this.positionPer){
						this.positionPer = [0.5,0];  
					}
			  		break;
			  	case 'bottom to top':
			  		this.dx = 0;
			  		this.dy = -2;
			  		// inital position is middle top if no position specified by user
			  		if(!this.positionPer){
						this.positionPer = [0.5,1];  
					}
			  		break;
			  	case 'push up':
			  		this.dx = 0;
			  		this.dy = -2;
			  		// inital position is middle top if no position specified by user
			  		if(!this.positionPer){
						this.positionPer = [0.01,0.9];  
					}
			  		break;
			  	default:
			    	this.dx = 0;
			    	this.dy = 0;
			    	break;
			}
			
		}

		reset(c){
			switch(this.effect) {
				case 'no change':
					this.act_position  = [c.width*this.positionPer[0], c.height*this.positionPer[1]];
					break;
				case 'left to right':
			  		// actual initial position must be left most of scope
					this.act_position  = [0-this.halfWidth, c.height*this.positionPer[1]];
			    	break;
			  	case 'right to left':
			    	// actual initial position must be right most of scope
					this.act_position  = [c.width+this.halfWidth, c.height*this.positionPer[1]];
			    	break;
			  	case 'top to bottom':
			  		// actual initial position must be top most of scope
					this.act_position  = [c.width*this.positionPer[0], 0-this.size];
			  		break;
			  	case 'bottom to top':
			  		// actual initial position must be top most of scope
					this.act_position  = [c.width*this.positionPer[0], c.height+this.size];
			  		break;
			  	case 'push up':
			  		// actual initial position must be top most of scope
					this.act_position  = [c.width*this.positionPer[0], c.height+this.size];
			  		break;
			  	default:
			    	this.act_position  = [c.width*this.positionPer[0], c.height*this.positionPer[1]];
			    	break;
			}
		}

		update(c, currentTime, displayingTexts){
			// make movement and return true if text should still be on display
			let ifStay;
			switch(this.effect) {
				case 'no change':
					ifStay = this.endTime > currentTime;
					break;
				case 'left to right':
					this.act_position[0] = this.act_position[0] + this.dx;
			  		ifStay = this.act_position[0] - this.halfWidth < c.width;
			  		break;
			  	case 'right to left':
			  		this.act_position[0] = this.act_position[0] + this.dx;
			    	ifStay = this.act_position[0] + this.halfWidth > 0;
			    	break;
			  	case 'top to bottom':
			  		this.act_position[1] = this.act_position[1] + this.dy;
			  		ifStay = this.act_position[1] + this.size < c.height;
			  		break;
			  	case 'bottom to top':
			  		this.act_position[1] = this.act_position[1] + this.dy;
			  		ifStay = this.act_position[1] > 0;
			  		break;
			  	case 'push up':
			  		const out_of_screen = displayingTexts.filter(text => {
			  			return text.effect == 'push up' && text.act_position[1] > c.height; // TODO: out of screen? how about out of area?
			  		});
			  		if (out_of_screen.length > 0){
			  			this.act_position[1] = this.act_position[1] + this.dy;
			  		}
			  		ifStay = this.act_position[1] > 0;
			  		break;
			  	default:
			  		ifStay = true;
			    	break;
			}
			return ifStay;
		}

		// given the previous texts already showing in the screen, adjust self position
		// if needed
		adjust(c, displayingTexts){
			this.reset(c);
			if (!this.ifAdjust){
				return;
			}
			let prevTexts = displayingTexts.filter(text => text.effect == this.effect);
			let last;
			switch(this.effect) {
				case 'no change':
					prevTexts.sort((a,b) => b.act_position[1] - a.act_position[1]);
					for(let text of prevTexts){
						if (this.act_position[1] === text.act_position[1]){
							this.act_position[1] -= this.size;
						}
						else {
							break;		
						}
					}
					break;
				case 'left to right':
					prevTexts.sort((a,b) => a.act_position[1] - b.act_position[1]);
					while(prevTexts.length > 0){
						let text = prevTexts.shift();
						if (text.act_position[1] != this.act_position[1]){
							break;
						}
						else if (text.act_position[0] - text.halfWidth < 10){
							prevTexts = prevTexts.filter(currText => currText.act_position[1] != this.act_position[1]);
							this.act_position[1] += this.size;
						}
					}
			    	break;
			  	case 'right to left':
			  		prevTexts.sort((a,b) => a.act_position[1] - b.act_position[1]);
					while(prevTexts.length > 0){
						let text = prevTexts.shift();
						if (text.act_position[1] != this.act_position[1]){
							break;
						}
						else if (text.act_position[0] + text.halfWidth > c.width - 10){
							prevTexts = prevTexts.filter(currText => currText.act_position[1] != this.act_position[1]);
							this.act_position[1] += this.size;
						}
					}
			    	break;
			  	case 'top to bottom':
			  		prevTexts.sort((a,b) => a.act_position[1] - b.act_position[1]);
			  		last = prevTexts.shift();
			  		if (prevTexts.length > 0 && last.act_position[1] <= 0){
			  			this.act_position[1] = last.act_position[1] - this.size - 2;
			  		}
			  		break;
			  	case 'bottom to top':
			  		prevTexts.sort((a,b) => a.act_position[1] - b.act_position[1]);
			  		last = prevTexts.pop();
			  		if (prevTexts.length > 0 && last.act_position[1] >= c.height ){
			  			this.act_position[1] = last.act_position[1] + last.size + 2;
			  		}
			  		break;
			  	case 'push up':
			  		prevTexts.sort((a,b) => a.act_position[1] - b.act_position[1]);
			  		last = prevTexts.pop();
			  		if (prevTexts.length > 0 && last.act_position[1] >= c.height ){
			  			this.act_position[1] = last.act_position[1] + last.size + 2;
			  		}
			  		break;
			  	default:
			    	break;
			}
		}
	}
	global.TEPT = global.TEPT || TEPT;
})(window);



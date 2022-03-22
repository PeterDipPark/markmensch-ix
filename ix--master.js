// DEV: <script src="http://dc.local/~dogma/_sites/scoop.dippark.com/head/_temp/gigs/markmensch-ix/ix--master.js"></script>

var POSTS_slug = "gesellschaftsdesign";
var TAGS_slug = "tags";
var CASES_slug = "cases";
var MEMBERS_slug = "team-members";
var MAGAZINE_slug = "magazin";
var SHOP_slug = "shop/shop";
var SHOPPRODUCT_slug = "product";
var SHOPCATEGORY_slug = "category";
var SHOPFILTER_slug = "shop/shop";
var STYLE_body = "-webkit-transition:padding-top 0.3s ease-out;-moz-transition:padding-top 0.3s ease-out;-o-transition:padding-top 0.3s ease-out;transition:padding-top 0.3s ease-out;";
var STYLE_nav = "height:[%h]px;-webkit-transition: height 0.3s ease-out, top 0.3s ease-out;-moz-transition:height 0.3s ease-out, top 0.3s ease-out;-o-transition:height0.3s ease-out,top 0.3s ease-out;transition:height 0.3s ease-out,top 0.3s ease-out;";
var STYLE_target = "-webkit-transition:transform 0.3s ease-out;-moz-transition:transform 0.3s ease-out;-o-transition:transform 0.3s ease-out;transition:transform 0.3s ease-out;";
var STYLE_targetnav = "-webkit-transition:opacity 0.3s ease-in;-moz-transition:opacity 0.3s ease-in;-o-transition:opacity 0.3s ease-in;transition:opacity 0.3s ease-in;";
var STYLE_filter = "z-index:-1; bottom: 0%;  -webkit-transition:bottom 0.3s ease-in, transform 0.3s ease-out;-moz-transition:bottom 0.3s ease-in, transform 0.3s ease-out;-o-transition:bottom 0.3s ease-out, transform 0.3s ease-out;transition:bottom 0.3s ease-in, transform 0.3s ease-out;";
var STYLE_cover = "-webkit-transition:bottom 0.3s ease-out;-moz-transition:bottom 0.3s ease-out;-o-transition:bottom 0.3s ease-in;transition:bottom 0.3s ease-out;";
(function() {

	// Exec Updates
		var domUpdates = {
			el_body: document.body,
			root: window.location.protocol + '//' + window.location.host,
			route: null,
			route_mag: false,
			route_shop: false,
			el_nav: null,
			el_trigger: null,			
			ix_running: false,
			el_trigs: {},
			el_target: {},
			el_cover: null,
			el_filter_current: null,
			resizeDelay: null,
			resizeDelayTime: 100,
			lastScrollTop: 0,
			init: function(nav_ix_name_)  {
				// Heights
				

				

					//clientHeight = the height of an element + the vertical padding. 
					//offsetHeight = the height of the element + the vertical padding + the top and bottom borders + the horizontal scrollbar (if it's available).


				this.route = window.location.href.replace(this.root,"").replace(/^\/+/,"").toLowerCase();
				this.route_mag = false;
				this.route_shop = false;

				// Body
				this.el_body.setAttribute("style",STYLE_body);
				// this.el_body.setAttribute("style","padding-top:initial;-webkit-transition:padding-top 0.3s ease-out;-moz-transition:padding-top 0.3s ease-out;-o-transition:padding-top 0.3s ease-out;transition:padding-top 0.3s ease-out;");
				
				// Nav transition
				this.el_nav = document.querySelector("[data-ix-nav='"+nav_ix_name_+"']");
				if (this.el_nav===null||this.el_nav.length==0) { console.error("Missing the ix nav."); return; }
				this.el_nav.setAttribute("style",STYLE_nav.replace("[%h]",this.el_nav.offsetHeight));
				// this.el_nav.setAttribute("style","-webkit-transition:height 0.3s ease-out;-moz-transition:height 0.3s ease-out;-o-transition:height 0.3s ease-out;transition:height 0.3s ease-out;");

				// Trigger IX
				this.el_trigger = this.el_nav.querySelectorAll("[data-ix-trigger]");
				if (this.el_trigger===null||this.el_trigger.length==0) { console.error("Missing the ix triggers."); return; }
				// this.setTriggerListener(this.el_trigger);
				for (var i = this.el_trigger.length - 1; i >= 0; i--) {
					var hasTarget = this.el_nav.querySelector("[data-ix-target='"+this.el_trigger[i].getAttribute("data-ix-trigger")+"']");					
					this.el_trigger[i].classList.remove("is--hover");
					if (hasTarget!==null) {
						this.el_trigs[this.el_trigger[i].getAttribute("data-ix-trigger")] = this.el_trigger[i];
						if (this.el_trigger[i].addEventListener) {
							this.el_trigger[i].addEventListener("click", this.ixTrigger.bind(this), false);
						} else {
							this.el_trigger[i].attachEvent('onclick', this.ixTrigger.bind(this));
						}
					} else {
						//console.warn("Missing target for the trigger:", this.el_trigger[i].getAttribute("data-ix-trigger"));
					}
				};

				

				// Target IX
				var el_target = this.el_nav.querySelectorAll("[data-ix-target]");				
				if (el_target===null||el_target.length==0) { 
					// console.error("Missing the ix targets."); 
					return; 
				}
				
				// Targets
				var el_subtarget, el_subclass, el_target_key;
				for (var i = el_target.length - 1; i >= 0; i--) {
					
					// Key
					el_target_key = el_target[i].getAttribute("data-ix-target");
					// Current
					el_subtarget = el_target[i].querySelector(".w--current");

					// States
					if (el_subtarget!==null) {
						el_subclass = el_subtarget.href.split("/").pop().toLowerCase();
						el_subtarget.classList.add(el_subtarget.getAttribute("data-ix-class")||"is--hover-"+el_subclass);
						// console.warn("add hover to ", el_subtarget);
						this.el_trigs[el_target_key].classList.add("is--hover");
					} else if (el_target_key=="magazine" && (this.route.indexOf(""+MAGAZINE_slug+"/")===0 || this.route.indexOf(""+POSTS_slug+"/")===0 || this.route.indexOf(""+TAGS_slug+"/")===0 || this.route.indexOf(""+MEMBERS_slug+"/")===0) ) {
						this.route_mag = true;
						// console.warn("add hover to ", this.el_trigs[el_target_key]);
						this.el_trigs[el_target_key].classList.add("is--hover");
					} else if (el_target_key=="agency" && this.route.indexOf(""+CASES_slug+"/")===0) {
						// console.warn("add hover to ", this.el_trigs[el_target_key]);
						this.el_trigs[el_target_key].classList.add("is--hover");
					} else if (el_target_key=="shop" && ( this.route.indexOf(""+SHOP_slug+"/")===0 || this.route.indexOf(""+SHOPPRODUCT_slug+"/")===0 || this.route.indexOf(""+SHOPCATEGORY_slug+"/")===0 ) ) {
						this.route_shop = true;
						// console.warn("add hover to ", this.el_trigs[el_target_key]);
						this.el_trigs[el_target_key].classList.add("is--hover");
					}
					el_target[i].classList.remove("is--visible-for-edit-only");

					// Props
					this.el_target[el_target_key] = {
						open:false,
						el:el_target[i],
						nav: el_target[i].firstElementChild,
						hover: this.el_trigs[el_target_key].classList.contains("is--hover"),
						sub: null,
						sub_state: null,
						sub_show: false,
						sub_target: false
					};
					this.el_target[el_target_key].nav.classList.remove("is--visible-for-edit-only");
					this.el_target[el_target_key].el.setAttribute("style",STYLE_target);
					this.el_target[el_target_key].nav.setAttribute("style",STYLE_targetnav);
				};

				// Trigget Subs
				const el_trigger_sub = this.el_nav.querySelectorAll("[data-ix-trigger-sub]");
				for (var i = el_trigger_sub.length - 1; i >= 0; i--) {
					if (el_trigger_sub[i].addEventListener) {
						el_trigger_sub[i].addEventListener("click", this.toggleSub.bind(this), false);
					} else {
						el_trigger_sub[i].attachEvent('onclick', this.toggleSub.bind(this));
					}
				};

				// Target Subs
				var el_target_sub = this.el_nav.querySelectorAll("[data-ix-target-sub]");
				// console.log("el_target_sub",el_target_sub);
				var el_target_sub_key;
				for (var i = el_target_sub.length - 1; i >= 0; i--) {
					el_target_sub[i].setAttribute("style", STYLE_filter);
					el_target_sub_key = el_target_sub[i].getAttribute("data-ix-target-sub");
					if (this.el_target[el_target_sub_key] !== undefined) {
						// Add to target obj
						this.el_target[el_target_sub_key].sub = el_target_sub[i];
						// State
						this.el_target[el_target_sub_key].sub_state = (this.el_target[el_target_sub_key].hover===true && this.route.indexOf(""+SHOPFILTER_slug+"")===0)?"v":"n";
						this.el_target[el_target_sub_key].sub_target = this.el_target[el_target_sub_key].sub_state === "v";
						this.setIxTargetSubState(el_target_sub_key,this.el_target[el_target_sub_key].sub_state, true);
						
					}
				}

				// Cover
				this.el_cover = this.el_nav.querySelector("[data-ix-cover]");
				if (this.el_cover!==null) {
				this.el_cover.setAttribute("style",STYLE_cover);
				}

				

				// Subnav post
				if (this.route_mag===true && this.route.indexOf(""+POSTS_slug+"/")===0) {
					// post page - set catg
					var el_cat = document.querySelector("a.blog_section_title_text");
					if (el_cat!==null) {
						var el_rte = el_cat.href.replace(this.root,"");
						var el_snv = this.el_target['magazine'].el.querySelector("[href='"+el_rte+"']");
						if (el_snv!==null) {
							var el_stl = el_rte.split("/").pop().toLowerCase();
							el_snv.classList.add(el_snv.getAttribute("data-ix-class")||"is-hover-"+el_stl);
						}
					}
				}
			
				
				

				// Delay init because it is depended on .w--current		
				//this.onDelayInit(el_target);

				// Window resize listener
				window.addEventListener('resize', function(event){
					this.handleResize_();
				}.bind(this));



				// Scroll
				var sub = this.getOpenSub();
				if (sub.el !== null && sub.state !== "n") {
					setTimeout(function() {
						this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
						// var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" :"mousewheel";
						// if (window.attachEvent) {
						//   window.attachEvent("on"+mousewheelevt, this.handleScroll_.bind(this));
						// } else if (window.addEventListener) {
						//   window.addEventListener(mousewheelevt, this.handleScroll_.bind(this),false);
						// }
						window.addEventListener("scroll", this.handleScroll_.bind(this), false);
					}.bind(this), 500);
				}



			},
			/*
			onDelayInit : function(el_target) {
				var el_subtarget, el_subclass;
				for (var i = el_target.length - 1; i >= 0; i--) {
					el_subtarget = el_target[i].querySelector(".w--current");
					if (el_subtarget!==null) {
						el_subclass = el_subtarget.href.split("/").pop().toLowerCase();
						el_subtarget.classList.add(el_subtarget.getAttribute("data-ix-class")||"is-hover-"+el_subclass);
						this.el_trigs[el_target[i].getAttribute("data-ix-target")].classList.add("is-hover");
					} else if (el_target[i].getAttribute("data-ix-target")=="magazine" && (this.route.indexOf(""+POSTS_slug+"/")===0 || this.route.indexOf(""+TAGS_slug+"/")===0 || this.route.indexOf(""+MEMBERS_slug+"/")===0) ) {
						this.route_mag = true;
						this.el_trigs[el_target[i].getAttribute("data-ix-target")].classList.add("is--hover");
					}
					el_target[i].classList.remove("is--visible-for-edit-only");
					// this.el_target[el_target[i].getAttribute("data-ix-target")] = {open:false,el:el_target[i],nav: el_target[i].firstElementChild};
					// this.el_target[el_target[i].getAttribute("data-ix-target")].nav.classList.remove("is--visible-for-edit-only");
					// this.el_target[el_target[i].getAttribute("data-ix-target")].nav.setAttribute("style","-webkit-transition: opacity 0.3s ease-in;-moz-transition: opacity 0.3s ease-in;-o-transition: opacity 0.3s ease-in;transition: opacity 0.3s ease-in;");
				};

				// Subnav post
				if (this.route_mag===true && this.route.indexOf(""+POSTS_slug+"/")===0) {
					// post page - set catg
					var el_cat = document.querySelector("a.blog_section_title_text");
					if (el_cat!==null) {
						var el_rte = el_cat.href.replace(this.root,"");
						var el_snv = this.el_target['magazine'].el.querySelector("[href='"+el_rte+"']");
						if (el_snv!==null) {
							var el_stl = el_rte.split("/").pop().toLowerCase();
							el_snv.classList.add(el_snv.getAttribute("data-ix-class")||"is-hover-"+el_stl);
						}
					}
				}
			},
			*/
			handleScroll_: function(evt) {
				// //Guess the delta.
				// var delta = 0;
				// if (!evt) evt = window.event;
				// if (evt.wheelDelta) {
				// delta = evt.wheelDelta/120;
				// } else if (evt.detail) {
				// delta = -evt.detail/3;
				// }
				// // console.log("evt passive", evt);
				// // if (evt.preventDefault) evt.preventDefault();
				// // evt.returnValue = false;

				// //Do the magic.
				// console.log("scroll delta",delta);
				// 
				// console.log(evt, sub);

				var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
				var dt = Math.abs(st - this.lastScrollTop);				
				var dir;
				if (st > this.lastScrollTop){
					// downscroll code
					dir = "d";
				} else {
					// upscroll code
					dir = "u";
				}
				this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

				// Trigger
				if (dt >= 10) {
					this.toggleSubScroll(dir);
				}

			},
			toggleSub: function(e) {
				e.preventDefault();
				e.stopPropagation();
				var key = e.currentTarget.getAttribute("data-ix-trigger-sub");
				this.setIxTargetSubState(key,"t");
			},
			toggleSubScroll: function(dir) {

				var sub = this.getOpenSub();
				var open = this.getOpenKey();

				//console.log("open", sub, this.el_target[open], dir);

				// HIDE/SHOW MAIN MENU
					/*
						if (dir === "d" ) {

							
							if (open!==null && this.el_target[open].sub === null) {
								// Close other submenu
								
								var mainHeight = this.el_nav.firstElementChild.offsetHeight;
								this.el_nav.style.top = -(mainHeight)+"px";									
								this.ixTriggerClose(true);

							} else {
								var mainHeight = this.el_nav.firstElementChild.offsetHeight;
								this.el_nav.style.top = -(mainHeight)+"px";
							}
						} else {
							this.el_nav.style.top = "0%";
						}
					*/
				
				if (dir === "d" && open!==null ) {

					this.ixTriggerClose(true);
							
							// if (open!==null && this.el_target[open].sub === null) {
							// 	// Close other submenu
								
							// 	// var mainHeight = this.el_nav.firstElementChild.offsetHeight;
							// 	// this.el_nav.style.top = -(mainHeight)+"px";									
							// 	this.ixTriggerClose(true);

							// } else if (open!==null) {
							// 	// var mainHeight = this.el_nav.firstElementChild.offsetHeight;
							// 	// this.el_nav.style.top = -(mainHeight)+"px";
							// 	this.ixTriggerClose(true);


							// }
				} else if (dir === "u" && open===null) {
							// this.el_nav.style.top = "0%";
							// this.ixTrigger(null,open);
							var sub = this.getOpenSub();
							if (sub!==null) {
								this.ixTrigger(null,sub.key);
							}
						}
				/*
				if (sub.el !== null && sub.state !== "n") {

					if (open!==null) {
						// Sub is open

						// HIDE/SHOW MAIN MENU
						if (dir === "d" ) {
							var mainHeight = this.el_nav.firstElementChild.offsetHeight;
							// console.warn("mainHeight", mainHeight);
							this.el_nav.style.top = -(mainHeight)+"px";
						} else {
							this.el_nav.style.top = "0%";
						}

					} else {
						// Submenu is not open
						
						// HIDE/SHOW MAIN MENU
						if (dir === "d" ) {
							var mainHeight = this.el_nav.firstElementChild.offsetHeight;
							console.warn("mainHeight", mainHeight);
							this.el_nav.style.top = -(mainHeight)+"px";
						} else {
							this.el_nav.style.top = "0%";
						}

						// HIDE/SHOW FILTER MENU
						// if (dir === "d" && sub.state === "v") {
						// 	//console.log("hide");
						// 	this.setIxTargetSubState(sub.key,"h");
						// } else if (dir === "u" && sub.state === "h") {
						// 	//console.log("show");
						// 	this.setIxTargetSubState(sub.key,"v");
						// }
					
					}

				}
				*/
			},
			handleResize_: function(e) {
				if (this.resizeDelay===null) {
			        this.resizeDelay = window.setTimeout(this.handleResizeDelay_.bind(this), this.resizeDelayTime);
			    }
			},
			handleResizeDelay_: function() {
				// Reset timer
			        window.clearTimeout(this.resizeDelay);
			        this.resizeDelay = null;
			    // Call dependent methods
			        this.ixTriggerClose();
			        this.toggleSubForce("shop", false);
			},		
			getStates: function() {
				var state = {};
				for (var k in this.el_target) {
					state[k] = this.el_target[k].open;
				}
				return state;
			},
			getOthersState: function(c, s) {
				// es4
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open,
				// 	magazine: this.el_target['magazine'].open,
				// 	shop: this.el_target['shop'].open
				// }
				var b = true;
				c_loop:
				for (var k in state) {
					if (k !== c && state[k] === !s) {
						b = false;
						break c_loop;
					}
				}
				return b;
			},
			getSelfState: function(c, s) {
				// es4
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open || false,
				// 	magazine: this.el_target['magazine'].open || false,
				// 	shop: this.el_target['shop'].open || false
				// }
				return state[c] === s;
			},
			getOpenKey: function() {
				// es4
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open  || false,
				// 	magazine: this.el_target['magazine'].open || false,
				// 	shop: this.el_target['shop'].open || false
				// }
				var key = null;
				c_loop:
				for (var k in state) {
					if (state[k] === true) {
						key = k;
						break c_loop;
					}
				}
				return key;
			},
			getOtherOpenKey: function(c) {
				// es4
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open || false,
				// 	magazine: this.el_target['magazine'].open || false,
				// 	shop: this.el_target['shop'].open || false
				// }
				var key = null;
				c_loop:
				for (var k in state) {
					if (k !== c && state[k] === true) {
						key = k;
						break c_loop;
					}
				}
				return key;
			},
			getOpenSub: function() {
				// es4
				var sub = {
					el: null,
					state: null,
					key: null,
					show: false,
					target: false
				};
				s_loop:
				for (var k in this.el_target) {
					if (this.el_target[k].sub !== null) {
						sub.key = k;
						sub.el = this.el_target[k].sub;
						sub.state = this.el_target[k].sub_state;
						sub.show = this.el_target[k].sub_show;
						sub.target = this.el_target[k].sub_target;
						break s_loop;
					}
				}
				return sub;
			},
			toggleSubForce: function(key, b) {
				var sub = this.el_target[key].sub
				if (sub !== null) {
					var targetHeight, navHeight, subHeight;
					subHeight = sub.offsetHeight;
					navHeight = this.el_nav.offsetHeight;
					bodyPadding = parseInt(window.getComputedStyle(this.el_body, null).getPropertyValue('padding-top').replace("px",""));
					this.el_target[key].sub_show = b;
					var trig = this.el_target[key].el.querySelector("[data-ix-trigger-sub='"+key+"']");

					if (b === false) {

						// console.log("get hover", this.el_filter_current );
						if (this.el_filter_current!==null) {
							this.el_filter_current.classList.add("w--current");							
						}
						trig.classList.remove("w--current");

						targetHeight = navHeight-subHeight;
									
						// this.el_nav.style.height = targetHeight+"px";
						// this.el_target[key].el.style.transform = "translateY(0px)";
						sub.style.transform = "translateY(0px)";
						this.el_cover.style.bottom = "0%"
						if (!isNaN(bodyPadding)) {
							this.el_body.style.paddingTop = (bodyPadding-subHeight)+"px";
						} else {
							this.el_body.style.paddingTop = "0px";
						}

					} else {

						this.el_filter_current = this.el_target[key].el.querySelector(".w--current");
						if (this.el_filter_current!==null) {
							this.el_filter_current.classList.remove("w--current");
						}
						trig.classList.add("w--current");


						targetHeight = navHeight+subHeight;
									
						// this.el_nav.style.height = targetHeight+"px";
						// this.el_target[key].el.style.transform = "translateY(-"+subHeight+"px)";
						sub.style.transform = "translateY("+subHeight+"px)";
						this.el_cover.style.bottom = "-"+subHeight+"px"
						if (!isNaN(bodyPadding)) {
							this.el_body.style.paddingTop = (bodyPadding+subHeight)+"px";
						} else {
							this.el_body.style.paddingTop = "0px";
						}

					}
				}
			},
			setIxTargetSubState: function(key, state, opt_ini) {
				var sub = this.el_target[key].sub
				if (sub !== null) {
					var targetHeight, navHeight, subHeight;
					switch (state) {
						case "n":
							// sub.style.bottom = "100%";
							break
						case "t":
							if (this.ix_running === false ) {								
								
								//console.warn("sub parent",this.el_target[key]);

								if (this.el_target[key].sub_state === 'v') return;
								//console.warn("sub parent",this.el_target[key]);

								this.ix_running = true;
								


								subHeight = sub.offsetHeight;
								navHeight = this.el_nav.offsetHeight;
								bodyPadding = parseInt(window.getComputedStyle(this.el_body, null).getPropertyValue('padding-top').replace("px",""));

								if (this.el_target[key].sub_show === true) {

									// this.el_target[key].sub_show = false;

									// targetHeight = navHeight-subHeight;
									
									// // this.el_nav.style.height = targetHeight+"px";
									// // this.el_target[key].el.style.transform = "translateY(0px)";
									// sub.style.transform = "translateY(0px)";
									// if (!isNaN(bodyPadding)) {
									// 	this.el_body.style.paddingTop = (bodyPadding-subHeight)+"px";
									// } else {
									// 	this.el_body.style.paddingTop = "0px";
									// }

									this.toggleSubForce(key,false)

									setTimeout(function() {
										this.ix_running = false;
									}.bind(this),300);


								} else {
									
											
							
									// this.el_target[key].sub_show = true;	
									
									

									// //console.log("bodyPadding", bodyPadding);

									// targetHeight = navHeight+subHeight;
									
									// // this.el_nav.style.height = targetHeight+"px";
									// // this.el_target[key].el.style.transform = "translateY(-"+subHeight+"px)";
									// sub.style.transform = "translateY("+subHeight+"px)";
									// if (!isNaN(bodyPadding)) {
									// 	this.el_body.style.paddingTop = (bodyPadding+subHeight)+"px";
									// } else {
									// 	this.el_body.style.paddingTop = "0px";
									// }

									this.toggleSubForce(key,true)

									setTimeout(function() {
										this.ix_running = false;
									}.bind(this),300);

									/*
									subHeight = sub.offsetHeight;
									navHeight = this.el_nav.offsetHeight;		

									// sub.style.bottom = subHeight+"px";					
									sub.style.zIndex = -1;

									// this.el_target[key].sub_state = state;

									// return;

									
									this.el_target[key].el.style.bottom = "0%";			
									//this.el_target[key].el.style.transform = "translateY("+subHeight+"px)";

									
									bodyPadding = parseInt(window.getComputedStyle(this.el_body, null).getPropertyValue('padding-top').replace("px",""));

									//console.log("bodyPadding", bodyPadding);

									targetHeight = navHeight-subHeight;
									
									this.el_nav.style.height = targetHeight+"px";								
									if (!isNaN(bodyPadding)) {
										this.el_body.style.paddingTop = (bodyPadding-subHeight)+"px";
									} else {
										this.el_body.style.paddingTop = "0px";
									}
									// this.el_target[key].el.style.transform = "translateY("+subHeight+"px)";
									// sub.style.transform = "translateY(-"+subHeight+"px)";
									setTimeout(function() {
										this.ix_running = false;
									}.bind(this),300);
									*/

								}
							}
							break;
						case "h":
							if (this.ix_running === false ) {								
								this.ix_running = true;
								this.el_target[key].sub_state = state;
								sub.style.bottom = "0%";
								subHeight = sub.offsetHeight;
								navHeight = this.el_nav.offsetHeight;							
								
								bodyPadding = parseInt(window.getComputedStyle(this.el_body, null).getPropertyValue('padding-top').replace("px",""));

								//console.log("bodyPadding", bodyPadding);

								targetHeight = navHeight-subHeight;
								
								this.el_nav.style.height = targetHeight+"px";								
								if (!isNaN(bodyPadding)) {
									this.el_body.style.paddingTop = (bodyPadding-subHeight)+"px";
								} else {
									this.el_body.style.paddingTop = "0px";
								}
								setTimeout(function() {
									this.ix_running = false;
								}.bind(this),300);
							}
							break;
						case "v":
							
							// this.ix_running = true;
							
							if (opt_ini) {
								
								// this.el_target[key].sub_state = 'h';
								// sub.style.bottom = "0%";
								// this.ixTrigger(null, "shop");

								this.el_target[key].sub_state = 'h';
								// sub.style.bottom = "0%";
								this.ixTrigger(null, "shop");

								
							} else {
								this.el_target[key].sub_state = state;
								sub.style.bottom = "0%";
								subHeight = sub.offsetHeight;
								navHeight = this.el_nav.offsetHeight;							
								targetHeight = subHeight+navHeight;
								this.el_nav.style.height = targetHeight+"px";								
								this.el_body.style.paddingTop = subHeight+"px";
							}							

							// if (this.ix_running === false ) {
							// 	this.ix_running = true;
							// 	this.el_target[key].sub_state = state;
							// 	sub.style.bottom = "0%";
							// 	subHeight = sub.offsetHeight;
							// 	navHeight = this.el_nav.offsetHeight;							
							// 	targetHeight = subHeight+navHeight;
							// 	this.el_nav.style.height = targetHeight+"px";								
							// 	this.el_body.style.paddingTop = subHeight+"px";
							// 	setTimeout(function() {
							// 		this.ix_running = false;
							// 	}.bind(this),300);
							// }
							break;						
					}
				}

			},
			ixTriggerClose: function(opt_skip) {

				// get target states
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open || false,
				// 	magazine: this.el_target['magazine'].open || false,
				// 	shop: this.el_target['shop'].open || false
				// }
				var trigger, height;

				// n-states
					
					trigger = this.getOpenKey();
					if (trigger!==null) {
						

						height = this.el_nav.offsetHeight;
						height-= this.el_target[trigger].el.offsetHeight;
						//this.el_nav.style.height = height+"px";

						// OLD
							// this.el_body.style.paddingTop = "initial";
						// NEW
							var sub = this.getOpenSub();
							// console.log("sub",sub, trigger);
							if (sub.key === trigger) {
								if (sub.el !== null && sub.state !== "n") {	
									this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
								} else {								
									this.el_body.style.paddingTop = "initial";
								}
							} else {
								return;
								// if (sub.el !== null && sub.state === "n") {	
								// 	console.warn("restore sub");
								// 	this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
								// 	sub.el.style.bottom = "0%";
								// 	//height+=sub.el.offsetHeight;
								// 	height-= this.el_target[trigger].el.offsetHeight;
								// 	this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
								// 	this.el_target[trigger].sub_state = 'v';						
								// } else {								
								// 	this.el_body.style.paddingTop = "initial";
								// 	this.el_target[trigger].el.style.bottom = "100%";
								// 	height-= this.el_target[trigger].el.offsetHeight;
								// }
							}
							// var sub = this.getOpenSub();
							// if (sub.el !== null && sub.state !== "n") {	
							// 	this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
							// } else {								
							// 	this.el_body.style.paddingTop = "initial";
							// }
						
						this.el_nav.style.height = height+"px";

						this.el_target[trigger].nav.style.opacity = 0;
						// var open = this.getOpenKey();					
						this.el_target[trigger].open = false;
						// switch(trigger) {
						// 	case "magazine":
						// 		if (this.el_target[trigger].nav.querySelector(".w--current")===null && this.route_mag === false) {
						// 			this.el_trigs[trigger].classList.remove("is--hover");
						// 		}
						// 		break;
						// 	case "shop":
						// 		if (this.el_target[trigger].nav.querySelector(".w--current")===null && this.route_shop === false) {
						// 			this.el_trigs[trigger].classList.remove("is--hover");
						// 		}
						// 		break;
						// 	default:
						// 		if (this.el_target[trigger].nav.querySelector(".w--current")===null) {
						// 			this.el_trigs[trigger].classList.remove("is--hover");
						// 		}
						// 		break;
						// }
						
						// if (this.el_target[open].nav.querySelector(".w--current")===null) {
							this.el_trigs[trigger].classList.remove("is--hover");
						// }
						var state = this.getStates();
						for (var c in state) {
							//if (c !== trigger) {
								switch(c) {

									case "magazine":
										if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_mag === true) {
											this.el_trigs[c].classList.add("is--hover");
										}
										break;
									case "shop":
										if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_shop === true) {
											this.el_trigs[c].classList.add("is--hover");
										}
										break;
									default:
										if (this.el_target[c].nav.querySelector(".w--current")!==null) {
											this.el_trigs[c].classList.add("is--hover");
										}
										break;
								}
							//}
						}
						

						if (opt_skip) {
							// console.log("skip");
							return;
						}
						setTimeout(function(){									
							this.ix_running = false;									
							// OLD
								// this.el_nav.style.height = "auto";
							// NEW
								var sub = this.getOpenSub();
								if (sub.el !== null && sub.state !== "n") {	
									//this.el_nav.style.height = "auto";
									this.el_nav.style.height = "auto";
									this.el_body.style.paddingTop = "initial";
									this.setIxTargetSubState(sub.key, sub.state);
								} else {
									this.el_nav.style.height = "auto";
									this.el_body.style.paddingTop = "initial";
								}

							this.el_target[trigger].el.style.bottom = "100%";
						}.bind(this),300);
					} else {	

						var sub = this.getOpenSub();

						if (sub.el !== null && sub.state !== "n") {	

							// RESET ???
							this.el_nav.style.height = "auto";
							this.el_body.style.paddingTop = "initial";
							this.setIxTargetSubState(sub.key, sub.state);
							

							// this.el_target[sub.key].sub_state = "h";
														
							// var navHeight = this.el_nav.offsetHeight; 
							// var subHeight = sub.el.offsetHeight;

							// console.warn("navHeight", navHeight);
							// console.warn("subHeight", subHeight);

							
							// var targetHeight = navHeight-subHeight;
							// this.el_nav.style.height = targetHeight+"px";								
							// this.el_body.style.paddingTop = subHeight+"px";
							// // this.el_body.style.paddingTop = "initial";								
							// // 	this.ix_running = false;
							// // 	this.el_nav.style.height = "auto";
							// setTimeout(function(){
							// 	console.warn("reopen");
							// 	this.setIxTargetSubState(sub.key, sub.state);
							// 	setTimeout(function(){
							// 		this.el_target[sub.key].sub_state = "v";
							// 	}.bind(this),300);		
							// }.bind(this),300);

						} else {

							this.el_body.style.paddingTop = "initial";								
							this.ix_running = false;
							this.el_nav.style.height = "auto";
						}
					}

				// 2-states - DEPRECATED
					// if (state.agency===true) {
					// 	trigger = "agency";
					// 	height = this.el_nav.offsetHeight;
					// 	height-= this.el_target[trigger].el.offsetHeight;
					// 	this.el_nav.style.height = height+"px";
					// 	this.el_body.style.paddingTop = "initial";
					// 	this.el_target[trigger].nav.style.opacity = 0;
					// 	this.el_target[trigger].open = false;
					// 	if (this.el_target[trigger].nav.querySelector(".w--current")===null) {
					// 		this.el_trigs[trigger].classList.remove("is--hover");
					// 	}					
					// 	setTimeout(function(){									
					// 		this.ix_running = false;									
					// 		this.el_nav.style.height = "auto";
					// 		this.el_target[trigger].el.style.bottom = "100%";
					// 	}.bind(this),300);
					// } else if (state.magazine===true) {
					// 	trigger = "magazine";
					// 	height = this.el_nav.offsetHeight;
					// 	height-= this.el_target[trigger].el.offsetHeight;
					// 	this.el_nav.style.height = height+"px";
					// 	this.el_body.style.paddingTop = "initial";
					// 	this.el_target[trigger].nav.style.opacity = 0;
					// 	this.el_target[trigger].open = false;
					// 	if (this.el_target[trigger].nav.querySelector(".w--current")===null && this.route_mag === false) {
					// 		this.el_trigs[trigger].classList.remove("is--hover");
					// 	}
					// 	setTimeout(function(){									
					// 		this.ix_running = false;									
					// 		this.el_nav.style.height = "auto";
					// 		this.el_target[trigger].el.style.bottom = "100%";
					// 	}.bind(this),300);
					// }
			},
			ixTrigger: function(opt_e,opt_id) {		
				if (this.ix_running === true) { return false; }
				this.ix_running = true;
				var trigger;
				if (opt_e === null) {	
					trigger = opt_id;
				} else {
					opt_e.preventDefault();
					opt_e.stopPropagation();
					trigger = opt_e.currentTarget.getAttribute('data-ix-trigger');
					
				} 
				// console.warn("trigger", trigger);
				var height = this.el_nav.offsetHeight;
				this.el_nav.style.height = height+"px";
				// get target states
				var state = this.getStates();
				// {
				// 	agency: this.el_target['agency'].open || false,
				// 	magazine: this.el_target['magazine'].open || false,
				// 	shop: this.el_target['shop'].open || false
				// }
				// select action
				

				// n-states
				
					// Check if others are open
					var others_closed = this.getOthersState(trigger, false);
					//console.warn("others_closed", others_closed);
					var self_open = this.getSelfState(trigger, true);
					//console.warn("self_open", self_open);
					

					if (others_closed===true) {
						// open closed
						if (self_open===true) {
							// close this
							// console.log("close this");
							height-= this.el_target[trigger].el.offsetHeight;
							//this.el_nav.style.height = height+"px";
							// OLD								
								//this.el_body.style.paddingTop = "initial";
							// NEW
								var sub = this.getOpenSub();
								// console.log("close sub", sub);
								if (sub.el!==null && sub.key === trigger && sub.target === true) {
									if (sub.el !== null && sub.state !== "n") {	
										this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
									// } else if (sub.el !== null && sub.show === true) {	
									// 	this.toggleSubForce(sub.key, false);
									} else {
										this.el_body.style.paddingTop = "initial";
									}
								} else {

									if (sub.el !== null  && sub.target === false && sub.show === true) {											
										this.toggleSubForce(sub.key, false);
										this.el_body.style.paddingTop = "initial";
									} else {
										this.el_body.style.paddingTop = "initial";
									}

								}

								this.el_nav.style.height = height+"px";

								// var sub = this.getOpenSub();
								// console.log("close sub", sub);
								// if (sub.el !== null && sub.state !== "n") {	
								// 	this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
								// } else if (sub.el !== null && sub.show === true) {	
								// 	this.toggleSubForce(sub.key, false);
								// } else {
								// 	this.el_body.style.paddingTop = "initial";
								// }


							this.el_target[trigger].nav.style.opacity = 0;
							this.el_target[trigger].open = false;
							//if (this.el_target[trigger].nav.querySelector(".w--current")===null) {
								this.el_trigs[trigger].classList.remove("is--hover");
							//}
							setTimeout(function(){									
								this.ix_running = false;									
								
								// OLD
									// this.el_nav.style.height = "auto";
								// NEW
									var sub = this.getOpenSub();
									if (sub.el !== null && sub.state !== "n") {	
										//this.el_nav.style.height = (this.el_nav.offsetHeight - sub.el.offsetHeight) + "px";										
									} else {
										this.el_nav.style.height = "auto";
									}

								this.el_target[trigger].el.style.bottom = "100%";
								// re-select w--current
								if (this.el_target[trigger].nav.querySelector(".w--current")!==null) {
									this.el_trigs[trigger].classList.add("is--hover");
								}
								for (var c in state) {
									//if (c !== trigger) {
										switch(c) {

											case "magazine":
												if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_mag === true) {
													this.el_trigs[c].classList.add("is--hover");
												}
												break;
											case "shop":
												if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_shop === true) {
													this.el_trigs[c].classList.add("is--hover");
												}
												break;
											default:
												if (this.el_target[c].nav.querySelector(".w--current")!==null) {
													this.el_trigs[c].classList.add("is--hover");
												}
												break;
										}
									//}
								}
								//document.body.focus();
							}.bind(this),300);								
						} else {
							// open this
							// console.log("open this",  this.el_target[trigger]);
							for (var c in state) {
								if (c !== trigger) {
									this.el_target[c].el.style.bottom = "100%";
								}
							}
							height+= this.el_target[trigger].el.offsetHeight;

							// OLD
								// this.el_target[trigger].el.style.bottom = "0%";
							// NEW
								var sub = this.getOpenSub();
								// NEW
								if (sub.el !== null) {
									if (sub.key === trigger && sub.target === true) {
										// console.log(sub);
										if (sub.state === "n") {
											height+=sub.el.offsetHeight;
											this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
											sub.el.style.bottom = "0%";
											this.el_target[sub.key].sub_state = "v";
										}
									} else {
										// console.warn("fix", sub);
										if (sub.state === 'v') {
											height-=sub.el.offsetHeight;
											this.el_target[trigger].el.style.bottom = "0%";
											sub.el.style.bottom = "0%";
											this.el_target[sub.key].sub_state = "n";
										} else  {
											this.el_target[trigger].el.style.bottom = "0%";
											sub.el.style.bottom = "0%";
										}
									}
								}
								sub = this.getOpenSub();
								// OLD
								if (sub.el !== null && sub.state !== "n") {																	
									this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
									if (sub.state === "h") {
										height+=sub.el.offsetHeight;										
										this.el_target[sub.key].sub_state = "v";
									}
									// if (sub.el !== null && sub.state !== "n") {	
									// 			this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
									// 		} else {								
									// 			this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
									// 			height+=sub.el.offsetHeight;
									// 		}
									// 		this.el_target[sub.key].sub_state = 'v';

								// } else if (sub.el !== null && sub.state === "n" && sub.target === false) {
								// 		this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
								// 		height+=sub.el.offsetHeight;
								// 		sub.el.style.bottom = "0%";
								// } else if (sub.target === false) {								
								// 	this.el_target[trigger].el.style.bottom = "0%";
								// 	this.toggleSubForce(sub.key,true)
								// 	sub.el.style.bottom = sub.el.offsetHeight+"px";
								}


							this.el_nav.style.height = height+"px";

							

							// OLD
								// this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
							// NEW
								if (sub.el !== null && sub.state !== "n") {	
									this.el_body.style.paddingTop = (this.el_target[trigger].el.offsetHeight+sub.el.offsetHeight)+"px";
								} else {
									this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
								}

							this.el_target[trigger].nav.style.opacity = 1;
							this.el_target[trigger].open = true;								
							this.el_trigs[trigger].classList.add("is--hover");								
							for (var c in state) {
								if (c !== trigger) {
									this.el_trigs[c].classList.remove("is--hover");
								}
							}
							setTimeout(function(){
								this.ix_running = false;
							}.bind(this),300);
						}
					} else {
						// other open
						if (self_open===true) {
							// close other - shouldn't happen
							// console.log("close other - shouldn't happen");
							var otherOpenKey = this.getOtherOpenKey(trigger);
							if (otherOpenKey!==null) {
								height-= this.el_target[otherOpenKey].el.offsetHeight;
								this.el_nav.style.height = height+"px";
								
								// OLD
									// this.el_body.style.paddingTop = "initial";
								// NEW
									var sub = this.getOpenSub();
									if (sub.el !== null && sub.state !== "n") {	
										this.el_body.style.paddingTop = sub.el.offsetHeight+"px";	
									// } else if (sub.el !== null && sub.show === true) {	
									// 	console.warn("close sub for other");
									// 	this.toggleSubForce(sub.key, false);								
									} else {
										this.el_body.style.paddingTop = "initial";
									}


								this.el_target[otherOpenKey].nav.style.opacity = 1;
								this.el_target[otherOpenKey].open = false;
								//if (this.el_target['magazine'].nav.querySelector(".w--current")===null) {
									this.el_trigs[otherOpenKey].classList.remove("is--hover");
								//}
								setTimeout(function(){
									this.ix_running = false;									
									this.el_target[otherOpenKey].el.style.bottom = "100%";
									// re-select w--current
									if (this.el_target[trigger].nav.querySelector(".w--current")!==null) {
										this.el_trigs[trigger].classList.add("is--hover");
									}
									for (var c in state) {
										if (c !== trigger) {
											switch(c) {

												case "magazine":
													if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_mag === true) {
														this.el_trigs[c].classList.add("is--hover");
													}
													break;
												case "shop":
													if (this.el_target[c].nav.querySelector(".w--current")!==null || this.route_shop === true) {
														this.el_trigs[c].classList.add("is--hover");
													}
													break;
												default:
													if (this.el_target[c].nav.querySelector(".w--current")!==null) {
														this.el_trigs[c].classList.add("is--hover");
													}
													break;
											}
										}
									}
								}.bind(this),300);
							}
						} else {
							// swap this
							// console.log("swap this");
							var otherOpenKey = this.getOtherOpenKey(trigger);
							if (otherOpenKey!==null) {
								// this.el_nav.style.height = (height-this.el_target['magazine'].offsetHeight)+"px";
								height-= this.el_target[otherOpenKey].el.offsetHeight;								
								
								
								// OLD
									//this.el_body.style.paddingTop = "initial";
								// NEW
									var sub = this.getOpenSub();
									// console.log("swap",sub,trigger);
									// NEW
										if (sub.el!== null && sub.key === trigger && sub.target === true) {
											if (sub.el !== null && sub.state !== "n") {	
											this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
											// } else if (sub.el !== null && sub.show === true) {
											// 	// console.log("?");
											// 	this.toggleSubForce(sub.key, false);
											} else {
												this.el_body.style.paddingTop = "initial";
											}
											sub.el.style.bottom ="0%";
										} else {
											// console.warn("remove sub");
											if (sub.el!==null && sub.target === true) {
												sub.el.style.bottom = sub.el.offsetHeight+"px";
												// height-=sub.el.offsetHeight;
											} else if (sub.el !== null && sub.show === true && sub.target === false) {
												// console.log("?");
												this.toggleSubForce(sub.key, false);
											}
											

											this.el_body.style.paddingTop = "initial";
										}
										this.el_nav.style.height = height+"px";

									// OLD
										// if (sub.el !== null && sub.state !== "n") {	
										// 	this.el_body.style.paddingTop = sub.el.offsetHeight+"px";
										// } else if (sub.el !== null && sub.show === true) {
										// 	this.toggleSubForce(sub.key, false);
										// } else {
										// 	this.el_body.style.paddingTop = "initial";
										// }

								
								this.el_target[otherOpenKey].nav.style.opacity = 0;
								this.el_target[otherOpenKey].open = false;
								//if (this.el_target['magazine'].nav.querySelector(".w--current")===null) {
									this.el_trigs[otherOpenKey].classList.remove("is--hover");
								//}
								setTimeout(function(){									
									this.el_target[otherOpenKey].el.style.bottom = "100%";
									height+= this.el_target[trigger].el.offsetHeight;
									
									// NEW
										var sub = this.getOpenSub();
										if (sub.el!== null && sub.key === trigger && sub.target === true) {
											
											if (sub.el !== null && sub.state !== "n") {	
												this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
											} else {								
												this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
												height+=sub.el.offsetHeight;
											}
											this.el_target[sub.key].sub_state = 'v';
										} else {
											// console.warn("remove sub", this.el_target[sub.key]);
											this.el_target[trigger].el.style.bottom = "0%";
											if (this.el_target[sub.key].sub_state === 'v') {
												height-=sub.el.offsetHeight;
												this.el_target[sub.key].sub_state = 'n';
											}
										}
									// OLD
										// var sub = this.getOpenSub();
										// if (sub.el !== null && sub.state !== "n") {	
										// 	this.el_target[trigger].el.style.bottom = sub.el.offsetHeight+"px";
										// } else {								
										// 	this.el_target[trigger].el.style.bottom = "0%";
										// }
									
									
									this.el_nav.style.height = height+"px";
									

									// NEW
										sub = this.getOpenSub();
										// if (sub.el!== null && sub.key === trigger) {
										// 	if (sub.el !== null && sub.state !== "n") {	
										// 		this.el_body.style.paddingTop = (this.el_target[trigger].el.offsetHeight+sub.el.offsetHeight)+"px";
										// 	} else {
										// 		this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
										// 	}
										// } else {
										// 	if (this.el_target[sub.key].sub_state === 'v') {
										// 		height-=sub.el.offsetHeight;
										// 		this.el_target[sub.key].sub_state = 'n';
										// 	}
										// }
									// OLD
										if (sub.el !== null && sub.state !== "n") {	
											this.el_body.style.paddingTop = (this.el_target[trigger].el.offsetHeight+sub.el.offsetHeight)+"px";
										} else {
											this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
										}

									this.el_target[trigger].nav.style.opacity = 1;
									this.el_target[trigger].open = true;
									this.el_trigs[trigger].classList.add("is--hover");
									setTimeout(function(){
										this.ix_running = false;										
									}.bind(this),300);
								}.bind(this),300);
							}
						}
					}

				// 2-state - DEPRECATED
				
					// switch (trigger) {
					// 	case "agency":
					// 		if (state.magazine===false) {
					// 			// open closed
					// 			if (state.agency===true) {
					// 				// close this
					// 				height-= this.el_target[trigger].el.offsetHeight;
					// 				this.el_nav.style.height = height+"px";								
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target[trigger].nav.style.opacity = 0;
					// 				this.el_target[trigger].open = false;
					// 				//if (this.el_target[trigger].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs[trigger].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){									
					// 					this.ix_running = false;									
					// 					this.el_nav.style.height = "auto";
					// 					this.el_target[trigger].el.style.bottom = "100%";
					// 					// re-select w--current
					// 					if (this.el_target["agency"].nav.querySelector(".w--current")!==null) {
					// 						this.el_trigs['agency'].classList.add("is--hover");
					// 					}
					// 					if (this.el_target["magazine"].nav.querySelector(".w--current")!==null || this.route_mag === true) {
					// 						this.el_trigs['magazine'].classList.add("is--hover");
					// 					}
					// 					//document.body.focus();
					// 				}.bind(this),300);								
					// 			} else {
					// 				// open this								
					// 				this.el_target['magazine'].el.style.bottom = "100%";
					// 				height+= this.el_target[trigger].el.offsetHeight;
					// 				this.el_target[trigger].el.style.bottom = "0%";
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
					// 				this.el_target[trigger].nav.style.opacity = 1;
					// 				this.el_target[trigger].open = true;								
					// 				this.el_trigs[trigger].classList.add("is--hover");
					// 				this.el_trigs['magazine'].classList.remove("is--hover");
					// 				setTimeout(function(){
					// 					this.ix_running = false;
					// 				}.bind(this),300);
					// 			}
					// 		} else {
					// 			// other open
					// 			if (state.agency===true) {
					// 				// close other - shouldn't happen
					// 				height-= this.el_target['magazine'].el.offsetHeight;
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target['magazine'].nav.style.opacity = 1;
					// 				this.el_target['magazine'].open = false;
					// 				//if (this.el_target['magazine'].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs['magazine'].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){
					// 					this.ix_running = false;									
					// 					this.el_target['magazine'].el.style.bottom = "100%";
					// 					// re-select w--current
					// 					if (this.el_target["agency"].nav.querySelector(".w--current")!==null) {
					// 						this.el_trigs['agency'].classList.add("is--hover");
					// 					}
					// 					if (this.el_target["magazine"].nav.querySelector(".w--current")!==null || this.route_mag === true) {
					// 						this.el_trigs['magazine'].classList.add("is--hover");
					// 					}
					// 				}.bind(this),300);
					// 			} else {
					// 				// swap this
					// 				// this.el_nav.style.height = (height-this.el_target['magazine'].offsetHeight)+"px";
					// 				height-= this.el_target['magazine'].el.offsetHeight;								
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target['magazine'].nav.style.opacity = 0;
					// 				this.el_target['magazine'].open = false;
					// 				//if (this.el_target['magazine'].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs['magazine'].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){									
					// 					this.el_target['magazine'].el.style.bottom = "100%";
					// 					height+= this.el_target[trigger].el.offsetHeight;
					// 					this.el_target[trigger].el.style.bottom = "0%";
					// 					this.el_nav.style.height = height+"px";
					// 					this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
					// 					this.el_target[trigger].nav.style.opacity = 1;
					// 					this.el_target[trigger].open = true;
					// 					this.el_trigs[trigger].classList.add("is--hover");
					// 					setTimeout(function(){
					// 						this.ix_running = false;										
					// 					}.bind(this),300);
					// 				}.bind(this),300);
					// 			}
					// 		}
					// 	break;
					// 	case "magazine":
					// 		if (state.agency===false) {
					// 			// open closed
					// 			if (state.magazine===true) {
					// 				// close this
					// 				height-= this.el_target[trigger].el.offsetHeight;
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target[trigger].nav.style.opacity = 0;
					// 				this.el_target[trigger].open = false;
					// 				//if (this.el_target[trigger].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs[trigger].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){
					// 					this.ix_running = false;									
					// 					this.el_nav.style.height = "auto";
					// 					this.el_target[trigger].el.style.bottom = "100%";
					// 					// re-select w--current
					// 					if (this.el_target["agency"].nav.querySelector(".w--current")!==null) {
					// 						this.el_trigs['agency'].classList.add("is--hover");
					// 					}
					// 					if (this.el_target["magazine"].nav.querySelector(".w--current")!==null || this.route_mag === true) {
					// 						this.el_trigs['magazine'].classList.add("is--hover");
					// 					}
					// 					// document.body.focus();
					// 				}.bind(this),300);
					// 			} else {
					// 				// open this								
					// 				this.el_target['agency'].el.style.bottom = "100%";
					// 				height+= this.el_target[trigger].el.offsetHeight;
					// 				this.el_target[trigger].el.style.bottom = "0%";
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
					// 				this.el_target[trigger].nav.style.opacity = 1;
					// 				this.el_target[trigger].open = true;
					// 				this.el_trigs[trigger].classList.add("is--hover");
					// 				this.el_trigs['agency'].classList.remove("is--hover");
					// 				setTimeout(function(){
					// 					this.ix_running = false;									
					// 				}.bind(this),300);
					// 			}
					// 		} else {
					// 			// other open
					// 			if (state.magazine===true) {
					// 				// close other - shouldn't happen
					// 				height-= this.el_target['agency'].el.offsetHeight;								
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target['agency'].open = false;
					// 				//if (this.el_target['agency'].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs['agency'].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){
					// 					this.ix_running = false;									
					// 					this.el_target['agency'].el.style.bottom = "100%";
					// 					// re-select w--current
					// 					if (this.el_target["agency"].nav.querySelector(".w--current")!==null) {
					// 						this.el_trigs['agency'].classList.add("is--hover");
					// 					}
					// 					if (this.el_target["magazine"].nav.querySelector(".w--current")!==null || this.route_mag === true) {
					// 						this.el_trigs['magazine'].classList.add("is--hover");
					// 					}
					// 				}.bind(this),300);
					// 			} else {
					// 				// swap this
					// 				//this.el_nav.style.height = (height-this.el_target['agency'].offsetHeight)+"px";
					// 				height-= this.el_target['agency'].el.offsetHeight;
					// 				this.el_nav.style.height = height+"px";
					// 				this.el_body.style.paddingTop = "initial";
					// 				this.el_target['agency'].nav.style.opacity = 0;
					// 				this.el_target['agency'].open = false;
					// 				//if (this.el_target['agency'].nav.querySelector(".w--current")===null) {
					// 					this.el_trigs['agency'].classList.remove("is--hover");
					// 				//}
					// 				setTimeout(function(){									
					// 					this.el_target['agency'].el.style.bottom = "100%";
					// 					height+= this.el_target[trigger].el.offsetHeight;
					// 					this.el_target[trigger].el.style.bottom = "0%";
					// 					this.el_nav.style.height = height+"px";
					// 					this.el_body.style.paddingTop = this.el_target[trigger].el.offsetHeight+"px";
					// 					this.el_target[trigger].nav.style.opacity = 1;
					// 					this.el_target[trigger].open = true;
					// 					this.el_trigs[trigger].classList.add("is--hover");
					// 					setTimeout(function(){
					// 						this.ix_running = false;										
					// 					}.bind(this),300);
					// 				}.bind(this),300);
					// 			}
					// 		}
					// 	break;

					// }
			}
		}

	// DOM callback
		function domCallback(e) {
			if (e.type==="DOMContentLoaded") {
				// dom ready
				this.init('main');
			} else if (e.target.readyState === "complete") {
				// content loaded
			}
		}

	// DOM Listeners
		(function(exports, d) {
		  function domReady(fn, context) {    
		    function onReady(event) {
		      	d.removeEventListener("DOMContentLoaded", onReady);      	
				function onLoaded(event) {
					d.removeEventListener("readystatechange", onReady);
					setTimeout(function(){
			      		fn.call(context || exports, event);
			      	}, 1);
				}
		      	d.addEventListener("readystatechange", onLoaded);
		      	setTimeout(function(){
		      		fn.call(context || exports, event);
		      	}, 1);
		     
		    }
		    function onReadyIe(event) {
		      if (d.readyState === "complete") {
		        d.detachEvent("onreadystatechange", onReadyIe);
		        setTimeout(function(){
		      		fn.call(context || exports, event);
		      	}, 1);
		      }
		    }
		    d.addEventListener && d.addEventListener("DOMContentLoaded", onReady) ||
		    d.attachEvent      && d.attachEvent("onreadystatechange", onReadyIe);
		  }
		  exports.domReady = domReady;
		})(window, document);
	
	// DOM Wait
		window.domReady(domCallback,domUpdates);

})();
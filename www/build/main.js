webpackJsonp([6],{

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ListPage = /** @class */ (function () {
    function ListPage(afAuth, navCtrl, navParams, af) {
        var _this = this;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        //use key to access correct queue
        this.partyKey = sessionStorage["partyCookie"];
        this.afAuth.authState.subscribe(function (auth) {
            _this.af.object("users/" + auth.uid).take(1).subscribe(function (data) {
                _this.username = data.username;
                _this.user_likes = af.list("/" + _this.partyKey + "/userlist/" + data.username + "/likes");
                _this.user_dislikes = af.list("/" + _this.partyKey + "/userlist/" + data.username + "/dislikes");
            });
        });
        //get key returned from join party page
        this.key = this.navParams.get("hostKey");
        //console.log(this.partyKey);
        this.songs = af.list("/" + this.partyKey + "/songlist");
        this.owner = af.object("/" + this.partyKey);
        this.owner.subscribe(function (snapshot) { return (_this.host = snapshot.owner); });
        this.songs = af.list("/" + this.partyKey + "/songlist", {
            //toString(parseInt('likes') - parseInt('dislikes'))
            query: {
                //orderByChild: toString( (parseInt('likes') - parseInt('dislikes'))  ,
                orderByChild: "likes",
                limitToLast: 10
            }
        });
    }
    ListPage.prototype.like = function (song) {
        var temp = [];
        var check = false;
        this.likeCheck = this.af.list("/" + this.partyKey + "/userlist/" + this.username + "/likes");
        this.likeCheck.subscribe(function (data) {
            data.forEach(function (item) {
                // console.log(item.song)
                temp.push(item.song);
            });
            // if (exists == -1 || exists == 0) {
            //   this.user_likes.push({song: song.$key});
            //   this.songs.update(song.$key, { likes: song.likes + 1 });
            // }
            // } else if (exists == 0) {
            //     console.log("gettinghere")
            //       this.user_likes.push({song: song.$key});
            //       this.songs.update(song.$key, { likes: song.likes + 1 });
            // }
        });
        //console.log(temp)
        var check = false;
        if (temp.length == 0) {
            this.user_likes.push({ song: song.$key });
            this.songs.update(song.$key, { likes: song.likes + 1 });
            check = true;
        }
        else {
            for (var i = 0; i < temp.length; i++) {
                console.log("checking songs");
                if (temp[i] == song.$key) {
                    check = true;
                    break;
                }
            }
        }
        if (check == false) {
            this.user_likes.push({ song: song.$key });
            this.songs.update(song.$key, { likes: song.likes + 1 });
        }
    };
    ListPage.prototype.dislike = function (song) {
        this.user_dislikes.push({ song: song.$key });
        this.songs.update(song.$key, { likes: song.likes - 1 });
        //sleep(5);
    };
    ListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: "page-list",template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/list/list.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{host}}\'s Party</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h2 text-center>Party Key: {{ partyKey }}</h2>\n  <ion-list>\n    <ion-item clear ion-item *ngFor= "let song of (songs | async)?.slice().reverse()" >\n    <ion-thumbnail item-start>\n      <img src= "{{song.img}}">\n    </ion-thumbnail>\n    <h2> {{ song.title }} </h2>\n    <p> {{ song.artist }}</p>\n     <p> {{ song.likes }}</p>\n      <p> {{ song.dislikes }}</p>\n    <button ion-button clear item-end (click)=dislike(song)>\n   <ion-icon ios="ios-thumbs-down" md="md-thumbs-down" ></ion-icon>\n    </button>\n\n    <button ion-button clear item-end (click)=like(song)>\n   <ion-icon ios="ios-thumbs-up" md="md-thumbs-up" ></ion-icon>\n    </button>\n     </ion-item>\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/list/list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], ListPage);
    return ListPage;
}());

function sleep(seconds) {
    var e = new Date().getTime() + seconds * 1000;
    while (new Date().getTime() <= e) { }
}
//# sourceMappingURL=list.js.map

/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(afAuth, afDatabase, navCtrl, navParams) {
        this.afAuth = afAuth;
        this.afDatabase = afDatabase;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = {};
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RegisterPage');
    };
    RegisterPage.prototype.register = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user.password != user.verify)) return [3 /*break*/, 1];
                        alert("Passwords don't match");
                        return [3 /*break*/, 4];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)];
                    case 2:
                        result = _a.sent();
                        // console.log(result);
                        if (result) {
                            this.afAuth.authState.take(1).subscribe(function (auth) {
                                _this.afDatabase.list("users/" + auth.uid).set("username", _this.user.username);
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        alert(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/register/register.html"*/'<!--\n  Generated template for the RegisterPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>Register</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <br><br><br><br><br><br><br>\n  <br>\n  <br>\n  <ion-item>\n      <ion-label floating >Username</ion-label>\n      <ion-input type="text" [(ngModel)]="user.username"></ion-input>\n    </ion-item>\n  <ion-item>\n      <ion-label floating >Email</ion-label>\n      <ion-input type="text" [(ngModel)]="user.email"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-label floating>Password</ion-label>\n      <ion-input type="password"[(ngModel)]="user.password"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label floating>Verify Password</ion-label>\n      <ion-input type="password"[(ngModel)]="user.verify"></ion-input>\n    </ion-item>\n\n  <br>\n  <button id="register" ion-button secondary block (click)="register(user)">Register</button>\n\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/register/register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_register__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(afAuth, navCtrl, navParams, platform) {
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.user = {};
        if (platform.is('cordova')) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
    }
    // //use for authentiating with mobile libraries
    // mobileAuth(){
    //   //initializes spotify auth
    //   OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //   //popup for spotify login
    //   //then resets html to wait for auth to complete
    //     //idealy this would be a loading feature to wait until popup closes with success
    //   //on error sends alert  to page for debbuging
    //     OAuth.popup('spotify',{cache: true}).done(function(spotify) {
    //
    //     }).then( this.show()
    //     ).fail(function(err) {
    //       alert("Error with spotify login");
    //     });
    // }
    //
    // //use for authenticating with web libraries
    // webAuth() {
    //   var spotify = OAuthWeb.create('spotify');
    //   if(spotify.access_token){
    //     // console.log(spotify.access_token);
    //     this.show();
    //
    //   } else {
    //   OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //     //popup for spotify login
    //     //then resets html to wait for auth to complete
    //       //idealy this would be a loading feature to wait until popup closes with success
    //     //on error sends alert  to page for debbuging
    //       OAuthWeb.popup('spotify',{cache: true}).done(function(spotify) {
    //       }).then( this.show()
    //       ).fail(function(err) {
    //         alert("Error with spotify login");
    //       });
    //     }
    //
    // }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.register = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__register_register__["a" /* RegisterPage */]);
    };
    LoginPage.prototype.login = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                try {
                    res = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
                    // console.log(res);
                    this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]);
                }
                catch (error) {
                    alert(error);
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    LoginPage.prototype.show = function () {
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("hide").style.visibility = "visible";
    };
    LoginPage.prototype.goHome = function () { this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]); };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/login/login.html"*/'<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>login</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <br><br><br><br><br><br><br>\n  <br>\n  <br>\n  <ion-item>\n      <ion-label floating >Email</ion-label>\n      <ion-input type="text" [(ngModel)]="user.email"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-label floating>Password</ion-label>\n      <ion-input type="password"[(ngModel)]="user.password"></ion-input>\n    </ion-item>\n  <br>\n  <br>\n  <button id="login" ion-button secondary block (click)="login(user)">Login!</button>\n  <button id="register" ion-button secondary block color="light" (click)="register()">Register</button>\n  <div id="hide" style="visibility:hidden;">\n  <br>\n  <br>\n  <button ion-button secondary block (click)="goHome()">Continue!</button>\n</div>\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_oauthio_web__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_oauthio_web___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_oauthio_web__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_oauth_phonegap__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_oauth_phonegap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_oauth_phonegap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__profile_profile__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SearchPage = /** @class */ (function () {
    function SearchPage(platform, navCtrl, navParams, af, afAuth) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.afAuth = afAuth;
        this.afAuth.authState.subscribe(function (auth) {
            _this.af.object("users/" + auth.uid).take(1).subscribe(function (data) {
                _this.user_list = af.list("/" + partyKey + "/userlist/" + data.username + "/likes");
            });
        });
        //checks if device is mobile or Web
        if (platform.is('cordova')) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
        var partyKey = sessionStorage['partyCookie'];
        //console.log(partyKey);
        this.songs = af.list("/" + partyKey + "/songlist");
        //getting spotify api library
        var SpotifyWebApi = __webpack_require__(242);
        //build api with no params
        this.spotifyApi = new SpotifyWebApi();
        //switches Auth method based on if mobile or web
        if (this.isMobile) {
            //is phone
            //gets auth from cache named 'spotify'
            this.spotify = __WEBPACK_IMPORTED_MODULE_3_oauth_phonegap__["OAuth"].create('spotify');
        }
        else {
            //is web
            //gets auth from cache named 'spotify'
            this.spotify = __WEBPACK_IMPORTED_MODULE_2_oauthio_web__["OAuth"].create('spotify');
            console.log("is Web");
        }
        //sets access token of authenticated user
        this.spotifyApi.setAccessToken(this.spotify.access_token);
    }
    SearchPage.prototype.getItems = function (ev, that) {
        document.getElementById("list").style.visibility = "visible";
        //gets the list that displays songs
        var mydiv = document.getElementById('list');
        var temparr = [];
        var songname = [];
        // set val to the value of the searchbar
        var queryTerm = ev.target.value;
        // if the value is an empty string don't filter the items
        if (queryTerm && queryTerm.trim() != '') {
            //search track titles and return top 10 results
            var prev = this.spotifyApi.searchTracks(queryTerm, { limit: 6 })
                .then(function (data, that) {
                //song object for easier calls
                var song = data.body.tracks;
                // clean the promise so it doesn't call abort
                prev = null;
                //for loop that iterates through the 10 songs returned from api
                //sends html for each one to page
                for (var i = 0; i < 6; i++) {
                    //checks if element exists
                    if (!song.items[i]) {
                        continue;
                    }
                    i.toString();
                    //artist name
                    //document.getElementById('artist' + i ).innerHTML = song.items[i].artists['0'].name;
                    var nameartist = song.items[i].artists['0'].name;
                    temparr.push(nameartist);
                    //album cover
                    //document.getElementById('img' + i ).setAttribute('src', song.items[i].album.images[0].url);
                    //song title
                    // if(){
                    //var title = document.getElementById('title' + i );
                    // }
                    //title.innerHTML = song.items[i].name;
                    songname.push(song.items[i].name);
                    //pass track id to page
                    // title.setAttribute("data-songid", song.items[i].id);
                }
                /******************
                Search by songs, no duplicates
                ****************/
                songname = songname.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });
                var ns = songname.length;
                //if no duplicates only 5 songs are shown
                if (ns > 5) {
                    ns = 5;
                }
                for (var i = 0; i < ns; i++) {
                    var title = document.getElementById('title' + i);
                    var ind = i.toString();
                    document.getElementById('artist' + ind).innerHTML = song.items[ind].artists['0'].name;
                    document.getElementById('img' + ind).setAttribute('src', song.items[ind].album.images[0].url);
                    title.innerHTML = songname[i];
                    title.setAttribute("data-songid", song.items[ind].id);
                }
            }, function (err) {
                console.error(err);
            });
            //document.getElementById('Artists').innerHTML='Artists'
            var pre = this.spotifyApi.searchArtists(queryTerm, { limit: 5 })
                .then(function (data, that) {
                var artist = data.body.artists;
                // clean the promise so it doesn't call abort
                pre = null;
                //for loop that iterates through the 10 songs returned from api
                //sends html for each one to page
                for (var index = 0; index < 5; index++) {
                    //checks if element exists
                    if (!artist.items[index]) {
                        continue;
                    }
                    else {
                        var ie = index.toString();
                        var artistn = document.getElementById('artistname' + ie);
                        if (artist.items[index].images[0]) {
                            document.getElementById('imag' + ie).setAttribute('src', artist.items[index].images[0].url);
                            artistn.innerHTML = artist.items[ie].name;
                        }
                        else {
                            document.getElementById('imag' + ie).setAttribute('src', "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw");
                        }
                    }
                }
            }, function (err) {
                console.error(err);
            });
        }
        else {
            /**************
            If search bar is empty, delete elements
            ***************/
            document.getElementById('list').style.visibility = "hidden"; //hide song's list
            for (var i = 0; i < 5; i++) {
                i.toString();
                document.getElementById('title' + i).innerHTML = " ";
                document.getElementById('artist' + i).innerHTML = " ";
                document.getElementById('img' + i).setAttribute('src', " ");
                document.getElementById('artistname' + i).innerHTML = " ";
                document.getElementById('imag' + i).setAttribute('src', " ");
            }
        }
    };
    SearchPage.prototype.ionViewDidLoad = function () {
        if (this.spotify.access_token) {
            //do something here? or dont.
        }
        else {
            alert("You need to sign into Spotify to search!");
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__profile_profile__["a" /* ProfilePage */]);
            /* let searchpage = document.getElementById('searchpage');
            let everything = document.getElementById('everything');
            this.searchbar = everything;
            // let addSpotify = document.getElementById('addSpotify');
            everything.parentNode.removeChild(everything);
            // searchpage.style.backgroundColor = 'grey';
            let img = document.createElement('img');
            img.setAttribute('src','https://static1.squarespace.com/static/551ed270e4b07f2b9a28489c/t/59848e13f7e0ab6f61df1b05/1501859351405/');
            img.style.alignContent = 'center';
            img.style.height = '50px';
            img.style.width = '50px';
            var spotifyauth = this.spotifyLogin.bind(this)
            img.onclick = spotifyauth;
            // img.setAttribute('onclick','this.spotifyLogin()');
            searchpage.replaceChild(img,searchpage.childNodes[0]); */
        }
        console.log('ionViewDidLoad SearchPage');
    };
    SearchPage.prototype.spotifyLogin = function () {
        var searchpage = document.getElementById('searchpage');
        if (this.isMobile == true) {
            //is phone
            this.mobileAuth();
            searchpage.replaceChild(this.searchbar, searchpage.childNodes[0]);
        }
        else {
            //is web
            this.webAuth();
            searchpage.replaceChild(this.searchbar, searchpage.childNodes[0]);
        }
    };
    SearchPage.prototype.itemTapped = function (index) {
        //get songid from song clicked
        var id = document.getElementById('title' + index).getAttribute("data-songid");
        //move songlist to loval variable
        var db = this.songs;
        var ul = this.user_list;
        //call spotify api for song information
        this.spotifyApi.getTrack(id)
            .then(function (data) {
            //shorten call
            var track = data.body;
            //send track information to firebase
            var inqueue = false;
            var index;
            var key;
            var song_likes;
            //if song is in the queue, add one like
            //otherwise add to queue
            db.subscribe(function (songs) {
                for (index = 0; index < songs.length; index++) {
                    if (songs[index].songid == id) {
                        key = songs[index].$key;
                        song_likes = songs[index].likes;
                        inqueue = true;
                        break;
                    }
                }
            });
            if (inqueue == false) {
                db.push({
                    artist: track.artists['0'].name,
                    title: track.name,
                    songid: id,
                    img: track.album.images['0'].url,
                    //maybe make a new table with likes columns of users who liked it and new table of users who disliked it
                    likes: 1,
                });
                ul.push({
                    song: track.name,
                    likes: 1,
                });
            }
            else {
                db.update(key, { likes: song_likes + 1 }); //likes update
            }
        }, function (err) {
            console.log('Something went wrong!', err);
        });
    };
    //use for authentiating with mobile libraries
    SearchPage.prototype.mobileAuth = function () {
        //initializes spotify auth
        __WEBPACK_IMPORTED_MODULE_3_oauth_phonegap__["OAuth"].initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
        //popup for spotify login
        //then resets html to wait for auth to complete
        //idealy this would be a loading feature to wait until popup closes with success
        //on error sends alert  to page for debbuging
        var spotifyApi = this.spotifyApi;
        __WEBPACK_IMPORTED_MODULE_3_oauth_phonegap__["OAuth"].popup('spotify', { cache: true }).done(function (spotify) {
            spotifyApi.setAccessToken(spotify.access_token);
        }).then().fail(function (err) {
            alert("Error with spotify login");
        });
    };
    //use for authenticating with web libraries
    SearchPage.prototype.webAuth = function () {
        var spotify = __WEBPACK_IMPORTED_MODULE_2_oauthio_web__["OAuth"].create('spotify');
        if (spotify.access_token) {
            // console.log(spotify.access_token);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2_oauthio_web__["OAuth"].initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
            //popup for spotify login
            //then resets html to wait for auth to complete
            //idealy this would be a loading feature to wait until popup closes with success
            //on error sends alert  to page for debbuging
            var spotifyApi_1 = this.spotifyApi;
            __WEBPACK_IMPORTED_MODULE_2_oauthio_web__["OAuth"].popup('spotify', { cache: true }).done(function (spotify) {
                spotifyApi_1.setAccessToken(spotify.access_token);
            }).then().fail(function (err) {
                alert("Error with spotify login");
            });
        }
    };
    SearchPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-search',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/search/search.html"*/'<!--\n  Generated template for the SearchPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n  <ion-icon name="menu"></ion-icon>\n</button>\n    <ion-title>Search</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <div id="searchpage">\n    <div id="everything">\n      <ion-searchbar item-input (ionInput)="getItems($event)" >\n      </ion-searchbar>\n      <ion-list id="list" style="visibility:hidden;">\n        <ion-navbar>\n          <ion-title>Songs</ion-title>\n        </ion-navbar>\n        <ion-item  clear ion-item  >\n          <ion-thumbnail item-start>\n            <img id="img0" src=""/>\n          </ion-thumbnail>\n          <h2 id="title0" data-songid></h2>\n          <p id="artist0"></p>\n          <button ion-button clear item-end (click)="itemTapped(0)">\n            <ion-icon name="add"></ion-icon>\n          </button>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="img1" src=""/>\n          </ion-thumbnail>\n          <h2 id="title1" data-songid></h2>\n          <p id="artist1"></p>\n          <button ion-button clear item-end (click)="itemTapped(1)">\n            <ion-icon name="add"></ion-icon>\n          </button>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="img2" src=""/>\n          </ion-thumbnail>\n          <h2 id="title2" data-songid></h2>\n          <p id="artist2"></p>\n          <button ion-button clear item-end (click)="itemTapped(2)">\n            <ion-icon name="add"></ion-icon>\n          </button>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="img3" src=""/>\n          </ion-thumbnail>\n          <h2 id="title3" data-songid></h2>\n          <p id="artist3"></p>\n          <button ion-button clear item-end (click)="itemTapped(3)">\n            <ion-icon name="add"></ion-icon>\n          </button>\n        </ion-item>\n\n        <ion-item id="item4" clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="img4" src=""/>\n          </ion-thumbnail>\n          <h2 id="title4" data-songid></h2>\n          <p id="artist4"></p>\n          <button ion-button clear item-end (click)="itemTapped(4)">\n            <ion-icon name="add"></ion-icon>\n          </button>\n        </ion-item>\n        <ion-navbar>\n          <ion-title>Artists</ion-title>\n        </ion-navbar>\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="imag0" src=""/>\n          </ion-thumbnail>\n          <p id="artistname0" ></p>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="imag1" src=""/>\n          </ion-thumbnail>\n          <p id="artistname1" ></p>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="imag2" src=""/>\n          </ion-thumbnail>\n          <p id="artistname2" ></p>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="imag3" src=""/>\n          </ion-thumbnail>\n          <p id="artistname3" ></p>\n        </ion-item>\n\n        <ion-item clear ion-item >\n          <ion-thumbnail item-start>\n            <img id="imag4" src=""/>\n          </ion-thumbnail>\n          <p id="artistname4" ></p>\n        </ion-item>\n  </ion-list>\n</div>\n</div>\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/search/search.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], SearchPage);
    return SearchPage;
}());

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 157:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 157;

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/login/login.module": [
		436,
		5
	],
	"../pages/nowplaying/nowplaying.module": [
		434,
		4
	],
	"../pages/profile/profile.module": [
		438,
		3
	],
	"../pages/register/register.module": [
		435,
		2
	],
	"../pages/search/search.module": [
		439,
		1
	],
	"../pages/slides/slides.module": [
		437,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 198;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return firebaseConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_nowplaying_nowplaying__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_home_home__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_list_list__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_search_search__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_slides_slides__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_8__pages_slides_slides__["a" /* SlidesPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.userpages = [
            { title: 'JamQ Home', component: __WEBPACK_IMPORTED_MODULE_5__pages_home_home__["a" /* HomePage */] },
            { title: 'Queue', component: __WEBPACK_IMPORTED_MODULE_6__pages_list_list__["a" /* ListPage */] },
            { title: 'Search', component: __WEBPACK_IMPORTED_MODULE_7__pages_search_search__["a" /* SearchPage */] },
            { title: 'Profile', component: __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ProfilePage */] }
        ];
        this.hostpages = [
            { title: 'JamQ Home', component: __WEBPACK_IMPORTED_MODULE_5__pages_home_home__["a" /* HomePage */] },
            { title: 'Host', component: __WEBPACK_IMPORTED_MODULE_4__pages_nowplaying_nowplaying__["a" /* NowplayingPage */] },
            { title: 'Search', component: __WEBPACK_IMPORTED_MODULE_7__pages_search_search__["a" /* SearchPage */] },
            { title: 'Profile', component: __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ProfilePage */] }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/home/log/Documents/JamQ/src/app/app.html"*/'<ion-menu [content]="content" id="host">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of hostpages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<ion-menu [content]="content" id="user">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of userpages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

var firebaseConfig = {
    apiKey: "AIzaSyCp9HMB336Zfcrl5spkAy4-w1nsrOe5wU0",
    authDomain: "jamq-b015a.firebaseapp.com",
    databaseURL: "https://jamq-b015a.firebaseio.com",
    projectId: "jamq-b015a",
    storageBucket: "jamq-b015a.appspot.com",
    messagingSenderId: "45757196990"
};
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(305);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_search_search__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_slides_slides__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_nowplaying_nowplaying__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_keyboard__ = __webpack_require__(433);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_angularfire2__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_login_login__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_register_register__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_profile_profile__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_nowplaying_nowplaying__["a" /* NowplayingPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_slides_slides__["a" /* SlidesPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_profile_profile__["a" /* ProfilePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_10_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_3__app_component__["b" /* firebaseConfig */]),
                __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_11_angularfire2_auth__["b" /* AngularFireAuthModule */],
                // HttpClientModule,
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/nowplaying/nowplaying.module#NowplayingPageModule', name: 'NowplayingPage', segment: 'nowplaying', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/register/register.module#RegisterPageModule', name: 'RegisterPage', segment: 'register', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/slides/slides.module#SlidesPageModule', name: 'SlidesPage', segment: 'slides', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/profile/profile.module#ProfilePageModule', name: 'ProfilePage', segment: 'profile', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/search/search.module#SearchPageModule', name: 'SearchPage', segment: 'search', priority: 'low', defaultHistory: [] }
                    ]
                }),
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_nowplaying_nowplaying__["a" /* NowplayingPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_slides_slides__["a" /* SlidesPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_profile_profile__["a" /* ProfilePage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_keyboard__["a" /* Keyboard */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NowplayingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var NowplayingPage = /** @class */ (function () {
    function NowplayingPage(platform, navCtrl, navParams, af, afAuth) {
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.afAuth = afAuth;
        this.user = {};
        if (platform.is('cordova')) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
        this.partyKey = sessionStorage['partyCookie'];
        this.songs = af.list("/" + this.partyKey + "/songlist", { query: { limitToLast: 10 } });
        //this.songs = af.list("/333/songlist", { query: { limitToLast: 10 } });
        //This shows the party number at the top
        //document.getElementById("partyNum").innerHTML = partyKey.body;
        //getting spotify api library
        // var SpotifyWebApi = require('spotify-web-api-node');
        //build api with no params
        // this.spotifyApi = new SpotifyWebApi();
        // if(this.isMobile) {
        //gets auth from cache named 'spotify'
        //   var spotify = OAuth.create('spotify');
        // } else {
        //gets auth from cache named 'spotify' is Web
        // var spotify = OAuthWeb.create('spotify');
        // }
        //sets access token of authenticated user
        // this.spotifyApi.setAccessToken(spotify.access_token);
        // gets user data from api and asynchronously throws it into page
        // checks if user has display name if not uses user id
        // this.spotifyApi.getMe().then(function(data) {
        //   if (data.body.display_name){
        //     document.getElementById("name").innerHTML = data.body.display_name + "'s party";
        //   } else {
        //     document.getElementById("name").innerHTML = data.body.id + "'s party";
        //   }
        // }, function(err) { //error checking
        //   console.log('Something went wrong!', err);
        // })
        //signs into firebase using anonymous user
        //  this.afAuth.auth.signInAnonymously().catch(function(error) {
        //    var errorMessage = error.message;
        //  });
    }
    NowplayingPage.prototype.remove = function (songid) {
        var _this = this;
        this.songs.forEach(function (song) {
            song.forEach(function (song) {
                if (song.songid == songid) {
                    _this.songs.remove(song.$key);
                }
            });
        });
    };
    NowplayingPage.prototype.ionViewDidLoad = function () {
        try {
            this.afAuth.authState.subscribe(function (auth) {
                //  console.log(auth)
            });
        }
        catch (e) { }
        console.log('ionViewDidLoad NowplayingPage');
    };
    NowplayingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-nowplaying',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/nowplaying/nowplaying.html"*/'<!--\n  Generated template for the NowplayingPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Host View</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n  <h1 text-center id="name"> Name Placeholder </h1> <!-- would like to add party number here or somewhere else on the page -->\n  <h3 text-center id="key"> {{partyKey}}</h3>\n  <ion-list>\n    <ion-item clear ion-item *ngFor= "let song of songs | async" >\n    <ion-thumbnail item-start>\n      <img src= "{{song.img}}">\n    </ion-thumbnail>\n    <h2> {{ song.title }} </h2>\n    <p> {{ song.artist }}</p>\n    <button ion-button clear item-end (click)=remove(song.songid)>\n      <ion-icon name="close"></ion-icon>\n    </button>\n  </ion-item>\n</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/nowplaying/nowplaying.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], NowplayingPage);
    return NowplayingPage;
}());

//# sourceMappingURL=nowplaying.js.map

/***/ }),

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__list_list__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nowplaying_nowplaying__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var HomePage = /** @class */ (function () {
    function HomePage(toast, afDatabase, menuCtrl, navCtrl, platform, af, afAuth) {
        this.toast = toast;
        this.afDatabase = afDatabase;
        this.menuCtrl = menuCtrl;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.af = af;
        this.afAuth = afAuth;
        this.user = {};
        if (platform.is('cordova')) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
        if (sessionStorage["partyCookie"] > 0) {
            this.partyKey = sessionStorage['partyCookie'];
        }
    }
    //navigates to and sets root Queue
    HomePage.prototype.goQueue = function () {
        // this.partyKey = document.getElementById('party').innerHTML
        //create obj for passing key to next page
        var data = { hostKey: this.partyKey };
        //var uniquePartyKey = data.toString();
        var uniquePartyKey = parseInt(this.partyKey);
        //console.log(uniquePartyKey);
        if (isNaN(uniquePartyKey)) {
            alert("Please enter a party number");
            return;
        }
        else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
            // later we should check if the party already exists in the db
            alert("Party number does not exist");
            return;
        }
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "guest"; //maybe later have it check if its your party or not
        //make sure that the key exists in the DB
        //if key is not in DB display alert and then go to home page again
        //Then enter party
        //remove user menu pptions
        this.menuCtrl.enable(true, 'user');
        this.menuCtrl.enable(false, 'host');
        this.userJoin.push({ party: this.partyKey });
        //takes user to queue with data containing party key
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__list_list__["a" /* ListPage */], data);
        //this.navCtrl.setRoot(NowplayingPage);
    };
    //navigates to and sets root to host now playing page
    HomePage.prototype.newParty = function () {
        var _this = this;
        //later we can check this and make sure that there is not already a party with that number
        //later we can check if the user is already hosting a party
        var randomServerNum = Math.floor(1000 + Math.random() * 9000);
        this.partyKey = randomServerNum.toString();
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "host"; //maybe later have it check if its your party or not
        //create the db observable to manipulate
        this.party = this.af.object("/" + this.partyKey);
        var db = this.party;
        this.afAuth.authState.subscribe(function (data) {
            _this.afDatabase.object("users/" + data.uid).take(1).subscribe(function (user) {
                db.set({
                    owner: user.username
                });
            });
        });
        this.userHost.push({ party: this.partyKey });
        //create new table in db with corresponding key
        //eable host menu/disable user
        this.menuCtrl.enable(false, 'user');
        this.menuCtrl.enable(true, 'host');
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__nowplaying_nowplaying__["a" /* NowplayingPage */]);
    };
    HomePage.prototype.goParty = function () {
        //create obj for passing key to next page
        var data = { hostKey: this.partyKey };
        //var uniquePartyKey = data.toString();
        var uniquePartyKey = parseInt(this.partyKey);
        //console.log(uniquePartyKey);
        if (isNaN(uniquePartyKey)) {
            alert("Please enter a party number");
            return;
        }
        else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
            // later we should check if the party already exists in the db
            alert("Party number does not exist");
            return;
        }
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "host"; //maybe later have it check if its your party or not
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__nowplaying_nowplaying__["a" /* NowplayingPage */]);
        this.menuCtrl.enable(false, 'user');
        this.menuCtrl.enable(true, 'host');
    };
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.afAuth.authState.subscribe(function (data) {
            _this.userHost = _this.afDatabase.list("users/" + data.uid + "/hosted");
            _this.userJoin = _this.afDatabase.list("users/" + data.uid + "/joined");
            _this.toast.create({
                message: 'Welcome to JamQ ',
                duration: 1000,
                position: 'top',
                cssClass: 'page-home'
            }).present();
        });
        if (sessionStorage["partyCookie"] > 0) {
            document.getElementById("goto").style.visibility = "visible";
        }
        console.log('ionViewDidLoad NowplayingPage');
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <!-- <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button> -->\n    <ion-title>JamQ</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding text-center>\n  <br><br><br><br><br><br><br>\n  <br>\n  <br>\n  <div id="keyPage">\n  <ion-item>\n    <ion-input text-center type="text" placeholder="Enter Party ID" id="party" [value]="partyKey" [(ngModel)]="partyKey"></ion-input>\n  </ion-item>\n\n  <br>\n  <button ion-button primary block (click)="goQueue()">Join Party</button>\n  <h1 text-center><b> OR</b> </h1>\n  <br>\n  <button ion-button secondary block (click)="goParty()" id="goto" style="visibility:hidden">Go to Your Party</button>\n  <br>\n  <button ion-button secondary block (click)="newParty()">Create a New Party!</button>\n</div>\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 85:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlidesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_login__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SlidesPage = /** @class */ (function () {
    function SlidesPage(afAuth, navCtrl, navParams) {
        var _this = this;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afAuth.authState.subscribe(function (auth) {
            if (auth) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
            }
        });
        //   var spotify = OAuth.create('spotify');
        //   if (spotify.access_token) {
        //     this.authenticated = true;
        //     this.navCtrl.setRoot(HomePage, {}, {animate: false});
        //   } else this.authenticated = false;
    }
    SlidesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SlidesPage');
    };
    SlidesPage.prototype.login = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__login_login__["a" /* LoginPage */], {}, { animate: false });
    };
    SlidesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-slides',template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/slides/slides.html"*/'<!--\n  Generated template for the SlidesPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>JamQ</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content class="tutorial-page">\n\n  <ion-slides pager>\n    <ion-slide>\n      <ion-toolbar>\n        <ion-buttons end>\n          <button ion-button (click)="login()" color="primary">Skip</button>\n        </ion-buttons>\n      </ion-toolbar>\n      <img src="http://internationalmusiccamp.com/wp-content/uploads/2014/06/Music-Icon.png" class="slide-image"/>\n      <h2>Welcome to JamQ </h2>\n      <p>Let your guests help you chose the best music to listen to - <b>Powered by Spotify!</b></p>\n    </ion-slide>\n\n    <ion-slide>\n      <ion-toolbar>\n        <ion-buttons end>\n          <button ion-button (click)="login()" color="primary">Skip</button>\n        </ion-buttons>\n      </ion-toolbar>\n      <img src="http://img.talkandroid.com/uploads/2016/01/spotify-app-logo-450x450.png" class="slide-image"/>\n      <h3> Link with Spotify!</h3>\n      <p>JamQ is very easy to use!</p>\n      <p>Login with Spotify and join a group or make your own.</p>\n    </ion-slide>\n\n    <ion-slide>\n      <ion-toolbar>\n      </ion-toolbar>\n      <img src="https://eac.com.au/wp-content/uploads/sites/3/2017/05/estate-agents-cooperative-eac-real-estate-listing-property-video-marketing-play-button.png"class="slide-image"/>\n      <h2 class="slide-title">Ready to Play?</h2>\n      <button ion-button large clear icon-end (click)="login()" color="primary">\n        Continue\n        <ion-icon name="arrow-forward"></ion-icon>\n      </button>\n    </ion-slide>\n  </ion-slides>\n</ion-content>\n\n<!-- <ion-content padding>\n\n</ion-content> -->\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/slides/slides.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], SlidesPage);
    return SlidesPage;
}());

//# sourceMappingURL=slides.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_oauthio_web__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_oauthio_web___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_oauthio_web__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_oauth_phonegap__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_oauth_phonegap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_oauth_phonegap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__slides_slides__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__nowplaying_nowplaying__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_mergeMap__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProfilePage = /** @class */ (function () {
    function ProfilePage(afAuth, afDatabase, 
        //private toast: ToastController,
        platform, menuCtrl, af, navCtrl, navParams, alertCtrl) {
        var _this = this;
        this.afAuth = afAuth;
        this.afDatabase = afDatabase;
        this.platform = platform;
        this.menuCtrl = menuCtrl;
        this.af = af;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.user = {};
        this.afAuth.authState.subscribe(function (auth) {
            _this.afDatabase.list("users/" + auth.uid + "/hosted").subscribe(function (data) {
                console.log(data);
                _this.userHost = data;
            });
            _this.userJoin = _this.afDatabase.list("users/" + auth.uid);
            console.log(_this.userHost);
            _this.afDatabase.object("users/" + auth.uid).take(1).subscribe(function (userdata) {
                // console.log(userdata.username);
                _this.user.username = userdata.username;
            });
        });
        console.log(this.user.username);
        //checks if device is mobile or Web
        if (platform.is("cordova")) {
            this.isMobile = true;
        }
        else {
            this.isMobile = false;
        }
        //getting spotify api library
        var SpotifyWebApi = __webpack_require__(242);
        //build api with no params
        this.spotifyApi = new SpotifyWebApi();
        //switches Auth method based on if mobile or web
        if (this.isMobile) {
            //is phone
            //gets auth from cache named 'spotify'
            this.spotify = __WEBPACK_IMPORTED_MODULE_4_oauth_phonegap__["OAuth"].create("spotify");
        }
        else {
            //is web
            //gets auth from cache named 'spotify'
            this.spotify = __WEBPACK_IMPORTED_MODULE_3_oauthio_web__["OAuth"].create("spotify");
            console.log("is Web");
            if (sessionStorage["partyCookie"] > 0) {
                this.partyKey = sessionStorage['partyCookie'];
            }
        }
        //sets access token of authenticated user
        this.spotifyApi.setAccessToken(this.spotify.access_token);
    }
    ProfilePage.prototype.spotifyLogin = function () {
        if (this.isMobile == true) {
            //is phone
            this.mobileAuth();
            var spotify = document.getElementById("spotify");
            var spotifyfull = document.getElementById("spotifyfull");
            spotify.style.visibility = "visible";
            spotify.innerHTML = "Spotify Signed In";
            var page = document.getElementById("page");
            spotifyfull.style.visibility = "hidden";
            page.replaceChild(spotify, spotifyfull);
        }
        else {
            //is web
            this.webAuth();
            var spotify = document.getElementById("spotify");
            var spotifyfull = document.getElementById("spotifyfull");
            spotify.style.visibility = "visible";
            spotify.innerHTML = "Spotify Signed In";
            var page = document.getElementById("page");
            spotifyfull.style.visibility = "hidden";
            page.replaceChild(spotify, spotifyfull);
        }
    };
    ProfilePage.prototype.soundcloudLogin = function () {
        alert("Coming soon!");
    };
    ProfilePage.prototype.youtubeLogin = function () {
        alert("Coming soon!");
    };
    ProfilePage.prototype.ionViewDidLoad = function () {
        if (this.spotify.access_token) {
            var spotify = document.getElementById("spotify");
            var spotifyfull = document.getElementById("spotifyfull");
            spotify.style.visibility = "visible";
            spotify.innerHTML = "Spotify Signed In";
            var page = document.getElementById("page");
            spotifyfull.style.visibility = "hidden";
            page.replaceChild(spotify, spotifyfull);
        }
        console.log("ionViewDidLoad ProfilePage");
    };
    //use for authentiating with mobile libraries
    ProfilePage.prototype.mobileAuth = function () {
        //initializes spotify auth
        __WEBPACK_IMPORTED_MODULE_4_oauth_phonegap__["OAuth"].initialize("NJG7cpjPQHkVhSQgvpQi5MRoyM4");
        //popup for spotify login
        //then resets html to wait for auth to complete
        //idealy this would be a loading feature to wait until popup closes with success
        //on error sends alert  to page for debbuging
        var spotifyApi = this.spotifyApi;
        __WEBPACK_IMPORTED_MODULE_4_oauth_phonegap__["OAuth"].popup("spotify", { cache: true })
            .done(function (spotify) {
            spotifyApi.setAccessToken(spotify.access_token);
        })
            .then()
            .fail(function (err) {
            alert("Error with spotify login");
        });
    };
    //use for authenticating with web libraries
    ProfilePage.prototype.webAuth = function () {
        var spotify = __WEBPACK_IMPORTED_MODULE_3_oauthio_web__["OAuth"].create("spotify");
        if (spotify.access_token) {
            // console.log(spotify.access_token);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_3_oauthio_web__["OAuth"].initialize("NJG7cpjPQHkVhSQgvpQi5MRoyM4");
            //popup for spotify login
            //then resets html to wait for auth to complete
            //idealy this would be a loading feature to wait until popup closes with success
            //on error sends alert  to page for debbuging
            var spotifyApi_1 = this.spotifyApi;
            __WEBPACK_IMPORTED_MODULE_3_oauthio_web__["OAuth"].popup("spotify", { cache: true })
                .done(function (spotify) {
                spotifyApi_1.setAccessToken(spotify.access_token);
            })
                .then()
                .fail(function (err) {
                alert("Error with spotify login");
            });
        }
    };
    ProfilePage.prototype.logout = function () {
        //this.afAuth.auth.signOut();
        this.afAuth.auth.signOut().then(function () {
            // Sign-out successful.
            alert("logged out");
        }, function (error) {
            // An error happened.
            alert("// An error happened.");
        });
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__slides_slides__["a" /* SlidesPage */]);
    };
    ProfilePage.prototype.goQueue = function () {
        // this.partyKey = document.getElementById('party').innerHTML
        //create obj for passing key to next page
        var input;
        var prompt = this.alertCtrl.create({
            title: 'Enter the party # you want to join',
            //message: "Enter a name for this new album you're so keen on adding",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Party Number'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (input) {
                        console.log(input);
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Join',
                    handler: function (input) {
                        console.log(input);
                        console.log('Saved clicked');
                    }
                }
            ]
        });
        prompt.present();
        console.log(input);
        input = { hostKey: this.partyKey };
        //var uniquePartyKey = data.toString();
        var uniquePartyKey = parseInt(this.partyKey);
        //console.log(uniquePartyKey);
        if (isNaN(uniquePartyKey)) {
            alert("Please enter a party number");
            return;
        }
        else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
            // later we should check if the party already exists in the db
            alert("Party number does not exist");
            return;
        }
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "guest"; //maybe later have it check if its your party or not
        //make sure that the key exists in the DB
        //if key is not in DB display alert and then go to home page again
        //Then enter party
        //remove user menu pptions
        this.menuCtrl.enable(true, "user");
        this.menuCtrl.enable(false, "host");
        //takes user to queue with data containing party key
        //this.navCtrl.setRoot(ListPage, data);
        //this.navCtrl.setRoot(NowplayingPage);
    };
    //navigates to and sets root to host now playing page
    ProfilePage.prototype.newParty = function () {
        //later we can check this and make sure that there is not already a party with that number
        //later we can check if the user is already hosting a party
        var randomServerNum = Math.floor(1000 + Math.random() * 9000);
        this.partyKey = randomServerNum.toString();
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "host"; //maybe later have it check if its your party or not
        //create the db observable to manipulate
        this.party = this.af.object("/" + this.partyKey);
        var db = this.party;
        this.afAuth.authState.subscribe(function (data) {
            db.set({
                owner: data.email
            });
        });
        //create new table in db with corresponding key
        //eable host menu/disable user
        this.menuCtrl.enable(false, "user");
        this.menuCtrl.enable(true, "host");
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__nowplaying_nowplaying__["a" /* NowplayingPage */]);
    };
    ProfilePage.prototype.goParty = function () {
        //create obj for passing key to next page
        var data = { hostKey: this.partyKey };
        //var uniquePartyKey = data.toString();
        var uniquePartyKey = parseInt(this.partyKey);
        //console.log(uniquePartyKey);
        if (isNaN(uniquePartyKey)) {
            alert("Please enter a party number");
            return;
        }
        else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
            // later we should check if the party already exists in the db
            alert("Party number does not exist");
            return;
        }
        sessionStorage["partyCookie"] = this.partyKey;
        sessionStorage["role"] = "host"; //maybe later have it check if its your party or not
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__nowplaying_nowplaying__["a" /* NowplayingPage */]);
        this.menuCtrl.enable(false, "user");
        this.menuCtrl.enable(true, "host");
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: "page-profile",template:/*ion-inline-start:"/home/log/Documents/JamQ/src/pages/profile/profile.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Profile</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div id="page">\n    <h1 text-center>{{user.username}}</h1>\n    <br>\n    <button id="spotifyfull" ion-button color="spotify" block style="visibility:visible" (click)="spotifyLogin()">Register Spotify</button>\n    <button id="soundcloud" ion-button block color="soundcloud" (click)="soundcloudLogin()">Register Soundcloud</button>\n    <button id="youtube" ion-button block color="youtube" (click)="youtubeLogin()">Register Youtube</button>\n    <br>\n\n\n\n\n    <button ion-button primary block (click)="goQueue()">Join a New Party</button>\n    <button ion-button secondary block (click)="newParty()">Create a New Party!</button>\n\n\n    <br>\n      <div *ngIf="userHost">\n    <h3 text-center> Previously Hosted Events </h3>\n    <ion-card *ngFor="let host of userHost">\n    <!-- <ion-card> -->\n      <ion-item text-center>\n        <h1>{{host.party}}</h1>\n      </ion-item>\n      <ion-row>\n        <ion-col>\n          <button ion-button icon-left clear small>\n            <ion-icon name="people"></ion-icon>\n            <div>58 listeners</div>\n          </button>\n        </ion-col>\n        <ion-col>\n          <button ion-button icon-left clear small>\n            <ion-icon name="musical-notes"></ion-icon>\n            <div>40 songs</div>\n          </button>\n        </ion-col>\n      </ion-row>\n    </ion-card>\n  </div>\n      <br>\n      <div *ngIf="user.Join">\n      <h3 text-center> Previously Joined Events </h3>\n    <ion-card *ngFor="let join of userJoin | async">\n      <ion-item text-center>\n        <h1>{{join.party}}</h1>\n      </ion-item>\n      <ion-row>\n        <ion-col>\n          <button ion-button icon-left clear small>\n            <ion-icon name="people"></ion-icon>\n            <div>124 listeners</div>\n          </button>\n        </ion-col>\n        <ion-col>\n          <button ion-button icon-left clear small>\n            <ion-icon name="musical-notes"></ion-icon>\n            <div>93 songs</div>\n          </button>\n        </ion-col>\n      </ion-row>\n    </ion-card>\n  </div>\n\n<button ion-button secondary block (click)="logout()">Log Out</button>\n\n\n    <button id="spotify" ion-button color="spotify" block style="visibility:hidden" clear (click)="spotifyLogout()">Register Spotify</button>\n\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/log/Documents/JamQ/src/pages/profile/profile.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ })

},[288]);
//# sourceMappingURL=main.js.map
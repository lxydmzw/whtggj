'use strict';
class CurSence {

}
CurSence.curSence = "";//qq_HomeView QQ_SkinView DY_SigninView
class Utils {
	constructor() { }
	addClickEvent(btn, caller, cb, soundId) {
		btn.offAllCaller(caller);
		if (btn instanceof Laya.Button) {
			let callback = function (event) {
				event.stopPropagation();
				if (cb)
					cb.call(caller, event);
				(soundId === 0 || soundId) && LayaSample.soundMgr.play(soundId);
				LayaSample.soundMgr.play("button");
			};
			btn.on(Laya.Event.CLICK, caller, callback);
		}
		else {
			let scaleTime = 60;
			let wRatio = 1;
			let aX = btn.anchorX;
			let aY = btn.anchorY;
			let posX = btn.x * wRatio;
			let posY = btn.y * wRatio;
			let sX = btn.scaleX * wRatio;
			let sY = btn.scaleX * wRatio;
			let sSize = 0.9 * wRatio;
			let aPos = 0.5;
			let cbDown = function (event) {
				event.stopPropagation();
				Laya.Tween.to(btn, {
					scaleX: sSize,
					scaleY: sSize
				}, scaleTime);
			};
			btn.on(Laya.Event.MOUSE_DOWN, caller, cbDown);
			let cbUp = function (event) {
				event.stopPropagation();
				Laya.Tween.to(btn, {
					scaleX: sX,
					scaleY: sY
				}, scaleTime);
				if (cb)
					cb.call(caller, event);
				(soundId === 0 || soundId) && LayaSample.soundMgr.play(soundId);
			};
			btn.on(Laya.Event.MOUSE_UP, caller, cbUp);
			let cbOut = function (event) {
				event.stopPropagation();
				Laya.Tween.to(btn, {
					scaleX: sX,
					scaleY: sY
				}, scaleTime);
			};
			btn.on(Laya.Event.MOUSE_OUT, caller, cbOut);
		}
	}
	getRGB(_hexColor) {
		var color = [], rgb = [];
		let hexColor = _hexColor.replace(/#/, "");
		if (hexColor.length == 3) {
			var tmp = [];
			for (var i = 0; i < 3; i++) {
				tmp.push(hexColor.charAt(i) + hexColor.charAt(i));
			}
			hexColor = tmp.join("");
		}
		for (var i = 0; i < 3; i++) {
			color[i] = "0x" + hexColor.substr(i * 2, 2);
			rgb.push(parseInt(color[i]));
		}
		return new Laya.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
	}
	getRGBA(_hexColor, alpha) {
		let _alpha = alpha != 0 || !alpha ? 1 : alpha;
		var color = [], rgb = [];
		let hexColor = _hexColor.replace(/#/, "");
		if (hexColor.length == 3) {
			var tmp = [];
			for (var i = 0; i < 3; i++) {
				tmp.push(hexColor.charAt(i) + hexColor.charAt(i));
			}
			hexColor = tmp.join("");
		}
		for (var i = 0; i < 3; i++) {
			color[i] = "0x" + hexColor.substr(i * 2, 2);
			rgb.push(parseInt(color[i]));
		}
		return new Laya.Vector4(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, _alpha);
	}
	tweenShake(target, tweenTimer) {
		let timeLine = new Laya.TimeLine();
		let pivotX = target.pivotX;
		target.pivotX = target.width / 2;
		timeLine.addLabel("shake1", 0).to(target, {
			rotation: target.rotation + 5
		}, 50, null, 0)
			.addLabel("shake2", 0).to(target, {
				rotation: target.rotation - 6
			}, 50, null, 0)
			.addLabel("shake3", 0).to(target, {
				rotation: target.rotation - 13
			}, 50, null, 0)
			.addLabel("shake4", 0).to(target, {
				rotation: target.rotation + 3
			}, 50, null, 0)
			.addLabel("shake5", 0).to(target, {
				rotation: target.rotation - 5
			}, 50, null, 0)
			.addLabel("shake6", 0).to(target, {
				rotation: target.rotation + 2
			}, 50, null, 0)
			.addLabel("shake7", 0).to(target, {
				rotation: target.rotation - 8
			}, 50, null, 0)
			.addLabel("shake8", 0).to(target, {
				rotation: target.rotation + 3
			}, 50, null, 0)
			.addLabel("shake9", 0).to(target, {
				rotation: 0
			}, 50, null, 0);
		if (!tweenTimer) {
			timeLine.on(Laya.Event.COMPLETE, this, function () {
				timeLine.destroy();
				target.rotation = 0;
				target.pivotX = pivotX;
			});
		}
		else {
			Laya.timer.once(500, this, function () {
				timeLine.destroy();
				target.rotation = 0;
				target.pivotX = pivotX;
			});
		}
		timeLine.play(0, true);
	}
	compareVersion(v1, v2) {
		v1 = v1.split('.');
		v2 = v2.split('.');
		const len = Math.max(v1.length, v2.length);
		while (v1.length < len) {
			v1.push('0');
		}
		while (v2.length < len) {
			v2.push('0');
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i]);
			const num2 = parseInt(v2[i]);
			if (num1 > num2) {
				return 1;
			}
			else if (num1 < num2) {
				return -1;
			}
		}
		return 0;
	}
	setMaterial(model) {
	}
	format(timestamp) {
		function add0(m) {
			return m < 10 ? '0' + m : m;
		}
		var time = new Date(timestamp);
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var date = time.getDate();
		return year + '-' + add0(month) + '-' + add0(date);
	}
	loadSubpackage(loadName, caller, presscb, cb) {
		this.loadIndex = 0;
		if (Laya.Browser.onWeiXin) {
			if (Array.isArray(loadName)) {
				for (var key in loadName)
					this.toLoadSubpackage(loadName[key], this, (res) => {
						this.loadIndex++;
						presscb.call(caller, res, this.loadIndex / loadName.length, true);
						if (this.loadIndex >= loadName.length) {
							cb.call(caller, res, 1, true);
						}
					});
			}
			else {
				this.toLoadSubpackage(loadName, this, (res) => {
					presscb.call(caller, res, 1, true);
					cb.call(caller, res, 1, true);
				});
			}
		}
	}
	toLoadSubpackage(loadName, caller, cb) {
		wx["loadSubpackage"]({
			name: loadName,
			success: function (res) {
				console.log("分包加载成功 " + loadName);
				cb.call(caller, res, true);
			},
			fail: function (res) {
				console.error("分包加载失败 " + loadName);
				cb.call(caller, res, false);
			}
		});
	}
	getRandoms(amount, max, min = 0) {
		let totalArray = [];
		let targetArray = [];
		for (var i = min; i < max; i++) {
			totalArray.push(i);
		}
		totalArray = totalArray.sort(() => Math.random() - Math.random());
		for (var i = 0; i < amount; i++) {
			targetArray.push(totalArray[i]);
		}
		return targetArray;
	}
	slowCameraAction(scale = 0.4, duration = 150) {
		console.log("开始慢放");
		Laya.timer.scale = scale;
		Laya.timer.clear(this, this.slowCameraStop);
		Laya.timer.once(duration, this, this.slowCameraStop);
		Laya.timer.clear(this, this.slowCameraActionDo);
	}
	slowCameraActionDo(targetScale) {
	}
	slowCameraStop() {
		console.log("停止慢放");
		Laya.timer.scale = 1;
	}
	generateRandomColor(mixColor) {
		let x = Math.random();
		let y = Math.random();
		let z = Math.random();
		let w = Math.random();
		if (mixColor) {
			x = (x + mixColor.x) / 2;
			y = (y + mixColor.y) / 2;
			z = (z + mixColor.z) / 2;
			w = (w + mixColor.w) / 2;
		}
		return new Laya.Vector4(x, y, z, w);
	}
	tweenScale(target, tweenTimer) {
		target.scaleX = 1;
		target.scaleY = 1;
		Laya.Tween.to(target, { scaleX: 1.1, scaleY: 1.1 }, 250, null, Laya.Handler.create(this, this.tweenScale2, [target]));
	}
	tweenScale2(target) {
		Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, 250, null, Laya.Handler.create(this, this.tweenScale, [target, null]));
	}
}

class StorageMgr {
	constructor() {
		this._userData = null;
		this._userDataKey = "userData";
		this.init();
	}
	init() {
		this._userData = {
			isPlaySound: true,
			isPlayVibrate: true,
			isNoAds: false,
			levelID: 0,
			isCollect: false,
			dy_DyDate: 0,
			dy_Gold: 0,
			dy_dayTime: 0,
			dy_SigninDayTime: 0,
			dy_offineTime: 0,
			dy_NotSignin: true,
			dy_signin_Level: 0,
			dy_skinRandomLevel: 1,
			dy_NowSkin: 0,
			dy_skinVideoMaxNum: 20,
			dy_UnLockerSkin: [0],
		};
		this.readStorage();
		this.initGameStatus();
		this.dy_InitData();
		if (this._userData.isNoAds == undefined)
			this._userData.isNoAds = false;
	}
	dy_InitData() {
		if (this._userData.dy_DyDate == undefined || !this._userData.dy_DyDate) {
			this._userData.dy_DyDate = 1;
			this._userData.dy_Gold = 0;
			this._userData.dy_dayTime = 0;
			this._userData.dy_SigninDayTime = 0;
			this._userData.dy_offineTime = 0;
			this._userData.dy_NotSignin = true;
			this._userData.dy_signin_Level = 0;
			this._userData.dy_skinRandomLevel = 1;
			this._userData.dy_NowSkin = 0;
			this._userData.dy_skinVideoMaxNum = 20;
			this._userData.dy_UnLockerSkin = [0];
		}
		this.writeStorage();
	}
	readStorage() {
		let jsonUserData = Laya.LocalStorage.getItem(this._userDataKey);
		if (jsonUserData)
			this._userData = JSON.parse(jsonUserData);
	}
	writeStorage() {
		if (this._userData)
			Laya.LocalStorage.setItem(this._userDataKey, JSON.stringify(this._userData));
	}
	removeStorage() {
		Laya.LocalStorage.removeItem(this._userDataKey);
	}
	isNoAds() {
		return this._userData.isNoAds;
	}
	setNoAds(isNoAds) {
		this._userData.isNoAds = isNoAds;
		this.writeStorage();
	}
	isPlaySound() {
		return this._userData.isPlaySound;
	}
	setPlaySound(isPlaySound) {
		this._userData.isPlaySound = isPlaySound;
		this.writeStorage();
		if (isPlaySound)
			LayaSample.soundMgr.playBGM();
		else
			LayaSample.soundMgr.stopBGM();
	}
	isPlayVibrate() {
		return this._userData.isPlayVibrate;
	}
	setPlayVibrate(isPlayVibrate) {
		this._userData.isPlayVibrate = isPlayVibrate;
		this.writeStorage();
	}
	setCollect(collect) {
		this._userData.isCollect = collect;
		this.writeStorage();
	}
	isCollect() {
		return this._userData.isCollect;
	}
	initGameStatus() {
		if (!this._userData.gameStatus) {
			this._userData.gameStatus = {};
		}
		if (!this._userData.gameStatus.maxLevel) {
			this._userData.gameStatus.maxLevel = 1;
		}
		if (!this._userData.gameStatus.maxScore) {
			this._userData.gameStatus.maxScore = 0;
		}
		if (!this._userData.gameStatus.gold) {
			this._userData.gameStatus.gold = 0;
		}
		if (!this._userData.signinTime) {
			this._userData.signinTime = 0;
		}
		if (!this._userData.skinTipsTime) {
			this._userData.skinTipsTime = 0;
		}
		this.writeStorage();
	}
	isSkinTips() {
		return (Math.floor(this._userData.skinTipsTime / 86400) != Math.floor(Date.parse((new Date()).toString()) / 86400000));
	}
	setSkinTips(isShow) {
		this._userData.skinTipsTime = isShow ? 0 : Math.floor(Date.parse((new Date()).toString()) / 1000);
		this.writeStorage();
	}
	setSigninTime(signinTime) {
		this._userData.signinTime = signinTime;
		this.writeStorage();
	}
	isSignin() {
		let isSignin = true;
		let signinTime = this._userData.signinTime;
		if (signinTime < 2) {
			isSignin = true;
		}
		else if (signinTime < 3) {
			isSignin = false;
		}
		else {
			isSignin = (Math.floor(signinTime / 86400) == Math.floor(Date.parse((new Date()).toString()) / 86400000));
		}
		return isSignin;
	}
	getSigninTime() {
		return this._userData.signinTime;
	}
	getGameStatus() {
		return this._userData.gameStatus;
	}
	setMaxLevel(level) {
		if (this._userData.gameStatus.maxLevel < level) {
			this._userData.gameStatus.maxLevel = level;
			this.writeStorage();
		}
	}
	addGold(gold) {
		this._userData.dy_Gold += gold;
		LayaSample.glEvent.event("GOLD_ADD");
		this.writeStorage();
	}
	setMaxScore(maxScore) {
		if (this._userData.gameStatus.maxScore < maxScore) {
			this._userData.gameStatus.maxScore = maxScore;
			this.writeStorage();
		}
	}
	getSkinId() {
		return this._userData.skinId;
	}
	setSkinId(id) {
		this._userData.skinId = id;
		this.writeStorage();
	}
	GetGold() {
		console.log("当前金币数量：", this._userData.dy_Gold);
		if (this._userData.dy_Gold === undefined || this._userData.dy_Gold == null || this._userData.dy_Gold < 0) {
			this._userData.dy_Gold = 0;
		}
		return this._userData.dy_Gold;
	}
	qq_SaveNowSkinID(id) {
		this._userData.dy_NowSkin = id;
		this.writeStorage();
	}
	qq_GetNowSkinID() {
		return this._userData.dy_NowSkin;
	}
	qq_GetNotSignin() {
		return this._userData.dy_NotSignin;
	}
	qq_AddSigninLevel() {
		this._userData.dy_signin_Level++;
		if (this._userData.dy_signin_Level > 6) {
			this._userData.dy_signin_Level = 0;
		}
		this.writeStorage();
	}
	qq_GetSigninLevel() {
		return this._userData.dy_signin_Level;
	}
	qq_AddRandomLevel() {
		this._userData.dy_skinRandomLevel++;
		this.writeStorage();
	}
	qq_GetSkinRandomLevel() {
		return this._userData.dy_skinRandomLevel;
	}
	qq_AddUnLockSkinList(index) {
		if (this._userData.dy_UnLockerSkin.indexOf(index) == -1) {
			this._userData.dy_UnLockerSkin.push(index);
			this.writeStorage();
		}
	}
	qq_GetUnLockSkinList() {
		return this._userData.dy_UnLockerSkin;
	}
	qq_ResetSkinVideoMaxNum() {
		this._userData.dy_skinVideoMaxNum = 20;
		this.writeStorage();
	}
	qq_DelSkinVideoMaxNum() {
		this._userData.dy_skinVideoMaxNum--;
		this.writeStorage();
	}
	qq_GetSkinVideoMaxNum() {
		return this._userData.dy_skinVideoMaxNum;
	}
	qq_SetNotSignin(_noUsing) {
		this._userData.dy_NotSignin = _noUsing;
		this.writeStorage();
	}
	qq_SaveNowDayTime() {
		this._userData.dy_dayTime = new Date().getDate();
		this.writeStorage();
	}
	qq_GetDayTime() {
		return this._userData.dy_dayTime;
	}
	qq_SaveNowGameTime() {
		this._userData.dy_offineTime = new Date().getTime();
		this.writeStorage();
	}
	qq_GetOffLineTime() {
		return this._userData.dy_offineTime;
	}
	qq_SaveSigninDayTime() {
		this._userData.dy_SigninDayTime = new Date().getDate();
		this.writeStorage();
	}
	qq_GetSiginDayTime() {
		return this._userData.dy_SigninDayTime;
	}
	setShowCollDate() {
		this._userData.isShowColDate = Math.floor(Date.parse((new Date()).toString()) / 1000);
		this.writeStorage();
	}
}

class SoundMgr {
	constructor() {
		this._bgmCtx = null;
		this._soundType = [
			"button",
			"impact",
			"jump",
			"down",
			"fly",
			"item",
			"lose",
			"run",
			"water"
		];
		this._pathRoot = "res/sound/";
		this._soundCtx = {};
		this._soundFile = [];
		for (var key in this._soundType) {
			let sound = this._soundType[key];
			this._soundFile.push(sound);
		}
	}
	init() {
		let path = this._pathRoot;
		let soundFile = this._soundFile;
		let soundCount = this._soundFile.length;
		let file = "";
		let num = 0;
		for (let i = 0; i < soundCount; ++i) {
			file = soundFile[i];
			let innerAudioContext = new Laya.SoundChannel;
			innerAudioContext.url = path + file + ".mp3";
			Laya.SoundManager.addChannel(innerAudioContext);
			this._soundCtx[file] = true;
		}
	}
	play(name, loop = 1) {
		if (this._soundCtx[name] && LayaSample.storageMgr.isPlaySound()) {
			Laya.SoundManager.playSound(this._pathRoot + name + ".mp3", loop);
		}
	}
	playBullet() {
		if (!this._bulletSound) {
		}
		else {
			this._bulletSound.play();
		}
	}
	stopBullet() {
		if (this._bulletSound) {
			this._bulletSound.pause();
		}
	}
	stop(name) {
		if (this._soundCtx[name]) {
			Laya.SoundManager.stopSound(this._pathRoot + name + ".mp3");
		}
	}
	playBGM() {
		let url = this._pathRoot + "bgm" + ".mp3";
		if (LayaSample.storageMgr.isPlaySound() == false)
			return;
		if (Laya.Browser.onWeiXin) {
			if (this._bgmCtx != null) {
				this._bgmCtx.stop();
				this._bgmCtx.destroy();
				this._bgmCtx = null;
			}
			this._bgmCtx = wx.createInnerAudioContext();
			this._bgmCtx.src = url;
			this._bgmCtx.loop = true;
			LayaSample.storageMgr.isPlaySound() && this._bgmCtx.play();
		}
		else {
			Laya.SoundManager.stopMusic();
			Laya.SoundManager.playMusic(url, 0);
		}
	}
	stopBGM() {
		if (Laya.Browser.onWeiXin) {
			(this._bgmCtx != null) && this._bgmCtx.stop();
		}
		else {
			Laya.SoundManager.stopMusic();
		}
	}
	stopAll() {
		Laya.SoundManager.stopAll();
		this.stopBGM();
	}
	setMuted(key) {
		Laya.SoundManager.muted = key;
	}
}

class MD5 {
	static hex_md5(s) { return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
	static b64_md5(s) { return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
	static str_md5(s) { return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
	static hex_hmac_md5(key, data) { return this.binl2hex(this.core_hmac_md5(key, data)); }
	static b64_hmac_md5(key, data) { return this.binl2b64(this.core_hmac_md5(key, data)); }
	static str_hmac_md5(key, data) { return this.binl2str(this.core_hmac_md5(key, data)); }
	static md5_vm_test() {
		return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
	}
	static core_md5(x, len) {
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
			a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
			a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
			a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
			a = this.safe_add(a, olda);
			b = this.safe_add(b, oldb);
			c = this.safe_add(c, oldc);
			d = this.safe_add(d, oldd);
		}
		return Array(a, b, c, d);
	}
	static md5_cmn(q, a, b, x, s, t) {
		return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
	}
	static md5_ff(a, b, c, d, x, s, t) {
		return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	static md5_gg(a, b, c, d, x, s, t) {
		return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	static md5_hh(a, b, c, d, x, s, t) {
		return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	static md5_ii(a, b, c, d, x, s, t) {
		return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}
	static core_hmac_md5(key, data) {
		var bkey = this.str2binl(key);
		if (bkey.length > 16)
			bkey = this.core_md5(bkey, key.length * this.chrsz);
		var ipad = Array(16), opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
		return this.core_md5(opad.concat(hash), 512 + 128);
	}
	static safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	static bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}
	static str2binl(str) {
		var bin = Array();
		var mask = (1 << this.chrsz) - 1;
		for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
			bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
		return bin;
	}
	static binl2str(bin) {
		var str = "";
		var mask = (1 << this.chrsz) - 1;
		for (var i = 0; i < bin.length * 32; i += this.chrsz)
			str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
		return str;
	}
	static binl2hex(binarray) {
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
				hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
		}
		return str;
	}
	static binl2b64(binarray) {
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i += 3) {
			var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
				| (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
				| ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 > binarray.length * 32)
					str += this.b64pad;
				else
					str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
			}
		}
		return str;
	}
}
MD5.hexcase = 0;
MD5.b64pad = "";
MD5.chrsz = 8;

class Dict {
	constructor() {
		this.items = {};
	}
	has(key) {
		return key in this.items;
	}
	set(key, value) {
		this.items[key] = value;
	}
	remove(key) {
		if (this.has(key)) {
			delete this.items[key];
			return true;
		}
		return false;
	}
	get(key) {
		return this.has(key) ? this.items[key] : undefined;
	}
	values() {
		var values = [];
		for (var key in this.items) {
			if (this.has(key)) {
				values.push(this.items[key]);
			}
		}
		return values;
	}
	getItems() {
		return this.items;
	}
	size() {
		return Object.keys(this.items).length;
	}
	clear() {
		this.items = {};
	}
	keys() {
		return Object.keys(this.items);
	}
}

class NetMgr {
	constructor() {
		this.isTokenActive = false;
		this._connectCount = 0;
		this.apiLogin = "wstggj/common/temporaryLogin";
		this.messageDict = new Dict();
		this.otherApp = 'wstggj/common/clickWxapp';
	}
	request(method, parm, cb) {
		if (method == this.apiLogin) {
			console.log('login...');
		}
		else if (this.isTokenActive && NetMgr.token) {
			parm.token = NetMgr.token;
			console.log('token...');
		}
		else {
			console.error("Token is null or token inactive. Request api" + method);
			this.reconnect();
			return;
		}
		let httpRequest = new Laya.HttpRequest();
		httpRequest.once(Laya.Event.COMPLETE, this, this.response);
		httpRequest.once(Laya.Event.ERROR, this, this.errorHandler);
		httpRequest.on(Laya.Event.PROGRESS, this, this.progressHandler);
		this.messageDict.set(method, { method: method, parm: parm, cb: cb, httpObj: httpRequest });
		console.log("加密数据", parm);
		let url = NetMgr.host + method;
		let data = this.setParmData(parm);
		httpRequest.send(url, this.urlEncode(data), "post", "json");
	}
	urlEncode(param) {
		if (param == null)
			return '';
		let paramStr = '';
		let keys = new Array();
		for (let k in param) {
			keys.push(k);
		}
		keys = keys.sort();
		for (let i = 0, count = keys.length; i < count; ++i) {
			paramStr += keys[i] + '=' + encodeURIComponent(param[keys[i]]);
			if (i != count - 1) {
				paramStr += '&';
			}
		}
		return paramStr;
	}
	setParmData(parm) {
		parm.apiKey = NetMgr.apiKey;
		parm.timestamp = Date.parse(new Date().toString()) / 1000;
		parm.apiSign = "";
		if (NetMgr.token)
			parm.token = NetMgr.token;
		if (parm.share_user_id == null) {
			delete parm.share_user_id;
		}
		let hash_data = '';
		let key_arr = new Array();
		for (let k in parm) {
			key_arr.push(k);
		}
		key_arr = key_arr.sort();
		for (let i = 0; i < key_arr.length; i++) {
			parm[key_arr[i]] = parm[key_arr[i]] == undefined ? '' : parm[key_arr[i]];
			hash_data += encodeURIComponent(parm[key_arr[i]]);
		}
		let apiSign = MD5.hex_hmac_md5(NetMgr.apiSecret, hash_data);
		parm.apiSign = apiSign;
		return parm;
	}
	errorHandler(res) {
		console.error("HTTP error：", res);
		this.reconnect();
	}
	progressHandler(res) {
	}
	response(data) {
		let path = data["path"];
		let requData = this.messageDict.get(path);
		if (path == this.apiLogin) {
			switch (data.code) {
				case 0:
					this._requData && LayaSample.netMgr.request(this._requData.method, this._requData.parm, this._requData.cb);
					this.connected(data.result.token);
					break;
				default:
					break;
			}
		}
		else {
			switch (data.code) {
				case 200:
					this._requData = requData;
					this.unconnect();
					this.reconnect();
					break;
				default:
					break;
			}
		}
		if (requData && requData.cb) {
			requData.cb(data);
		}
	}
	connected(token) {
		this._requData = null;
		this._connectCount = 0;
		NetMgr.token = token;
		this.isTokenActive = true;
	}
	unconnect() {
		this.isTokenActive = false;
	}
	reconnect() {
		console.log("reconnect...");
		let self = this;
		self._connectCount += 1;
		if (self._connectCount < 3) {
			console.error('net error，try to connect ' + self._connectCount + ' time');
			setTimeout(s => {
				LayaSample.wxMgr.login();
			}, self._connectCount * 1000);
		}
		else {
			self._connectCount = 0;
		}
	}
}
NetMgr.deviceType = 'wxapp';
NetMgr.host = 'https://xcx.wzhekou.com/';
NetMgr.apiKey = '5hPXPgtzrG1mlVpc';
NetMgr.apiSecret = 'TyfhvRlxnKcWO2fS';
NetMgr.token = null;

class ConfigMgr {
	constructor() {
		this.bannerAdID = "235779";
		this.videoAdID = "235786";
		this.NativaAdID = "235784";
		this.interAdID = "";
		this.BosAdID = "";
		this.BlockAdID = "";
		this.packName = "com.ylwl.wstggj.kyx.nearme.gamecenter";
		this.skinCfg = [];
	}
	init() {
	}
	clear3DRes(res, callback) {
		for (let i = 0; i < res.length; ++i) {
			let resource = Laya.loader.getRes(res[i].url);
			if (resource) {
				resource.releaseResource(true);
			}
			else {
			}
			Laya.Loader.clearRes(res[i].url);
		}
	}
	getVideoId() {
		return this.videoAdID;
	}
	getBannerId() {
		return this.bannerAdID;
	}
	getInterId() {
		return this.interAdID;
	}
	getSkinCfg() {
		return this.skinCfg;
	}
	getSkinByIndex(index) {
		return this.skinCfg[index];
	}
	getSkinIndexById(id) {
		for (let i = 0, count = this.skinCfg.length; i < count; ++i) {
			if (id == this.skinCfg[i].id) {
				return i;
			}
		}
		console.error("id not exist config.");
		return -1;
	}
	getNativeAdId() {
		return this.NativaAdID;
	}
	getBlockId() {
		return this.BlockAdID;
	}
	getBoxId() {
		return this.BosAdID;
	}
}

class GameMgr {
	constructor() {
		this._isPlay = false;
		this._isPause = false;
		this._isOver = false;
		this._isPressed = false;
	}
	get isPlay() {
		return this._isPlay;
	}
	set isPlay(value) {
		this._isPlay = value;
	}
	get isOver() {
		return this._isOver;
	}
	set isOver(value) {
		this._isOver = value;
	}
	get isPause() {
		return this._isPause;
	}
	set isPause(value) {
		this._isPause = value;
		Laya.timer.scale = value ? 0 : 1;
	}
	get isPressed() {
		return this._isPressed;
	}
	set isPressed(value) {
		this._isPressed = value;
	}
}

class TweenMgr extends Laya.Script {
	toAlpha(target, alpha, duration, isLoop = false, startAlpha = 1) {
		target.alpha = startAlpha;
		alpha1();
		function alpha1() {
			let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
			Laya.Tween.to(target, { alpha: alpha }, duration, null, handler);
		}
		function alpha2() {
			Laya.Tween.to(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
		}
	}
	toScale(target, scale, duration, isReset, isLoop = false, scaley = scale) {
		target.scaleX = 1;
		target.scaleY = 1;
		scale1();
		function scale1() {
			let handler = isLoop || isReset ? new Laya.Handler(this, scale2) : null;
			Laya.Tween.to(target, { scaleX: scaley, scaleY: scaley }, duration, null, handler);
		}
		function scale2() {
			let handler = isLoop ? new Laya.Handler(this, scale1) : null;
			Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, duration, null, handler);
		}
	}
	toPosition(target, pos, duration, isLoop = false, type = 0) {
		Laya.Tween.clearAll(target);
		let curPos = new Laya.Vector2(target.x, target.y);
		pos1();
		function pos1() {
			if (isLoop) {
				switch (type) {
					case 0:
						var handler = new Laya.Handler(this, pos2);
						break;
					case 1:
						var handler = new Laya.Handler(this, pos3);
						break;
				}
			}
			Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, null, handler);
		}
		function pos2() {
			Laya.Tween.to(target, { x: curPos.x, y: curPos.y }, duration, null, Laya.Handler.create(this, pos1));
		}
		function pos3() {
			target.x = curPos.x;
			target.y = curPos.y;
			pos1();
		}
	}
	fromAlpha(target, alpha, duration, isLoop = false) {
		target.alpha = 1;
		alpha1();
		function alpha1() {
			let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
			Laya.Tween.from(target, { alpha: alpha }, duration, null, handler);
		}
		function alpha2() {
			Laya.Tween.from(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
		}
	}
	fromScale(target, scale, duration, isLoop = false) {
		scale1();
		function scale1() {
			let handler = isLoop ? new Laya.Handler(this, scale2) : null;
			Laya.Tween.from(target, { scaleX: scale, scaleY: scale }, duration, null, handler);
		}
		function scale2() {
			Laya.Tween.from(target, { scaleX: 1, scaleY: 1 }, duration, null, Laya.Handler.create(this, scale1));
		}
	}
}

class BaseAd {
	init() { }
	getBannerCount() { return 0; }
	getBannerItem() { }
	setBannerItem() { }
	showBannerAd() { }
	hideBannerAd() { }
	setBannerAdWidth(width) { }
	setBannerAdTop(top) { }
	getBannerAd() { }
	showVideoAd(category) { }
	getVideoAd() { }
	loadVideoAd() { }
	showInterstitialAd() { }
	getInterstitialAd() { }
}

let self;
class OppoAd extends BaseAd {
	constructor() {
		super(...arguments);
		this._loadBanner = 1;
		this._loadDelay = 0;
		this._loadInterval = 5;
		this.bannerOpen = true;
		this.bannerAdIsOn = false;
		this.bannerInShowScene = false;
		this._videoCallback = null;
		this.lastTime = 0;
		this.loadAdFirst = true;
		this.isHidKey = false;
		this.bannerList = [];
		this._nativaAd = null;
		this._nativeCurrent = null;
	}
	init() {
		this._videoAd = null;
		this._interAd = null;
		this._bannerItem = null;
		this._bannerList = [];
		this._bannerError = 0;
		this._videoCate = -1;
		this._isCreateInter = false;
		self = this;
		this.getVideoAd();
		this.getNativeAd(true);
	}
	loadBannerAd() {
	}
	getBannerCount() {
		return 1;
	}
	getBannerItem() {
		return this._bannerAd;
	}
	setBannerItem() {
	}
	showBannerAd(call = null) {
		if (!this.bannerInShowScene || this.bannerAdIsOn)
			return;
		this.bannerShowedCall = call;
		console.log("显示bannner", this.bannerShowedCall);
		this.getBannerAd();
	}
	hideBannerAd() {
		if (this._bannerAd) {
			this._bannerAd.hide();
		}
	}
	setBannerAdWidth(width) {
	}
	setBannerAdTop(top) {
	}
	getBannerAd() {
		if (!Laya.Browser.onQGMiniGame)
			return;
		if (LayaSample.commonData.isclose)
			return;
		if (!this.bannerOpen)
			return;
		this.bannerOpen = false;
		Laya.timer.once(10000, this, function () {
			this.bannerOpen = true;
		});
		console.log("·········显示bannerad", this._bannerAd);
		let self = this;
		if (this._bannerAd) {
			this._bannerAd.hide();
			this._bannerAd.destroy();
			console.log("banner存在，刪除2", this._bannerAd);
		}
		let bannerAd = window["qg"].createBannerAd({ posId: LayaSample.configMgr.getBannerId(), style: {} });
		this.bannerAdIsOn = true;
		this.bannerShowedCall = null;
		this.isHidKey = false;
		this._bannerAd = bannerAd;
		this._bannerAd.show().then(() => {
			console.log('banner广告展示完成');
			this.bannerAdIsOn = true;
			LayaSample.glEvent.event("ad_show_event", { adtype: "banner" });
			Laya.timer.once(1500, this, function () {
				this.isHidKey = true;
				if (this.bannerShowedCall) {
					this.bannerShowedCall();
				}
			});
		}).catch((err) => {
			console.log('banner广告展示失败', JSON.stringify(err));
			this.bannerAdIsOn = false;
		});
		this._bannerAd.onError(err => {
			console.log("banner广告加载失败", err);
			this.bannerAdIsOn = false;
		});
		this.bannerList[Object.keys(this.bannerList).length + 1] = bannerAd;
	}
	showVideoAd(callback) {
		console.log("调用视频显示");
		let videoAd = this._videoAd;
		if (!videoAd) {
			LayaSample.wxMgr.showToast('暂无视频，请稍后再试', 2000);
			self.getVideoAd();
			LayaSample.commonData.isShow_video = true;
			return;
		}
		if (!LayaSample.commonData.isShow_video) {
			LayaSample.wxMgr.showToast("广告未准备好", 1000);
		}
		this._videoCallback = callback;
		videoAd.show();
	}
	getVideoAd() {
		if (!Laya.Browser.onQGMiniGame)
			return;
		console.log("getVideoAd1");
		if (!window["qg"].createRewardedVideoAd) {
			LayaSample.commonData.existVideoAd = false;
			return;
		}
		console.log("getVideoAd2");
		let videoAd = this._videoAd;
		if (videoAd) {
			videoAd.offLoad(this._onLoadVideo);
			videoAd.offError(this._onErrorVideo);
			videoAd.offClose(this._onCloseVideo);
		}
		console.log("getVideoAd3");
		videoAd = window["qg"].createRewardedVideoAd({ adUnitId: LayaSample.configMgr.getVideoId() });
		console.log("getVideoAd4", videoAd);
		videoAd.onLoad(this._onLoadVideo);
		videoAd.onError(this._onErrorVideo);
		videoAd.onClose(this._onCloseVideo);
		this._videoAd = videoAd;
		console.log("getVideoAd5", videoAd);
		this._videoAd.load();
		console.log("getVideoAd6", videoAd);
	}
	loadVideoAd() {
		if (!this._videoAd)
			return;
		this._videoAd.load();
	}
	_onLoadVideo() {
		console.log('video 加载成功');
		LayaSample.commonData.existVideoAd = true;
		LayaSample.commonData.isShow_video = true;
		LayaSample.glEvent.event("ad_wxdtn_load_event", { adtype: "video", isLoad: true });
	}
	_onErrorVideo(err) {
		console.error('video load error', err);
		LayaSample.commonData.existVideoAd = false;
		LayaSample.commonData.watchVideo = false;
		LayaSample.commonData.isShow_video = false;
		LayaSample.glEvent.event("ad_wxdtn_load_event", { adtype: "video", isLoad: false });
		LayaSample.soundMgr.setMuted(false);
		console.log("Laya.SoundManager.muted", Laya.SoundManager.muted);
	}
	_onCloseVideo(res) {
		LayaSample.commonData.watchVideo = false;
		let isEnded = (res && res.isEnded || res === undefined) ? true : false;
		LayaSample.glEvent.event("ad_video_close_event", { isEnded: isEnded });
		if (isEnded) {
			LayaSample.wxMgr.upViewVideoInfo(1, self._videoCate);
			self.getVideoAd();
		}
		LayaSample.commonData.watchVideo = false;
		LayaSample.soundMgr.setMuted(false);
		console.log("Laya.SoundManager.muted", Laya.SoundManager.muted);
		LayaSample.glEvent.event("ad_wxdtn_video_close_event", { isEnded: isEnded });
	}
	showInterstitialAd() {
	}
	getInterstitialAd() {
	}
	_onLoadInterstitial() {
		console.log('_onLoadInterstitial 加载成功');
		LayaSample.commonData.existInterAd = true;
		LayaSample.glEvent.event("loadAd", { adtype: "inter", isLoad: true });
	}
	_onErrorInterstitial(err) {
		console.error('_onErrorInterstitial 加载错误', err);
		LayaSample.commonData.existInterAd = false;
		LayaSample.glEvent.event("loadAd", { adtype: "inter", isLoad: false });
	}
	_onCloseInterstitial(evt) {
		console.error('_onCloseInterstitial 关闭', evt);
		LayaSample.glEvent.event("ad_inter_close_event", {});
	}
	showNativeAd() {
		let ad = this._nativaAd;
		if (!ad)
			return;
		var adshow = ad.show();
	}
	getNativeAd(bFirst) {
		if (!Laya.Browser.onQGMiniGame)
			return;
		this.firstLoad = false;
		if (!window["qg"].createNativeAd)
			return;
		if (bFirst) {
			let nativeAd = this._nativaAd;
			nativeAd = window["qg"].createNativeAd({ posId: LayaSample.configMgr.getNativeAdId() });
			nativeAd && nativeAd.onLoad(this._onLoadNativestitial);
			this._nativaAd = nativeAd;
			let adLoad = nativeAd.load();
			adLoad && adLoad.then(() => {
				console.log("NativeAd加载成功");
				return;
			}).catch(err => {
				console.log("NativeAd加载失败： ", JSON.stringify(err));
			});
		}
		else {
			let adLoad = this._nativaAd.load();
		}
	}
	_onLoadNativestitial(res) {
		console.log('Native 加载成功', res);
		self.firstLoad = true;
		LayaSample.commonData.existNativeAd = true;
		if (res && res.adList) {
			self._nativeCurrent = res.adList.pop();
			self.lastCurId = self._nativeCurrent;
			self.bloadShow = true;
		}
	}
	_onErrorNativestitial(err) {
		LayaSample.commonData.existNativeAd = false;
	}
	_onCloseNativestitial(evt) {
		LayaSample.commonData.existNativeAd = false;
	}
	reportAdClick() {
		{
			this._nativaAd.reportAdClick({ adId: this.lastCurId.adId.toString() });
			this._nativeCurrent = null;
			this.requestNativeAd();
		}
	}
	reportAdShow() {
		{
			this.bloadShow = false;
			this._bshowNativeAd = true;
			this._nativaAd.reportAdShow({ adId: this.lastCurId.adId.toString() });
		}
		LayaSample.glEvent.event("ad_show_event", { adtype: "native" });
	}
	requestNativeAd() {
		let value = (new Date()).valueOf();
		this.lastTime = value;
		if (this._bshowNativeAd) {
			this._bshowNativeAd = false;
			this.getNativeAd(false);
		}
		if (!this.firstLoad) {
			this.getNativeAd(true);
		}
	}
	requestNative2() {
		if (!this.firstLoad) {
			this.requestNativeAd();
		}
	}
	getCurNativeAd() {
		if (this._nativeCurrent == null) {
			this.requestNativeAd();
		}
		return this._nativeCurrent;
	}
	judgeBanner() {
	}
}

class OppoMgr {
	constructor() {
		this.isCollect = false;
	}
	init() {
		this.preTime = 0;
		this.buttonAuthorize1 = null;
		this._shareStartTime = new Date().getTime() + 86000;
		this._isCreateWxInfoBtn = false;
		console.log("初始化oppomanager");
		if (!Laya.Browser.onQGMiniGame)
			return;
		if (Laya.Browser.onQGMiniGame) {
			let sysInfo = window["qg"].getSystemInfoSync();
			LayaSample.commonData.wxsysInfo = sysInfo;
			console.log("设备信息", sysInfo);
			this.login();
		}
	}
	login() {
		let self = LayaSample.wxMgr;
		let qgg = window["qg"];
		qgg.login({
			success: function (loginRes) {
				let param = {};
				let code = loginRes.token;
				console.log("code", code);
				param.code = code;
				param.pkg_name = LayaSample.configMgr.packName;
				param.channel = 1003;
				console.log("parm内容:", param);
				LayaSample.netMgr.request(LayaSample.netMgr.apiLogin, param, function (res) {
					console.log("登陆返回接口", res);
					if (res.code !== 0) {
						console.error('code login fault. code:' + res);
					}
					else {
						console.log('code 登录成功', res);
						let result = res.result;
						self.setLoginInfo(result);
					}
					LayaSample.glEvent.event("login_success_event");
				});
			},
			fail: function () {
				console.log("fail");
			},
			complete: function () {
				console.log("complete");
			}
		});
	}
	getLaunchOptions() {
		let param = {};
		let launchOptions = LayaSample.commonData.launchOptions;
		if (launchOptions.scene) {
			param.scene_id = launchOptions.scene;
		}
		if (launchOptions.referrerInfo && launchOptions.referrerInfo.appId) {
			param.appid = launchOptions.referrerInfo.appId;
		}
		if (launchOptions.query) {
			if (launchOptions.query.id)
				param.share_user_id = parseInt(launchOptions.query.id);
			if (launchOptions.query.share_id)
				param.share_id = parseInt(launchOptions.query.share_id);
			if (launchOptions.query.channel)
				param.channel = launchOptions.query.channel;
		}
		else if (launchOptions.referrerInfo
			&& launchOptions.referrerInfo.extraData
			&& launchOptions.referrerInfo.extraData.channel) {
			param.channel = launchOptions.referrerInfo.extraData.channel;
		}
		return param;
	}
	setLoginInfo(data) {
		console.log("data", data);
		let shareConfig = data.shareConfig;
		LayaSample.commonData.showRevivalCard = shareConfig.share != 0;
		console.log(" LayaSample.commonData.showRevivalCard = shareConfig.share != 0;", LayaSample.commonData.showRevivalCard);
		LayaSample.commonData.obtain_prop = shareConfig.obtain_prop != 0;
		console.log("LayaSample.commonData.obtain_prop", LayaSample.commonData.obtain_prop);
		console.log("shareConfig.delay", shareConfig.delay);
		LayaSample.commonData.isAdDelay = shareConfig.delay == 1;
		console.log(" LayaSample.commonData.isAdDelay", LayaSample.commonData.isAdDelay);
		LayaSample.commonData.wxappList = {};
		for (const item of data.wxappList) {
			let wxapp = LayaSample.commonData.wxappList[item.category];
			if (!wxapp) {
				wxapp = [];
				LayaSample.commonData.wxappList[item.category] = wxapp;
			}
			if (Laya.Browser.onIOS && item.is_box == 1) {
			}
			else {
				wxapp.push(item);
			}
		}
		console.log("LayaSample.commonData.wxappList", LayaSample.commonData.wxappList);
	}
	settlementLevel(level, score) {
		let gameStatus = LayaSample.storageMgr.getGameStatus();
		let gold = gameStatus.gold;
		let self = this;
		if (gameStatus.maxScore < score) {
			self._submitScroe(score);
		}
		LayaSample.storageMgr.setMaxLevel(level);
		LayaSample.storageMgr.setMaxScore(score);
		let param = {};
		param.max_score = score;
		param.pass = level;
		LayaSample.commonData.userInfo.max_score = score;
		LayaSample.netMgr.request('mmwyy/user/pass', param, function (res) {
			if (res.code == 0) {
				console.log("上传分数成功");
				LayaSample.glEvent.event('updateCoin', {});
			}
			else {
				console.error("上传分数失败：", res);
			}
		});
	}
	showToast(title, duration) {
		if (!window["qg"])
			return;
		let wxx = window["qg"];
		wxx.showToast({
			title: title,
			duration: duration,
		});
	}
	hideToast() {
		if (!window["qg"])
			return;
		window["qg"].hideToast();
	}
	_submitScroe(score) {
	}
	openOtherApp(appid, appCat) {
		const gameCate = LayaSample.commonData.wxappList[appCat];
		let _appPath = "";
		let tepID = -1;
		let adID = -1;
		if (gameCate) {
			for (const item of gameCate) {
				if (item.app_id == appid) {
					tepID = item.wx_id;
					adID = item.ad_id;
					_appPath = item.app_path;
					console.log(item);
					break;
				}
			}
		}
		qg["navigateToMiniGame"]({
			pkgName: appid,
			success: function (res) {
				console.log('跳转小程序成功');
				if (tepID == -1) {
					console.error("click app not find id,for appid:", appid);
					return;
				}
				LayaSample.netMgr.request(LayaSample.netMgr.otherApp, { wx_id: tepID, ad_id: adID, type: 1 }, function (res) {
					if (res.code !== 0) {
						console.error('log goto wxapp fault. code:' + res);
					}
				});
			},
			fail: function () {
				LayaSample.netMgr.request(LayaSample.netMgr.otherApp, { wx_id: tepID, ad_id: adID, type: 0 }, function (res) {
					if (res.code !== 0) {
						console.error('log goto wxapp fault. code:' + res);
					}
				});
			},
			complete: () => {
			}
		});
	}
	getWxappList(cat) {
		var dataList = LayaSample.commonData.wxappList[cat];
		let data = [];
		if (dataList) {
			for (let item of dataList) {
				let newItem = {};
				newItem.app_img = item.app_img;
				newItem.app_id = item.app_id;
				newItem.category = item.category;
				newItem.weight = item.weight;
				data.push(newItem);
			}
			data.sort((a, b) => a.weight - b.weight);
		}
		return data;
	}
	upViewVideoInfo(ad_status, cate) {
	}
	playVibrateShort() {
		if (!Laya.Browser.onQGMiniGame)
			return;
		if (!LayaSample.storageMgr.isPlayVibrate())
			return;
		window["qg"].vibrateShort({
			success: function () {
			},
			fail: function () {
			},
			complete: function () {
			}
		});
	}
	playVibrateLong() {
		if (!Laya.Browser.onQGMiniGame)
			return;
		if (!LayaSample.storageMgr.isPlayVibrate())
			return;
		window["qg"].vibrateLong({
			success: function () {
			},
			fail: function () {
			},
			complete: function () {
			}
		});
	}
	collectGame() {
		if (!Laya.Browser.onQGMiniGame)
			return;
		qg["installShortcut"]({
			success: function (res) {
				LayaSample.storageMgr.setShowCollDate();
				LayaSample.storageMgr.setCollect(true);
				LayaSample.commonData.isCollect = false;
			},
			fail: function (res) {
				LayaSample.commonData.isCollect = true;
				LayaSample.storageMgr.setShowCollDate();
			},
			complete: function () {
				LayaSample.storageMgr.setShowCollDate();
				if (LayaSample.commonData.isCollect)
					LayaSample.wxMgr.showToast("图标已经创建", 1000);
			}
		});
	}
}

class commonData {
	constructor() {
		this.newScore = 1;
		this.newLevel = 1;
		this.goonCount = 0;
		this.isGame = false;
		this.isSleep = false;
		this.watchVideo = false;
		this.watchInter = false;
		this.useTime = 1000;
		this.gameList = null;
		this.isPass = false;
		this.needWxAuthorize = false;
		this.userInfo = {};
		this.existInterAd = false;
		this.existVideoAd = false;
		this.existBannerAd = false;
		this.existNativeAd = false;
		this.isNoAds = false;
		this.adTime = 1000;
		this.tipShowLittle = false;
		this.latencyTime = 900;
		this.moveTime = 1000;
		this.topView = "";
		this.currentVersion = "1";
		this.shareInfo = {};
		this.launchOptions = {};
		this.wxappList = {};
		this.wxsysInfo = {};
		this.roleSkinList = [];
		this.pillarSkinList = [];
		this.roleSkinIndex = 0;
		this.skinGameCount = 0;
		this.signin = null;
		this.isCheckSignin = false;
		this.lateWay = 0;
		this.needShowGuide = false;
		this.bikeComps = [];
		this.gameCount = 0;
		this.isShowSkin = false;
		this.skinIncome = 0;
		this.skinScore = 0;
		this.font_switch = false;
		this.showRevivalCard = false;
		this.nativeAdsFT = false;
		this.recordDataexit = true;
		this.startRecord = false;
		this.qq_GameStart = false;
		this.qq_ScoretoGold = 50;
		this.qq_RecordGold = 200;
		this.qq_signin_GoldList = [20, 40, 60, 80, 100, 120, 300];
		this.qq_skinRandomGold = [300, 500, 1000, 2000, 3000, 4000, 5000, 5000, 10000];
		this.qq_skinVideoReward = 300;
		this.qq_skinVideoMaxNum = 20;
		this.qq_skinMaxItem = 9;
		this.qq_lockerSkinList = [];
		this.isShowBox = false;
		this.gameStartCount = 0;
		this.isResetPlayer = false;
		this.isShowColorSign = false;
		this.gameCompleteTime = 0;
		this.isAdDelay = false;
		this.isShareGame = false;
		this.showNormalTip = false;
		this.obtain_prop = false;
		this.isLoginSucess = false;
		this.isclose = true;
		this.isCollect = false;
		this.isShow_video = false;
		this.isDie = true;
	}
}
;

class LayaSample {
	static get gameMgr() {
		return this._gameMgr;
	}
	static get glEvent() {
		return this._eventListener;
	}
	static get soundMgr() {
		if (this._soundMgr === undefined) {
			this._soundMgr = new SoundMgr;
		}
		return this._soundMgr;
	}
	static get storageMgr() {
		if (this._storageMge === undefined) {
			this._storageMge = new StorageMgr;
		}
		return this._storageMge;
	}
	static get netMgr() {
		return this._netMgr;
	}
	static get commonData() {
		return this._commonData;
	}
	static get utils() {
		return this._utils;
	}
	static get tweenMgr() {
		return this._tweenMgr;
	}
	static get configMgr() {
		if (this._configMgr === undefined) {
			this._configMgr = new ConfigMgr;
		}
		return this._configMgr;
	}
	static get adMgr() {
		if (this._adMgr === undefined) {
			this._adMgr = this.wxAd;
		}
		return this._adMgr;
	}
	static set adMgr(value) {
		this._adMgr = value;
	}
	static get wxMgr() {
		if (this._wxMgr === undefined) {
			this._wxMgr = new OppoMgr;
		}
		return this._wxMgr;
	}
	static get wxAd() {
		if (this._wxAd === undefined) {
			this._wxAd = new OppoAd;
		}
		return this._wxAd;
	}
	static autoSaveOfflineTime() {
		LayaSample.storageMgr.qq_SaveNowGameTime();
		Laya.timer.loop(30000, this, this.saveOfflineTime);
	}
	static saveOfflineTime() {
		LayaSample.storageMgr.qq_SaveNowGameTime();
	}
}
LayaSample._eventListener = new Laya.EventDispatcher;
LayaSample._gameMgr = new GameMgr;
LayaSample._netMgr = new NetMgr;
LayaSample._utils = new Utils;
LayaSample._tweenMgr = new TweenMgr;
LayaSample._commonData = new commonData;
LayaSample.screen = {
	realPxRatio: 0,
	offsetTop: 0,
	allScreen: false
};

class BVHdla extends Laya.Scene {
	constructor() {
		super();
		this._maxBottom = 300;
		this._minBottom = 60;
		this.bannerSceneUrl = {};
	}
	onAwake() {
		this.initData();
		this.initUI();
		this.initEvent();
		this.initEventBase();
		this.initSize();
		this.initBanner();
		Laya.timer.once(60000, this, this.showBanner);
	}

	onOpened(data) {
	}
	onClosed() {
		Laya.timer.clearAll(this);
		LayaSample.glEvent.offAllCaller(this);
	}
	initData() {
		this._isOpen = true;
		LayaSample.commonData.topView = this.url;
	}
	initUI() { }
	initEvent() { }
	initEventBase() {
		LayaSample.glEvent.on("ad_load_event", this, this.onLoadAdEvent);
		LayaSample.glEvent.on("ad_show_event", this, this.onShowAdEvent);
	}
	getChild(name, object) {
		if (!object)
			object = this;
		return object.getChildByName(name);
	}
	initSize() {
		let view = this;
		view.height = Laya.stage.height;
		let offsetTop = LayaSample.screen.offsetTop;
		let pixelRatio = LayaSample.screen.realPxRatio;
		let sysInfo = LayaSample.commonData.wxsysInfo;
		let btm = 0;
		for (let index = 0; index < view.numChildren; index++) {
			let node = view["_children"][index];
			let posY = node.y + offsetTop;
			if (node.name == 'topPanel') {
			}
			node.y = posY;
			if (node.name == 'bottomPanel' || node.name == "bottomui") {
				btm = LayaSample.commonData.isAdDelay && node.name == 'bottomPanel' ? this._minBottom : this._maxBottom;
				node.bottom = btm;
			}
		}
	}
	showBanner() {
		console.log("60秒后显示广告");
		LayaSample.commonData.isclose = false;
	}
	initBanner() {
		if (this.url === "qq_views/qq_HomeView.scene") {
			console.log("显示banner！！！！！！！！！！！！！！！", this.url);
			LayaSample.wxAd.bannerInShowScene = true;
			this.refreshBannerAd();
		}
		else {
			LayaSample.wxAd.bannerInShowScene = false;
		}
	}
	refreshBannerAd() {
		if (LayaSample.commonData.isAdDelay) {
			Laya.timer.clear(this, this.reappearBannerAd);
			Laya.timer.once(LayaSample.commonData.latencyTime, this, this.reappearBannerAd);
		}
		else {
			this.reappearBannerAd();
		}
	}
	reappearBannerAd() {
		if (this.url == "qq_views/dy_SkinView.scene" || this.url == "qq_views/qq_TrySkinFree.scene" || this.url == "qq_views/qq_ResurrectView.scene") {
			return;
		}
		LayaSample.adMgr.showBannerAd();
	}
	resetBannerAd() {
		let banner = LayaSample.adMgr.getBannerItem();
		if (!banner)
			return;
		let beforeWidth = banner.width;
		let beforeHeight = banner.height;
		let clientWidth = Laya.Browser.clientWidth;
		let laterHeight = clientWidth * beforeHeight / beforeWidth;
		if (beforeWidth == clientWidth)
			return;
		this._isResizeAd = true;
		LayaSample.adMgr.setBannerAdWidth(clientWidth);
	}
	tweenAd(addHeight = 0) {
		if (!LayaSample.commonData.isAdDelay)
			return;
		let bnHeight = 130 + addHeight;
		let pxRatio = LayaSample.screen.realPxRatio;
		let realAdHeight = Math.floor(bnHeight * pxRatio);
		if (this.url === "qq_views/qq_ResurrectView.scene" || this.url === "qq_views/qq_TrySkinFree.scene") {
			realAdHeight = 270;
		}
		for (let i = 0; i < this.numChildren; ++i) {
			let view = this.getChildAt(i);
			if (view.name == "bottomPanel") {
				if (bnHeight && view.bottom < realAdHeight) {
					Laya.Tween.to(view, { bottom: realAdHeight }, LayaSample.commonData.moveTime, Laya.Ease.expoInOut, Laya.Handler.create(this, () => { }), 0, true);
				}
			}
			if (view.name == "middlePanel" && bnHeight) {
				let heightCont = view.y + view.height + realAdHeight;
				if (heightCont > Laya.stage.height) {
					view.y = view.y - (heightCont - Laya.stage.height);
				}
			}
		}
	}
	onLoadAdEvent(event) {
		switch (event.adtype) {
			case "video":
				if (!event.isLoad) {
				}
				break;
			case "banner":
				if (event.isLoad) {
				}
				break;
			default:
				break;
		}
	}
	onShowAdEvent(evt) {
		console.log("``````````", evt);
		switch (evt.adtype) {
			case "video":
				break;
			case "banner":
				this.tweenAd(100);
				break;
			case "native":
				this.tweenAd(260);
				break;
			default:
				break;
		}
	}
}

class dy_SkinItem extends Laya.Box {
	constructor() {
		super();
		this.icon = null;
		this.init();
	}
	onDisable() {
	}
	init() {
		let prefab = Laya.loader.getRes("qqPrefab/qq_skinItems.json");
		let item = Laya.Pool.getItemByCreateFun("qq_SkinItem", prefab.create, prefab);
		this.ImgChoose = item.getChildByName("choose");
		this.ImgSkinImage = item.getChildByName("skinImage");
		this.ImgLocker = item.getChildByName("locker");
		this.lbLevelTips = item.getChildByName("level");
		this.addChild(item);
	}
	setItem(_data) {
		this.data = _data;
		this.lbLevelTips.text = "" + this.data.index;
		this.ImgSkinImage.skin = "skin/pf" + (this.data.index) + "_ui.png";
		this.ImgLocker.visible = this.data.lockType;
		this.ImgChoose.visible = this.data.chooseType;
	}
}

class QQ_SkinView extends BVHdla {
	constructor() {
		super(...arguments);
		this.renderCount = 0;
		this.lockerSkin = [];
		this.buyGold = 0;
		this.rewardGold = 0;
		this.chooseID = 0;
		this.chooseSkinID = 0;
		this.isPlayAni = false;
		this.chooseAniTimes = 10;
	}
	onAwake() {
		super.onAwake();
	}
	initUI() {
		CurSence.curSence = "QQ_SkinView";
		Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
		this.btnBack = this.getChild("btnBack");
		this.btnBuy = this.getChild("btnBuy");
		this.btnVideo = this.getChild("btnVideo");
		this.lbBuyGold = this.getChild("lblPrice", this.btnBuy);
		this.lbVideoGold = this.getChild("lblLimit", this.btnVideo);
		this.ImgSkinIcon = this.getChild("skinIcon");
		this.skinList = this.getChild("skinList");
		Laya.loader.load("qqPrefab/qq_skinItems.json", Laya.Handler.create(this, this.initList), null, Laya.Loader.PREFAB);
		this.skin_InitData();
		this.initShouZhi();//皮肤界面添加小手指
		if (!LayaSample.commonData.existVideoAd)
			LayaSample.adMgr.loadVideoAd();
	}
	onKeyUp(e) {
		if (CurSence.curSence != "QQ_SkinView") {
			return;
		}
		switch (e.keyCode) {
			case 8:
			case 4:
				this.close();
				CurSence.curSence = "qq_HomeView";
				break;
			case 38:
			case 19://上
				this.changeFocusUp();
				break;
			case 40:
			case 20://下
				this.changeFocusDown();
				break;
			case 37:
			case 21://左
				this.changeFocusLeft();
				break;
			case 39:
			case 22://右
				this.changeFocusRight();
				break;
			case 13:
			case 23:
			case 66:
				if (this.btnBuy.focus) {
					this.onBuyRandomSkinClick();
				}else if(this.btnBack.focus){
					this.close();
					CurSence.curSence="QQ_SkinView";
				}
				break;
		}
	}

	movePointer(toIndex) {
		this.onSelect(toIndex);
		this.btnSz.pos(this.skinList.x + this.cellArray[this.chooseID].x + 80, this.cellArray[this.chooseID].y + 80);
		this.btnBuy.focus = false;
		this.btnBack.focus = false;
		this.skinList.refresh();
	}
	resetPointer() {
		this.btnSz.pos(this.defaultPointerX, this.defaultPointerY);
		this.btnBuy.focus = true;
		this.btnBack.focus = false;
	}
	movePointerToBackBtn() {
		this.btnSz.pos(this.btnBack.x + 50, this.btnBack.y + 50);
		this.btnBuy.focus = false;
		this.btnBack.focus = true;
	}
	changeFocusUp() {
		if (this.btnBuy.focus) {
			this.movePointer(6);
		} else if (this.btnBack.focus) {
			this.resetPointer();
		} else {
			if (this.chooseID < 3) {
				this.resetPointer();
			} else {
				this.movePointer(this.chooseID - 3);
			}
		}
	}
	changeFocusDown() {
		if (this.btnBuy.focus) {
			this.movePointer(0);
		} else if (this.btnBack.focus) {
			this.resetPointer();
		} else {
			if (this.chooseID < 6) {
				this.movePointer(this.chooseID + 3);
			} else {
				this.resetPointer();
			}
		}
	}
	changeFocusLeft() {
		if (this.btnBuy.focus) {
			this.movePointerToBackBtn();
		} else if (this.btnBack.focus) {
			this.movePointer(2);
		} else {
			if (this.chooseID % 3 == 2 || this.chooseID % 3 == 1) {
				this.movePointer(this.chooseID - 1);
			} else if (this.chooseID % 3 == 0) {
				this.movePointerToBackBtn();
			}
		}
	}
	changeFocusRight() {
		if (this.btnBuy.focus) {
			this.movePointerToBackBtn();
		} else if (this.btnBack.focus) {
			this.movePointer(0);
		} else {
			if (this.chooseID % 3 == 0 || this.chooseID % 3 == 1) {
				this.movePointer(this.chooseID + 1);
			} else if (this.chooseID % 3 == 2) {
				this.movePointerToBackBtn();
			}
		}
	}
	//皮肤界面添加小手指
	initShouZhi() {
		var btnBuyx = parseInt(this.btnBuy.x);//随机解锁按钮的x
		var btnBuyy = parseInt(this.btnBuy.y);//随机解锁按钮的y
		this.btnBuy.focus = true;
		this.btnBack.focus = false;
		this.defaultPointerX = btnBuyx + 250;
		this.defaultPointerY = btnBuyy + 38;
		this.btnSz = new Laya.Image("res/sz.png");
		this.btnSz.scaleX = 0.3;
		this.btnSz.scaleY = 0.3;
		this.btnSz.pos(this.defaultPointerX, this.defaultPointerY);
		this.addChild(this.btnSz);

	}
	skin_InitData() {
		if (LayaSample.commonData.qq_lockerSkinList.length == 0) {
			this.btnBuy.visible = false;
		}
		this.chooseID = LayaSample.storageMgr.qq_GetNowSkinID();
		var skinId = this.chooseID;
		this.ImgSkinIcon.skin = "skin/pf" + (skinId) + "_ui.png";
		var buyGoldLevel = LayaSample.storageMgr.qq_GetSkinRandomLevel() < LayaSample.commonData.qq_skinRandomGold.length ?
			LayaSample.storageMgr.qq_GetSkinRandomLevel() : LayaSample.commonData.qq_skinRandomGold.length - 1;
		this.buyGold = LayaSample.commonData.qq_skinRandomGold[buyGoldLevel];
		this.lbBuyGold.text = this.buyGold + "";
		this.rewardGold = LayaSample.commonData.qq_skinVideoReward;
		this.lbVideoGold.text = "+" + this.rewardGold + "";
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnBack, this, this.cancelClick);
		// LayaSample.utils.addClickEvent(this.btnBuy, this, this.onBuyRandomSkinClick);
		LayaSample.utils.addClickEvent(this.btnVideo, this, this.onRewardGold);
		LayaSample.glEvent.on("ad_video_close_event", this, this.onVideoCloseEvent);
	}
	onBuyRandomSkinClick() {
		console.log(">--onBuyRandomSkinClick");
		if (this.isPlayAni)
			return;
		if (LayaSample.storageMgr.GetGold() < this.buyGold) {
			LayaSample.wxMgr.showToast("金币不足!", 2000);
			return;
		}
		if (LayaSample.commonData.qq_lockerSkinList.length > 0) {
			var unLockSkinNum = Math.floor(Math.random() * LayaSample.commonData.qq_lockerSkinList.length);
			this.chooseSkinID = LayaSample.commonData.qq_lockerSkinList[unLockSkinNum];
			LayaSample.storageMgr.qq_AddUnLockSkinList(this.chooseSkinID);
			LayaSample.storageMgr.addGold(-this.buyGold);
			LayaSample.storageMgr.qq_AddRandomLevel();
			this.chooseAniTimes = 10;
			this.isPlayAni = true;
			Laya.timer.loop(100, this, this.chooseSkinAni);
		}
		console.log("lockerSkin_", LayaSample.commonData.qq_lockerSkinList, LayaSample.storageMgr.qq_GetUnLockSkinList());
		if (LayaSample.commonData.qq_lockerSkinList.length == 0)
			this.btnBuy.visible = false;
		this.skinList.refresh();
	}
	chooseSkinAni() {
		this.chooseAniTimes--;
		var skinID = 0;
		if (this.chooseAniTimes > 0) {
			var unLockSkinNum = Math.floor(Math.random() * LayaSample.commonData.qq_lockerSkinList.length);
			skinID = LayaSample.commonData.qq_lockerSkinList[unLockSkinNum];
			this.onSelect(skinID);
		}
		else {
			this.isPlayAni = false;
			LayaSample.wxMgr.showToast("恭喜你获得新皮肤!", 800);
			Laya.timer.clear(this, this.chooseSkinAni);
			var skinID = this.chooseSkinID;
			LayaSample.commonData.qq_lockerSkinList.splice(LayaSample.commonData.qq_lockerSkinList.indexOf(skinID), 1);
			var buyGoldLevel = LayaSample.storageMgr.qq_GetSkinRandomLevel() < LayaSample.commonData.qq_skinRandomGold.length ?
				LayaSample.storageMgr.qq_GetSkinRandomLevel() : LayaSample.commonData.qq_skinRandomGold.length - 1;
			this.buyGold = LayaSample.commonData.qq_skinRandomGold[buyGoldLevel];
			this.lbBuyGold.text = this.buyGold + "";
			this.data[skinID].lockType = false;
			this.onSelect(skinID);
		}
		this.skinList.refresh();
	}
	onRewardGold() {
		if (this.isPlayAni)
			return;
		if (LayaSample.storageMgr.qq_GetSkinVideoMaxNum() > 0) {
			if (Laya.Browser.onPC) {
				this.getVideoReward();
				return;
			}
			LayaSample.adMgr.showVideoAd(0);
		}
		else {
			LayaSample.wxMgr.showToast("今天视频次数已经用完!", 2000);
		}
	}
	onVideoCloseEvent(evt) {
		if (!evt.isEnded) {
			LayaSample.wxMgr.showToast("未观看完视频", 2000);
		}
		else {
			this.getVideoReward();
		}
	}
	getVideoReward() {
		LayaSample.storageMgr.addGold(this.rewardGold);
	}
	cancelClick() {
		if (this.isPlayAni)
			return;
		if (this.data[this.chooseID].lockType == false) {
			console.log("从皮肤界面返回首页", this.chooseID);
			LayaSample.storageMgr.qq_SaveNowSkinID(this.chooseID);
			LayaSample.glEvent.event("change_skin_event", { index: this.chooseID });
		}
		LayaSample.commonData.isNoAds = false;
		Laya.Scene.open("qq_views/qq_HomeView.scene", false, Laya.Handler.create(this, v => {
			this.close();
		}));
	}
	initList() {
		let list = this.skinList;
		list.itemRender = dy_SkinItem;
		list.vScrollBarSkin = "";
		list.selectEnable = true;
		this.cellArray = [];
		// list.mouseHandler = new Laya.Handler(this, this.onSelect);
		list.renderHandler = new Laya.Handler(this, this.updateItem);
		var num = LayaSample.commonData.qq_skinMaxItem;
		this.data = new Array();
		this.renderedCellNum = num;
		var unlockerList = LayaSample.storageMgr.qq_GetUnLockSkinList();
		for (var i = 0; i < num; i++) {
			var islock = true;
			if (unlockerList.indexOf(i) != -1) {
				islock = false;
			}
			var isChoose = false;
			if (i == LayaSample.storageMgr.qq_GetNowSkinID()) {
				isChoose = true;
			}
			var itemdata = { index: i, lockType: islock, chooseType: isChoose };
			this.data.push(itemdata);
		}
		this.renderCount = list.repeatX * list.repeatY;
		list.array = this.data;
		this.skinList.refresh();

	}
	onSelect(index) {
		if (index < 0)
			return;
		var unlockerList = LayaSample.storageMgr.qq_GetUnLockSkinList();
		if (unlockerList.indexOf(index) != -1) {
			LayaSample.storageMgr.qq_SaveNowSkinID(index);
		} else {
			console.log("皮肤未解锁! [" + index + "]");
		}
		if (this.chooseID != index) {
			this.data[this.chooseID].chooseType = false;
			this.data[index].chooseType = true;
			this.chooseID = index;
		}
		this.ImgSkinIcon.skin = "skin/pf" + (index) + "_ui.png";
		this.skinList.selectedIndex = -1;
	}
	updateItem(cell) {
		if (this.renderedCellNum > 0) {
			this.cellArray.push(cell);
			this.renderedCellNum--;
		}
		cell.setItem(cell.dataSource);
	}
}

class newGuide extends BVHdla {
	onAwake() {
		super.onAwake();
	}
	initUI() {
		this.newGui.visible = true;
	}
	initEvent() {
		Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouserDown);
	}
	mouserDown() {
		LayaSample.glEvent.event("play_game_event");
		this.close();
		Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouserDown);
	}
}

class qq_goleView extends BVHdla {
	onAwake() {
		super.onAwake();
	}
	initUI() {
		this.goldBox = this.getChildByName("topPanel");
		this.goldLabel = this.goldBox.getChildByName("goldLabel");
	}
	initEvent() {
		LayaSample.glEvent.on("GOLD_ADD", this, this.switchGold);
		LayaSample.glEvent.on("SHOW_GOLDBOX", this, this.goldBoxShow);
		LayaSample.glEvent.on("HIDE_GOLDBOX", this, this.goldBoxHide);
		this.switchGold();
	}
	goldBoxShow() {
		this.goldBox.visible = true;
	}
	goldBoxHide() {
		this.goldBox.visible = false;
	}
	switchGold() {
		console.log("刷新金币:", LayaSample.storageMgr.GetGold());
		this.goldLabel.text = LayaSample.storageMgr.GetGold() + "";
	}
}

class qq_HomeView extends BVHdla {
	constructor() {
		super(...arguments);
		this.soundSkin = "ui/qq_ui/homeView/btn_shengying_";
		this.vibrateSkin = "ui/qq_ui/homeView/btn_zhengdong_";
		this.isSkinClick = false;
		this.exitDialogShow = false;
	}
	onAwake() {
		super.onAwake();
		if (LayaSample.adMgr.getBannerCount() < 2) {
			console.log("LayaSample.adMgr.getBannerCount()", LayaSample.adMgr.getBannerCount());
			LayaSample.adMgr.getBannerAd();
		}
		LayaSample.soundMgr.playBGM();
		if (LayaSample.commonData.obtain_prop) {
			this.setWxapp(0);
			this.setWxapp(1);
			this.setWxapp(2);
			this.setWxapp(3);
		}
	}
	initUI() {
		console.log(">--打开首页");
		CurSence.curSence = "qq_HomeView";
		Laya.stage.offAll(Laya.Event.KEY_UP);
		Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
		let topPanel = this.getChild("topPanel");
		let bottomPanel = this.getChild("bottomui");
		this.btnSound = this.getChild("btnSound", topPanel);
		this.setSound(LayaSample.storageMgr.isPlaySound());
		this.btnVibrate = this.getChild("btnVibrate", topPanel);
		this.setVibrate(LayaSample.storageMgr.isPlayVibrate());
		this.btnGameL = this.getChild("button_GameL", topPanel);
		this.btnGameR = this.getChild("button_GameR", topPanel);
		this.btnGameL2 = this.getChild("btnGameL2", topPanel);
		this.btnGameR2 = this.getChild("btnGameR2", topPanel);
		this.btnGameL.visible = false;
		this.btnGameR.visible = false;
		this.btnGameL2.visible = false;
		this.btnGameR2.visible = false;
		this.btnPlay = this.getChild("btnPlay", bottomPanel);
		this.btnPlayX = parseInt(this.btnPlay.x);
		this.btnPlayY = parseInt(this.btnPlay.y);
		this.btnOffsetPointX = 80;
		this.btnOffsetPointY = 30;
		this.btnPointer = new Laya.Image("res/sz.png");
		this.btnPointer.scaleX = 0.3;
		this.btnPointer.scaleY = 0.3;
		this.btnPointer.pos(this.btnPlayX + this.btnOffsetPointX, this.btnPlayY + this.btnOffsetPointY);
		bottomPanel.addChild(this.btnPointer);
		this.focusView = "btnPlay";
		this.btnRank = this.getChild("btnRank", bottomPanel);
		this.btnSkin = this.getChild("btnSkin", bottomPanel);
		this.btnSkinX = parseInt(this.btnSkin.x);
		this.btnSkinY = parseInt(this.btnSkin.y);
		this.btnSiginIn = this.getChild("btnSiginIn", bottomPanel);
		this.btnSignX = parseInt(this.btnSiginIn.x);
		this.btnSignY = parseInt(this.btnSiginIn.y);
		this.btnShare = this.getChild("btnShare", bottomPanel);
		this.btnMore = this.getChild("btnMore", bottomPanel);
		this.btnCollect = this.getChild("btnCollect", bottomPanel);
		this.qq_UpdateData();
	}
	hideExitDialog() {
		this.exitDialogShow = false;
		this.exitDialog.close();
	}
	showExitDialog() {
		this.exitDialog = new Laya.Dialog();
		var bg = new Laya.Image("res/bg_exit.png");
		this.exitDialog.addChild(bg);
		let btnConfirm = new Laya.Image("res/confirm.png");
		btnConfirm.pos(18, 285);
		this.exitDialog.addChild(btnConfirm);


		let btnCancel = new Laya.Image("res/cancel.png");
		btnCancel.pos(195, 285);
		this.exitDialog.addChild(btnCancel);

		this.btnSz = new Laya.Image("res/sz.png");
		this.btnSz.scaleX = 0.3;
		this.btnSz.scaleY = 0.3;
		this.btnSz.pos(100, 300);
		this.exitDialog.addChild(this.btnSz);
		this.exitDialog.popup();
		this.exitDialogShow = true;
	}
	onKeyUp(e) {
		if (CurSence.curSence != "qq_HomeView") {
			return;
		}
		if (this.exitDialogShow) {
			switch (e.keyCode) {
				case 37:
				case 21:
				case 39:
				case 22:
					if (this.btnSz.x == 260) {
						this.btnSz.pos(100, 300);
					} else {
						this.btnSz.pos(260, 300);
					}
					break;
				case 13:
				case 23:
				case 66:
					this.hideExitDialog();
					if (this.btnSz.x == 100) {//确定
						if (window["PlatformClass"] != null) {
							let platform = window["PlatformClass"].createClass('cn.popapps.game.JSBridge');
							platform.call("exit");
						} else {
							console.log("NO Platform");
						}
					}

					break;
			}
		} else {
			switch (e.keyCode) {
				case 8:
				case 4:
					this.showExitDialog();
					break;
				case 13:
				case 23:
				case 66:
					this.onBtnClick();
					break;
				case 37:
				case 21://左
					this.changeFocus(false);
					break;
				case 39:
				case 22://右
					this.changeFocus(true);
					break;
			}
		}
	}
	changeFocus(toRight) {
		if (toRight) {
			if (this.focusView == "btnPlay") {
				this.focusView = "btnSkin";
				this.btnPointer.pos(this.btnSkinX + this.btnOffsetPointX, this.btnSkinY + this.btnOffsetPointY);
			} else if (this.focusView == "btnSkin") {
				this.focusView = "btnSign";
				this.btnPointer.pos(this.btnSignX + this.btnOffsetPointX, this.btnSignY + this.btnOffsetPointY);
			} else {
				this.focusView = "btnPlay";
				this.btnPointer.pos(this.btnPlayX + this.btnOffsetPointX, this.btnPlayY + this.btnOffsetPointY);
			}
		} else {
			if (this.focusView == "btnPlay") {
				this.focusView = "btnSign";
				this.btnPointer.pos(this.btnSignX + this.btnOffsetPointX, this.btnSignY + this.btnOffsetPointY);
			} else if (this.focusView == "btnSkin") {
				this.focusView = "btnPlay";
				this.btnPointer.pos(this.btnPlayX + this.btnOffsetPointX, this.btnPlayY + this.btnOffsetPointY);
			} else {
				this.focusView = "btnSkin";
				this.btnPointer.pos(this.btnSkinX + this.btnOffsetPointX, this.btnSkinY + this.btnOffsetPointY);
			}
		}
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnVibrate, this, this.onVibrateClick);
		LayaSample.utils.addClickEvent(this.btnSound, this, this.onSoundClick);
		LayaSample.utils.addClickEvent(this.btnMore, this, this.onMoreClick);
		LayaSample.utils.addClickEvent(this.btnCollect, this, this.onCollectClick);
		LayaSample.utils.addClickEvent(this.btnGameL, this, this.onWxgameClick);
		LayaSample.utils.addClickEvent(this.btnGameR, this, this.onWxgameClick);
		this.btnGameL2 && LayaSample.utils.addClickEvent(this.btnGameL2, this, this.onWxgameClick);
		this.btnGameR2 && LayaSample.utils.addClickEvent(this.btnGameR2, this, this.onWxgameClick);
	}
	onBtnClick() {
		if (this.focusView == "btnPlay") {
			this.onPlayGameClick();
		} else if (this.focusView == "btnSkin") {
			this.onSkinClick();
		} else {
			this.onSiginInClick();
		}
	}
	onPlayGameClick() {
		Laya.Scene.open("qq_views/qq_TrySkinFree.scene", false, Laya.Handler.create(this, v => {
			this.close();
		}));
	}
	setSound(status) {
		let statusStr = status ? "kai.png" : "guan.png";
		this.btnSound.skin = this.soundSkin + statusStr;
		Laya.SoundManager.muted = !status;
		LayaSample.storageMgr.setPlaySound(status);
	}
	setVibrate(status) {
		let statusStr = status ? "kai.png" : "guan.png";
		this.btnVibrate.skin = this.vibrateSkin + statusStr;
		LayaSample.storageMgr.setPlayVibrate(status);
	}
	onWxgameClick(event) {
		let appid = event.target.appData.appid;
		console.log("点击其他小程序");
		console.log("222其他小程序" + appid);
		if (appid && appid != '')
			LayaSample.wxMgr.openOtherApp(appid, event.target.appData.appIndex);
		else
			console.log("appid error.");
	}
	onSoundClick() {
		this.setSound(!LayaSample.storageMgr.isPlaySound());
	}
	onVibrateClick() {
		this.setVibrate(!LayaSample.storageMgr.isPlayVibrate());
	}
	onCollectClick() {
		LayaSample.wxMgr.collectGame();
	}
	onSkinClick() {
		console.log("打开皮肤页");
		if (this.isSkinClick == true)
			return;
		this.isSkinClick = true;
		let data = {};
		data.target = "qq_views/qq_HomeView.scene";
		Laya.Scene.open("qq_views/dy_SkinView.scene", false, data, Laya.Handler.create(this, v => {
			LayaSample.adMgr.hideBannerAd();
			this.isSkinClick = false;
			// this.close();
		}));
	}
	onSiginInClick() {
		console.log("打开签到页");
		LayaSample.adMgr.hideBannerAd();
		let data = {};
		data.target = "qq_views/qq_HomeView.scene";
		Laya.Scene.open("qq_views/qq_SiginIn.scene", false, data, Laya.Handler.create(this, v => {
			// this.close();
		}));
	}
	onMoreClick() {
		console.log("盒子广告");
	}
	tweenScale(target, tweenTimer) {
		target.scaleX = 1;
		target.scaleY = 1;
		Laya.Tween.to(target, { scaleX: 1.1, scaleY: 1.1 }, 500, null, Laya.Handler.create(this, this.tweenScale2, [target]));
	}
	tweenScale2(target) {
		Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, this.tweenScale, [target, null]));
	}
	qq_UpdateData() {
		var list = LayaSample.storageMgr.qq_GetUnLockSkinList();
		for (var i = 0; i < LayaSample.commonData.qq_skinMaxItem; i++) {
			if (list.indexOf(i) == -1) {
				LayaSample.commonData.qq_lockerSkinList.push(i);
			}
		}
		var dataTime = new Date().getDate();
		if (dataTime != LayaSample.storageMgr.qq_GetSiginDayTime()) {
			LayaSample.storageMgr.qq_SaveNowDayTime();
			LayaSample.storageMgr.qq_ResetSkinVideoMaxNum();
		}
		if (dataTime != LayaSample.storageMgr.qq_GetSiginDayTime()) {
			LayaSample.storageMgr.qq_SetNotSignin(true);
		}
	}
	OpenFirstView() {
		LayaSample.commonData.qq_GameStart = true;
		var offlineTime = Date.now() - LayaSample.storageMgr.qq_GetOffLineTime();
		if (LayaSample.storageMgr.qq_GetOffLineTime() != 0 && offlineTime > 60000) {
			LayaSample.autoSaveOfflineTime();
			LayaSample.storageMgr.qq_SaveNowGameTime();
		}
		else {
			console.log("记录登陆时间");
			LayaSample.autoSaveOfflineTime();
		}
	}
	setWxapp(appIndex) {
		let appList = LayaSample.wxMgr.getWxappList(0);
		if (!appList)
			return;
		let appCount = appList.length;
		if (appCount == 0)
			return;
		if (!appList[appIndex])
			return;
		let appData = { appid: appList[appIndex].app_id, appIndex: 0 };
		let btnGame = null;
		switch (appIndex) {
			case 0:
				btnGame = this.btnGameL;
				break;
			case 1:
				btnGame = this.btnGameR;
				break;
			case 2:
				btnGame = this.btnGameL2;
				break;
			case 3:
				btnGame = this.btnGameR2;
				break;
			default: return;
		}
		if (btnGame == null)
			return;
		btnGame.visible = true;
		btnGame.skin = appList[appIndex].app_img;
		btnGame.appData = appData;
		Laya.timer.loop(3000, this, function () {
			appIndex++;
			if (appIndex >= appCount) {
				appIndex = 0;
			}
			if (!appList[appIndex])
				return;
			appData.appid = appList[appIndex].app_id;
			btnGame.skin = appList[appIndex].app_img;
			btnGame.appData = appData;
			LayaSample.utils.tweenShake(btnGame, null);
		});
	}
}

class DY_OverView extends BVHdla {
	constructor() {
		super(...arguments);
		this.overTime = 10;
	}
	onAwake() {
		super.onAwake();
	}
	onOpened() {
		this.isStartTimer = true;
	}
	onWxWakeEvent() {
		this.isStartTimer = true;
	}
	onWxSleepEvent() {
		this.isStartTimer = false;
	}
	initData() {
		if (!LayaSample.commonData.existVideoAd)
			LayaSample.adMgr.loadVideoAd();
	}
	initUI() {
		let goonTime = this.getChild("goonTime");
		this.btnVideo = this.getChild("Video");
		goonTime.visible = !LayaSample.commonData.obtain_prop;
		if (LayaSample.commonData.existVideoAd) {
			LayaSample.utils.tweenScale(this.btnVideo, null);
		}
		let bottomPanel = this.getChild("bottomPanel");
		this.btnSkip = this.getChild("Skip", bottomPanel);
		this.goonTimeLabel = this.getChild("lbTimer", goonTime);
		this.goonTimeLabel.value = "+";
		if (Laya.Browser.onPC) {
			this.btnVideo.visible = true;
		}
		Laya.timer.loop(1000, this, this.onTimerStart);
		LayaSample.commonData.isNoAds = false;
	}
	showBtnSkip() {
		this.btnSkip.visible = true;
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnVideo, this, this.onVideoClick);
		LayaSample.utils.addClickEvent(this.btnSkip, this, this.onSkipClick);
		LayaSample.glEvent.on("wx_sleep_event", this, this.onWxSleepEvent);
		LayaSample.glEvent.on("wx_wake_event", this, this.onWxWakeEvent);
		LayaSample.glEvent.on("ad_video_close_event", this, this.onVideoCloseEvent);
	}
	onShareClick() {
	}
	onVideoClick() {
		if (Laya.Browser.onPC) {
			console.log("成功复活");
			this.close();
			this.goonGame();
			return;
		}
		LayaSample.adMgr.showVideoAd(1);
	}
	onSkipClick() {
		this.closeView();
	}
	closeView() {
		console.log("关闭结束界面");
		let scene = "qq_views/qq_Reward.scene";
		Laya.Scene.open(scene, false, Laya.Handler.create(this, view => {
			this.close();
		}));
	}
	onTimerStart() {
		if (this.overTime > 0) {
			if (this.isStartTimer) {
				this.overTime -= 1;
				console.log("倒计时：", this.overTime);
				this.goonTimeLabel.value = this.overTime.toString();
			}
			return;
		}
		Laya.timer.clear(this, this.onTimerStart);
		this.onSkipClick();
	}
	onVideoCloseEvent(evt) {
		if (!evt.isEnded) {
			LayaSample.wxMgr.showToast("看完视频才能复活", 2000);
		}
		else {
			LayaSample.wxAd.hideBannerAd();
			this.close();
			this.goonGame();
		}
	}
	goonGame() {
		LayaSample.commonData.isDie = true;
		LayaSample.commonData.goonCount++;
		LayaSample.glEvent.event("goon_game_event");
		LayaSample.adMgr.hideBannerAd();
		LayaSample.commonData.isNoAds = true;
	}
}

class AppItem extends Laya.Box {
	constructor() {
		super();
		this.icon = null;
		this.initItem();
	}
	onDisable() {
	}
	initItem() {
		if (!AppItem.appPrefab) {
			console.error("app prefab is null");
			return;
		}
		let item = Laya.Pool.getItemByCreateFun("appItem", AppItem.appPrefab.create, AppItem.appPrefab);
		this.icon = item.getChildByName("icon");
		this.icon.width = AppItem.appWidth;
		this.icon.height = AppItem.appHeight;
		item.size(AppItem.appWidth, AppItem.appHeight);
		this.addChild(item);
	}
	setItemInfo(data) {
		if (data == null) {
			return;
		}
		this.icon.loadImage(data.app_img);
		this.appId = data.app_id;
	}
}
AppItem.appWidth = 128;
AppItem.appHeight = 128;

class AppLite extends Laya.Script {
	constructor() {
		super();
		this.appCount = -1;
		this.needClearTimer = false;
		this.cate = 0;
		this.ind = 0;
		this.prevInd = 0;
		this.renderCount = 4;
		this.speed = 3000;
	}
	closeComp() {
		Laya.timer.clearAll(this);
		this.panel.visible = false;
		console.log("hide---");
		this.isHide = true;
	}
	onDisable() {
		Laya.timer.clearAll(this);
		this.panel.visible = false;
		console.log("hide---");
	}
	onStart() {
		if (this.isHide)
			return;
		this.initData();
		this.initUI();
		this.initList();
	}
	initUI() {
		if (LayaSample.commonData.obtain_prop) {
			let isShow = this.appCount != 0;
			this.list.visible = isShow;
			this.panel.visible = isShow;
		}
		else {
			this.panel.visible = false;
		}
	}
	initData() {
		AppItem.appWidth = this.appWidth;
		AppItem.appHeight = this.appHeight;
		AppItem.appPrefab = this.appPrefab;
		this.data = LayaSample.wxMgr.getWxappList(this.category);
		this.appCount = this.data.length;
		if (this.appCount <= 6) {
			return;
		}
		let i = 0;
		let weightCount = 0;
		for (i = 0; i < this.appCount; ++i) {
			weightCount += this.data[i].weight;
		}
		let weightItem = [];
		let weight = 0;
		for (i = 0; i < this.appCount; ++i) {
			weight += this.data[i].weight;
			weightItem[i] = {};
			weightItem[i].index = i;
			weightItem[i].weight = weight / weightCount;
		}
		let dataList = [];
		let probability = 0;
		let finish = false;
		let offset = 0;
		for (let j = 0; j < this.appCount; ++j) {
			probability = Math.random() * weightItem[weightItem.length - 1].weight;
			finish = false;
			for (i = 0; i < weightItem.length; ++i) {
				if (!finish && probability <= weightItem[i].weight) {
					finish = true;
					dataList.push(this.data[weightItem[i].index]);
					if (i + 1 < weightItem.length) {
						offset = weightItem[i + 1].weight - weightItem[i].weight;
					}
				}
				if (finish && i + 1 < weightItem.length) {
					weightItem[i + 1].weight -= offset;
					weightItem[i] = weightItem[i + 1];
				}
			}
			weightItem.length -= 1;
		}
		this.data = dataList;
	}
	getData(weightItem, probability) {
		for (var i = 0; i < weightItem.length; ++i) {
			if (probability > weightItem[i]) {
			}
		}
	}
	initList() {
		let list = this.list;
		if (list != null) {
			list.itemRender = AppItem;
			list.vScrollBarSkin = "";
			list.selectEnable = true;
			list.renderHandler = new Laya.Handler(this, this.updateItem);
			list.selectHandler = new Laya.Handler(this, this.onSelect);
			this.renderCount = list.repeatX * list.repeatY;
		}
		if (this.data != null) {
			this._copyEndDataToStart(this.data);
			this._setData(this.data);
		}
		list.array = this.data;
		if (this.category == 1) {
			Laya.timer.once(1000, this, this.moveList);
		}
	}
	moveList() {
		this.needClearTimer = false;
		if (this.list) {
			let len = (this.list.array.length + 2) / 3;
			if (len < 3)
				return;
			let ti = len * 3 - 6;
			this.list.tweenTo(ti, 3000 * (ti - this.list.startIndex - 1), new Laya.Handler(this, this.moveList1));
		}
	}
	moveList1() {
		let len = (this.list.array.length + 2) / 3;
		if (len < 3)
			return;
		let ti = len * 3 - 6;
		this.list.tweenTo(0, 3000 * (ti), new Laya.Handler(this, this.moveList));
	}
	updateItem(cell, index) {
		cell.setItemInfo(cell.dataSource);
	}
	onSelect(e, index) {
		if (index < 0)
			return;
		if (e.type == "mouseup") {
			var data = this.list.getItem(index);
			if (data != null) {
				LayaSample.wxMgr.openOtherApp(data.app_id, data.category);
			}
		}
		if (this.category == 1) {
			if (this.needClearTimer) {
				Laya.timer.clear(this, this.moveList);
			}
			this.needClearTimer = true;
			if (this.list.startIndex < 3) {
				Laya.timer.once(1000, this, this.moveList);
			}
			else {
				Laya.timer.once(1000, this, this.moveList1);
			}
		}
		this.list.selectedIndex = -1;
	}
	_setData(_data) {
		this.ind = 0;
		this.list.array = this.data;
		if (this.data.length > this.renderCount) {
			Laya.timer.frameOnce(1, this, this._tweenToNext);
		}
	}
	_tweenToNext() {
		Laya.timer.clearAll(this);
		this.ind = Math.max(this.list.repeatY, this.list.startIndex);
		if (this.ind == this.prevInd) {
			this.ind += this.list.repeatY;
		}
		if (this.ind > this.appCount) {
			this.list.scrollTo(0);
			this.ind = this.list.repeatY;
		}
		this.prevInd = this.ind;
		this.list.tweenTo(this.ind, this.speed - 10);
		Laya.timer.once(this.speed, this, this._tweenToNext);
	}
	_copyEndDataToStart(data) {
		this.appCount = data.length;
		if (data.length > this.renderCount) {
			for (let index = 0; index < this.renderCount; index++) {
				const element = data[data.length - index - 1];
				data.unshift(element);
			}
		}
	}
}

class AppNative extends Laya.Script {
	constructor() {
		super();
		this._appCount = -1;
		this._appIndex = 0;
		this.repeatX = 0;
		this.btnUse = false;
		this.isShow = true;
	}
	onStart() {
		this.btnUse = false;
		this.initUI();
		this.initEvent();
	}
	initData() {
		this.data = LayaSample.wxMgr.getWxappList(this.category);
		this._appCount = this.data.length;
	}
	initUI() {
		this.btnLook = this.banner.getChildByName("btnLook");
		this.banner.visible = false;
		let data = LayaSample.wxAd.getCurNativeAd();
		console.log("NativeAd", data);
		if (!data)
			return;
		if (LayaSample.commonData.isclose) {
			console.log("隐藏广告 .........");
			this.banner.visible = false;
			return;
		}
		let delay = this.category >= 1;
		if (!this.isShow && !LayaSample.commonData.isAdDelay)
			return;
		if (data && (this.category < 1)) {
			LayaSample.wxAd.reportAdShow();
			this.banner.visible = true;
			let icon = this.banner.getChildByName("icon");
			icon.skin = data.imgUrlList.length >= 1 ? data.imgUrlList[0] : data.iconUrlList[0];
			this.banner.getChildByName("appName").text = data.title;
			this.banner.getChildByName("appCrip").text = data.desc;
			let bg2 = this.banner.getChildByName("bg2");
			if (bg2) {
				bg2.skin = data.imgUrlList[0];
			}
		}
		else if (delay) {
			if (LayaSample.commonData.isAdDelay) {
				this.data = data;
				Laya.timer.once(900, this, this.showBannerLocal);
			}
			else {
				this.data = data;
				this.showBannerLocal();
			}
		}
	}
	showBannerLocal() {
		LayaSample.glEvent.event("ad_show_event", { adtype: "native" });
		let data = this.data;
		if (!data)
			return;
		LayaSample.wxAd.reportAdShow();
		this.banner.visible = true;
		let icon = this.banner.getChildByName("icon");
		icon.skin = data.imgUrlList.length >= 1 ? data.imgUrlList[0] : data.iconUrlList[0];
		this.banner.getChildByName("appName").text = data.title;
		this.banner.getChildByName("appCrip").text = data.desc;
		let bg2 = this.banner.getChildByName("bg2");
	}
	initEvent() {
		this.closeBtn = this.banner.getChildByName("btnClose");
		this.closeBtn.visible = false;
		Laya.timer.once(3000, this, this.setClose);
		this.touch.on(Laya.Event.MOUSE_DOWN, this, this.onBannerClick);
		this.closeBtn.on(Laya.Event.MOUSE_DOWN, this, this.onClose);
		if (this.btnLook) {
			LayaSample.utils.addClickEvent(this.btnLook, this, this.onBannerClick);
		}
		LayaSample.glEvent.on("ad_load_event_banner", this, this.onAdLoadEvent);
	}
	onClose(event) {
		console.log("close");
		this.btnUse = true;
		this.banner.visible = false;
		LayaSample.glEvent.event("nativeAdClose");
	}
	onDisable() {
		Laya.timer.clear(this, this.nextBanner);
		LayaSample.glEvent.off("ad_load_event", this, this.onAdLoadEvent);
	}
	setClose() {
		this.closeBtn.visible = true;
	}
	setBanner() {
		let btn = this.banner;
		if (this._appCount > 0) {
			let info = this.data[this._appIndex];
			btn.skin = info.app_img;
			btn.appid = info.app_id;
		}
		btn.visible = !LayaSample.commonData.existBannerAd && !LayaSample.commonData.isNoAds && this._appCount > 0;
	}
	nextBanner() {
		let index = this._appIndex;
		index++;
		if (index >= this._appCount)
			index = 0;
		this._appIndex = index;
		this.setBanner();
	}
	onAdLoadEvent(evt) {
		if (this.category > 0) {
			this.banner.visible = false;
		}
	}
	setPanelBottom() {
		if (this.panel && !LayaSample.commonData.existBannerAd && this._appCount > 0) {
			this.panel.bottom = this.banner.height;
			let sysInfo = LayaSample.commonData.wxsysInfo;
		}
	}
	onBannerClick(event) {
		if (!this.banner.visible)
			return;
		if (this.btnUse)
			true;
		this.banner.visible = false;
		LayaSample.wxAd.reportAdClick();
		Laya.timer.once(200, this, function () { LayaSample.glEvent.event("nativeAdClose"); });
	}
}

class QQ_RewardView extends BVHdla {
	constructor() {
		super(...arguments);
		this.isUsingBtnTips = true;
		this.factor = 5;
		this.isShareRecord = false;
	}
	onAwake() {
		super.onAwake();
		LayaSample.adMgr.hideBannerAd();
		if (LayaSample.adMgr.getBannerCount() < 2) {
			console.log("LayaSample.adMgr.getBannerCount()", LayaSample.adMgr.getBannerCount());
			LayaSample.adMgr.getBannerAd();
		}
	}
	onOpened(data) {
	}
	initData() {
	}
	initUI() {
		this.btnGet = this.getChild("btnGet");
		this.isUsingBtnTips = LayaSample.commonData.showRevivalCard;
		this.btnRecord = this.getChild("btnRecord");
		this.btnRecordOut = this.getChild("btnRecordOut");
		this.lbRecGold = this.getChild("lbGold", this.btnRecord);
		this.lbRecGoldOut = this.getChild("lbGold", this.btnRecordOut);
		this.lbRecGold.text = "+" + LayaSample.commonData.qq_RecordGold;
		this.lbRecGoldOut.text = "+" + LayaSample.commonData.qq_RecordGold;
		this.btnRecord.visible = false;
		this.isShareRecord = true;
		this.btnRecordOut.visible = false;
		this.btnTips = this.getChild("btnTips");
		this.tipsTag = this.getChild("tag", this.btnTips);
		this.btnTips2 = this.getChild("btnTips2");
		this.tipsTag2 = this.getChild("tag", this.btnTips2);
		this.tipsTag2.visible = this.isUsingBtnTips;
		LayaSample.utils.tweenScale(this.btnRecord, null);
		let bg = this.getChild("coinBg");
		this.lbGold = this.getChild("lbGold", bg);
		this.gold = Math.floor(LayaSample.commonData.newScore / 25);
		if (this.gold == null)
			this.gold = 0;
		this.swithGoldLabel();
		this.effect = this.getChild("effect");
		Laya.timer.loop(20, this, function () {
			this.effect.rotation += 2;
		});
	}
	swithGoldLabel() {
		if (this.isUsingBtnTips) {
			this.lbGold.text = "+" + this.gold * this.factor;
		}
		else {
			this.lbGold.text = "+" + this.gold;
		}
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnGet, this, this.onGetClick);
		LayaSample.utils.addClickEvent(this.btnRecord, this, this.onRecClick);
		LayaSample.utils.addClickEvent(this.btnRecordOut, this, this.onRecOutClick);
		LayaSample.utils.addClickEvent(this.btnTips2, this, this.onTipsClick);
		LayaSample.glEvent.on("ad_video_close_event", this, this.onVideoCloseEvent);
	}
	onRecOutClick() {
		LayaSample.wxMgr.showToast("本局已分享", 1000);
	}
	onRecClick() {
		this.isShareRecord = true;
	}
	onTipsClick() {
		this.isUsingBtnTips = !this.isUsingBtnTips;
		this.tipsTag2.visible = this.isUsingBtnTips;
		this.swithGoldLabel();
	}
	onGetClick() {
		if (!this.isUsingBtnTips) {
			var gold = this.gold;
			LayaSample.storageMgr.addGold(gold);
			this.closeView();
			return;
		}
		LayaSample.adMgr.showVideoAd(0);
	}
	onRecordSuccessEvent() {
		LayaSample.wxMgr.showToast("恭喜获得分享录屏奖励" + LayaSample.commonData.qq_RecordGold + "金币", 1000);
		this.isShareRecord = true;
		this.btnRecord.visible = false;
		this.lbRecGoldOut.visible = true;
		LayaSample.storageMgr.addGold(LayaSample.commonData.qq_RecordGold);
		LayaSample.storageMgr.addGold(0);
	}
	onVideoCloseEvent(evt) {
		if (!evt.isEnded) {
		}
		else {
			var gold = this.gold * this.factor;
			LayaSample.storageMgr.addGold(gold);
			this.closeView();
		}
	}
	closeView() {
		console.log("关闭页面");
		LayaSample.adMgr.hideBannerAd();
		LayaSample.commonData.isDie = true;
		LayaSample.glEvent.event("change_skin_event", { index: LayaSample.storageMgr.qq_GetNowSkinID() });
		LayaSample.glEvent.event("restgame");
		Laya.Scene.open("qq_views/_clearing.scene", false, Laya.Handler.create(this, view => {
			this.close();
		}));
	}
}

class DY_SigninView extends BVHdla {
	constructor() {
		super(...arguments);
		this.isUsingBtnTips = true;
		this.signin_level = 0;
		this.signin_GoldList = [];
		this.signin_lockerList = [];
	}
	onAwake() {
		super.onAwake();
	}
	initUI() {
		CurSence.curSence = "DY_SigninView";
		Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
		var dataTime = new Date().getDate();
		this.signin_level = LayaSample.storageMgr.qq_GetSigninLevel();
		this.btnClose = this.getChild("btnClose");
		let bottomPanel = this.getChild("bottomPanel");
		this.btnGet = this.getChild("btnGet", bottomPanel);
		this.btnGetOut = this.getChild("btnGetOut", bottomPanel);
		this.btnGet.visible = LayaSample.storageMgr.qq_GetNotSignin();
		this.btnGetOut.visible = !LayaSample.storageMgr.qq_GetNotSignin();
		this.btnTips = this.getChild("btnTips");
		this.tipsTag = this.getChild("tag", this.btnTips);
		this.btnTips2 = this.getChild("btnTips2");
		this.tipsTag2 = this.getChild("tag", this.btnTips2);
		this.isUsingBtnTips = LayaSample.commonData.showRevivalCard;
		this.tipsTag2.visible = this.isUsingBtnTips;
		var showBox = this.getChild("showBox");
		var boxList = showBox.getChildByName("boxList");
		var index = 0;
		this.signin_GoldList = [];
		this.signin_lockerList = [];
		for (var i = 0; i < 7; i++) {
			var item = boxList.getChildByName("item" + (i + 1));
			var _goldLabel = item.getChildByName("Gold");
			var _locker = item.getChildByName("locker");
			this.signin_GoldList.push(_goldLabel);
			this.signin_lockerList.push(_locker);
		}
		this.initData();
		LayaSample.adMgr.showBannerAd();
	}
	onKeyUp(e) {
		if (CurSence.curSence != "DY_SigninView") {
			return;
		}
		switch (e.keyCode) {
			case 8:
			case 4:
				this.close();
				CurSence.curSence = "qq_HomeView";
				break;
			case 13:
			case 23:
			case 66:
				if (this.btnGet.visible) {
					this.onSigninClick();
				} else {
					this.cancelClick();
				}
				CurSence.curSence = "qq_HomeView";
				break;
		}
	}
	initData() {
		for (var i = 0; i < this.signin_GoldList.length; i++) {
			this.signin_GoldList[i].text = "x" + LayaSample.commonData.qq_signin_GoldList[i] + " ";
			if (i < this.signin_lockerList.length - 1) {
				if (i > this.signin_level) {
					this.signin_lockerList[i].visible = false;
					this.signin_GoldList[i].strokeColor = "#04a4ff";
				}
				else if (i < this.signin_level) {
					this.signin_lockerList[i].visible = true;
					this.signin_GoldList[i].strokeColor = "#737373";
				}
				else {
					this.signin_lockerList[i].visible = false;
					this.signin_GoldList[i].strokeColor = "#04a4ff";
				}
			}
		}
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnClose, this, this.cancelClick);
		LayaSample.utils.addClickEvent(this.btnTips, this, this.onTipsClick);
		LayaSample.utils.addClickEvent(this.btnTips2, this, this.onTipsClick);
		LayaSample.glEvent.on("ad_video_close_event", this, this.onVideoCloseEvent);
	}
	onTipsClick() {
		this.isUsingBtnTips = !this.isUsingBtnTips;
		this.tipsTag.visible = this.isUsingBtnTips;
		this.tipsTag2.visible = this.isUsingBtnTips;
	}
	onSigninClick() {
		if (Laya.Browser.onPC || !this.isUsingBtnTips) {
			var gold = LayaSample.commonData.qq_signin_GoldList[LayaSample.storageMgr.qq_GetSigninLevel()];
			console.log("@@@__onSigninClick___", LayaSample.storageMgr.qq_GetSigninLevel(), gold, LayaSample.commonData.qq_signin_GoldList);
			this.getSingin(gold);
			return;
		}
		LayaSample.adMgr.showVideoAd(0);
	}
	onVideoCloseEvent(evt) {
		if (!evt.isEnded) {
			LayaSample.wxMgr.showToast("未观看完视频", 2000);
		}
		else {
			var gold = LayaSample.commonData.qq_signin_GoldList[LayaSample.storageMgr.qq_GetSigninLevel()] * 10;
			this.getSingin(gold);
		}
	}
	getSingin(gold) {
		LayaSample.adMgr.hideBannerAd();
		LayaSample.storageMgr.addGold(gold);
		LayaSample.storageMgr.qq_SaveSigninDayTime();
		LayaSample.storageMgr.qq_SetNotSignin(false);
		LayaSample.storageMgr.qq_AddSigninLevel();
		this.close();
		LayaSample.adMgr.showBannerAd();
	}
	cancelClick() {
		LayaSample.commonData.isNoAds = false;
		LayaSample.adMgr.hideBannerAd();
		this.close();
		LayaSample.adMgr.showBannerAd();
	}
}

class DY_TypeSkinView extends BVHdla {
	constructor() {
		super(...arguments);
		this.isUsingBtnTips = true;
		this.itemIndex = 0;
		this.itemCount = 0;
	}
	onAwake() {
		super.onAwake();
	}
	initData() {
		LayaSample.adMgr.hideBannerAd();
		if (!LayaSample.commonData.existVideoAd)
			LayaSample.adMgr.loadVideoAd();
	}
	initUI() {
		this.isUsingBtnTips = LayaSample.commonData.showRevivalCard;
		this.btnTypeSkin = this.getChild("btnTypeSkin");
		this.btnTips = this.getChild("btnTips2");
		this.tipsTag = this.getChild("tag", this.btnTips);
		this.tipsTag.visible = this.isUsingBtnTips;
		let bottomPanel = this.getChild("bottomPanel");
		this.btnMiniVideo = this.getChild("btnMiniVideo", bottomPanel);
		this.btnBack = this.getChild("btnBack", bottomPanel);
		this.btnBack.visible = !this.isUsingBtnTips;
		this.btnMiniVideo.visible = this.isUsingBtnTips;
		let content = this.getChild("content");
		let skinItem = this.getChild("skinItem", content);
		this.ImgSkinIcon = this.getChild("skinIcon", skinItem);
		this.itemCount = Math.floor(Math.random() * LayaSample.commonData.qq_lockerSkinList.length);
		this.itemIndex = LayaSample.commonData.qq_lockerSkinList[this.itemCount];
		console.log("itemIndex", this.itemIndex);
		this.ImgSkinIcon.skin = "skin/pf" + (this.itemIndex) + "_ui.png";
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnTypeSkin, this, this.onVideoClick);
		LayaSample.utils.addClickEvent(this.btnMiniVideo, this, this.onDelayVideoClick);
		LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick);
		LayaSample.utils.addClickEvent(this.btnTips, this, this.onTipsClick);
		LayaSample.glEvent.on("ad_video_close_event", this, this.onVideoCloseEvent);
	}
	onTipsClick() {
		this.isUsingBtnTips = !this.isUsingBtnTips;
		this.tipsTag.visible = this.isUsingBtnTips;
		this.btnBack.visible = !this.isUsingBtnTips;
		this.btnMiniVideo.visible = this.isUsingBtnTips;
	}
	onVideoClick() {
		if (Laya.Browser.onPC) {
			console.log("换皮肤");
			this.changeSkin();
			return;
		}
		LayaSample.adMgr.showVideoAd(0);
	}
	onDelayVideoClick() {
		if (Laya.Browser.onPC || !this.isUsingBtnTips) {
			this.changeSkin();
			return;
		}
		LayaSample.adMgr.showVideoAd(0);
	}
	changeSkin() {
		LayaSample.glEvent.event("change_skin_event", { index: this.itemIndex });
		Laya.Scene.open("qq_views/newGudie.scene", false, Laya.Handler.create(this, view => {
			this.close();
		}));
	}
	onVideoCloseEvent(evt) {
		console.log("看视频回调：", evt);
		if (!evt.isEnded) {
			LayaSample.wxMgr.showToast("未观看完视频", 2000);
		}
		else {
			LayaSample.commonData.isNoAds = true;
			this.changeSkin();
		}
	}
	onBackClick() {
		this.itemIndex = LayaSample.storageMgr.qq_GetNowSkinID();
		LayaSample.glEvent.event("change_skin_event", { index: this.itemIndex });
		LayaSample.commonData.isNoAds = true;
		Laya.Scene.open("qq_views/newGudie.scene", false, Laya.Handler.create(this, view => {
			this.close();
		}));
	}
}

class ClearingView extends BVHdla {
	initData() {
		if (!LayaSample.commonData.existVideoAd)
			LayaSample.adMgr.loadVideoAd();
	}
	initUI() {
		let bottomPanel = this.getChild("bottomPane");
		let view = this.getChild("view");
		this.btnBack = this.getChild("btnBack", bottomPanel);
		this.btnPlay = this.getChild("btnPlay", bottomPanel);
		let score = this.getChild("score", view);
		console.log("LayaSample.commonData.newScore++++", LayaSample.commonData.newScore);
		this.fontScore = this.getChild("fontScore", score);
		this.fontScore.value = LayaSample.commonData.newScore.toString();
		console.log("fontScore++++", this.fontScore.value);
		if (LayaSample.commonData.obtain_prop) {
			this.btnBack.visible = false;
			this.btnPlay.visible = false;
			Laya.timer.once(3000, this, function () {
				this.btnBack.visible = true;
				this.btnPlay.visible = true;
			});
		}
	}
	initEvent() {
		LayaSample.utils.addClickEvent(this.btnPlay, this, this.onPlayGameClick);
		LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick);
		LayaSample.glEvent.on("share_back_event", this, this.onShareBackEvent);
		LayaSample.glEvent.on("wx_wake_event", this, this.onWxWakeEvent);
		LayaSample.glEvent.on("show_applite_event", this, this.onWxWakeEvent);
	}
	onPlayGameClick() {
		Laya.Scene.open("qq_views/qq_TrySkinFree.scene", false, Laya.Handler.create(this, this.onOpenView));
	}
	onWxgameClick(event) {
		let appid = event.target.appData.appid;
		if (appid && appid != '') {
		}
		else
			console.log("appid error.");
	}
	onBackClick() {
		this.close();
		Laya.Scene.open("qq_views/qq_HomeView.scene", false, Laya.Handler.create(this, this.onOpenView));
	}
	onOpenView() {
		this.close();
	}
	onWxWakeEvent() {
	}
	onShareBackEvent(event) {
		if (event.isShare) {
			console.log("分享成功");
		}
		else {
			console.log("分享失败");
		}
	}
}

class gameInfo {
	constructor() {
	}
	static getClass(o) {
		return Object.prototype.toString.call(o).slice(8, -1);
	}
	static conleData(obj) {
		var result, oClass = this.getClass(obj);
		if (oClass == "Object")
			result = {};
		else if (oClass == "Array")
			result = [];
		else
			return obj;
		for (var i in obj) {
			var copy = obj[i];
			if (this.getClass(copy) == "Object")
				result[i] = this.conleData(copy);
			else if (this.getClass(copy) == "Array")
				result[i] = this.conleData(copy);
			else
				result[i] = copy;
		}
		return result;
	}
	static playSound(name) {
		if (!LayaSample.storageMgr.isPlaySound)
			return;
		if (name == "Idel" || name == "die" || name == "charge")
			return;
		let url = `sound/${name}.mp3`;
		Laya.SoundManager.stopSound("sound/run.mp3");
		Laya.SoundManager.playSound(url, 1);
	}
	static playRunSound() {
		if (!LayaSample.storageMgr.isPlaySound)
			return;
		Laya.SoundManager.stopSound("sound/run.mp3");
		Laya.SoundManager.playSound("sound/run.mp3");
	}
	static playMusic(name) {
		if (!LayaSample.storageMgr.isPlaySound)
			return;
		let url = `sound/${name}.mp3`;
		let soundObj = Laya.SoundManager.playMusic(url, 0);
	}
	static setGameSate() {
		this.isRoleFly = false;
		this.jumeNum = 0;
		this.creamLerpT = 1;
		this.diamondArr = [];
		this.AIDownPoint = [];
		this.boxDownPoint = [];
		this.boxAllArr = [];
		this.isRoleWD = false;
		this.roleMode = "Idel";
		this.AIAniMode = "Idel";
		this.AIMode = "stop";
		this.gameScore = 0;
		this.isReGame = 0;
		this.isPlayGame = false;
		this.roleDie = false;
		this.gameSate = "stop";
		this.roleSeepD = 0;
		this.wayDistance = 0;
		this.CLICKNUM = 0;
		this.jumeScore = 0;
	}
}
gameInfo.isXuLi = null;
gameInfo.jumeLv = {
	"0": { h: 10, up: -30, z: 6.2, Y: 1.5, Z: 2 },
	"1": { h: 14, up: -35, z: 7, Y: 2.5, Z: 2.5 },
	"2": { h: 18, up: -40, z: 6.5, Y: 3.5, Z: 3.5 },
	"3": { h: 21, up: -45, z: 8.5, Y: 4.5, Z: 4.5 }
};
gameInfo.AIjumeLv = {
	"0": { h: 10, up: -30, z: 6.2, Y: 1.5, Z: 2 },
	"1": { h: 15, up: -35, z: 7, Y: 2.5, Z: 2.5 },
	"2": { h: 18.5, up: -40, z: 7, Y: 3.5, Z: 3.5 },
	"3": { h: 24, up: -50, z: 8.5, Y: 4.5, Z: 4.5 },
	"4": { h: 12, up: -28, z: 7, Y: 4.5, Z: 4.5 },
	"5": { h: 15, up: -30, z: 9.5, Y: 4.5, Z: 4.5 },
	"6": { h: 15, up: -30, z: 9.5, Y: 4.5, Z: 4.5 },
	"7": { h: 15, up: -30, z: 9.5, Y: 4.5, Z: 4.5 },
	"8": { h: 15, up: -30, z: 18, Y: 4.5, Z: 4.5 },
	"10": { h: 12, up: -28, z: 8, Y: 4.5, Z: 4.5 },
};
gameInfo.ResName = window["res"];
gameInfo.RoleObj = null;
gameInfo.isRoleFly = false;
gameInfo.jumeNum = 0;
gameInfo.creamLerpT = 1;
gameInfo.diamondArr = [];
gameInfo.AIDownPoint = [];
gameInfo.boxDownPoint = [];
gameInfo.boxAllArr = [];
gameInfo.isRoleWD = false;
gameInfo.roleMode = "Idel";
gameInfo.AIAniMode = "Idel";
gameInfo.AIMode = "stop";
gameInfo.scoreMi = null;
gameInfo.gameScore = 0;
gameInfo.jumeScore = 0;
gameInfo.isReGame = 0;
gameInfo.isPlayGame = false;
gameInfo.roleDie = false;
gameInfo.ResData = [];
gameInfo.gameSate = "stop";
gameInfo.roleSeepD = 0;
gameInfo.wayDistance = 0;
gameInfo.gameView = null;
gameInfo.CLICKNUM = 0;
gameInfo.Res = [];
;

var View = Laya.View;
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
	var qq_views;
	(function (qq_views) {
		class dy_SkinViewUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/dy_SkinView");
			}
		}
		qq_views.dy_SkinViewUI = dy_SkinViewUI;
		REG("ui.qq_views.dy_SkinViewUI", dy_SkinViewUI);
		class newGudieUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/newGudie");
			}
		}
		qq_views.newGudieUI = newGudieUI;
		REG("ui.qq_views.newGudieUI", newGudieUI);
		class qq_GoldViewUI extends Scene {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_GoldView");
			}
		}
		qq_views.qq_GoldViewUI = qq_GoldViewUI;
		REG("ui.qq_views.qq_GoldViewUI", qq_GoldViewUI);
		class qq_HomeViewUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_HomeView");
			}
		}
		qq_views.qq_HomeViewUI = qq_HomeViewUI;
		REG("ui.qq_views.qq_HomeViewUI", qq_HomeViewUI);
		class qq_ResurrectViewUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_ResurrectView");
			}
		}
		qq_views.qq_ResurrectViewUI = qq_ResurrectViewUI;
		REG("ui.qq_views.qq_ResurrectViewUI", qq_ResurrectViewUI);
		class qq_RewardUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_Reward");
			}
		}
		qq_views.qq_RewardUI = qq_RewardUI;
		REG("ui.qq_views.qq_RewardUI", qq_RewardUI);
		class qq_SiginInUI extends Scene {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_SiginIn");
			}
		}
		qq_views.qq_SiginInUI = qq_SiginInUI;
		REG("ui.qq_views.qq_SiginInUI", qq_SiginInUI);
		class qq_TrySkinFreeUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/qq_TrySkinFree");
			}
		}
		qq_views.qq_TrySkinFreeUI = qq_TrySkinFreeUI;
		REG("ui.qq_views.qq_TrySkinFreeUI", qq_TrySkinFreeUI);
		class _clearingUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("qq_views/_clearing");
			}
		}
		qq_views._clearingUI = _clearingUI;
		REG("ui.qq_views._clearingUI", _clearingUI);
	})(qq_views = ui.qq_views || (ui.qq_views = {}));
})(ui || (ui = {}));
(function (ui) {
	var views;
	(function (views) {
		class loginUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("views/login");
			}
		}
		views.loginUI = loginUI;
		REG("ui.views.loginUI", loginUI);
		class mainGameUI extends View {
			constructor() { super(); }
			createChildren() {
				super.createChildren();
				this.loadScene("views/mainGame");
			}
		}
		views.mainGameUI = mainGameUI;
		REG("ui.views.mainGameUI", mainGameUI);
	})(views = ui.views || (ui.views = {}));
})(ui || (ui = {}));

class LoginView extends ui.views.loginUI {
	constructor() {
		super();
	}
	onOpened() {
		console.log("打开onOpened");
		LayaSample.configMgr.init();
		LayaSample.soundMgr.init();
		LayaSample.wxMgr.init();
		LayaSample.adMgr.init();
		LayaSample.commonData.isclose = true;
		LayaSample.commonData.isDie = true;
	}
	onEnable() {
		console.log("onEnble");
		this.load();
	}
	load() {
		let res = [
			{ url: "res/scene/main.ls", clas: Laya.Scene, priority: 1 },
		];
		for (var k in gameInfo.Res) {
			gameInfo.Res[k]["clas"] = Laya.Sprite3D;
			gameInfo.Res[k]["priority"] = 2;
		}
		res = res.concat(gameInfo.Res);
		Laya.loader.create(res, Laya.Handler.create(this, this.onLoadCompelet), Laya.Handler.create(this, this.onLoadePorgress));
	}
	onLoadCompelet() {
		this.onIntoGame();
	}
	onIntoGame() {
		Laya.Scene.open("views/mainGame.scene", false, Laya.Handler.create(this, view => {
			Laya.Scene.open("qq_views/qq_HomeView.scene", false, Laya.Handler.create(this, view => {
				Laya.Scene.open("qq_views/qq_GoldView.scene", false, Laya.Handler.create(this, view => {
					this.close();
				}));
			}));
		}));
	}
	onLoadePorgress(pores) {
		this.loadBar.value = pores;
		this.loadText.text = Math.floor(pores * 100) + "%";
	}
}

class camera extends Laya.Script3D {
	constructor() {
		super();
	}
	onEnable() {
	}
	setInitData() {
		this.offset = new Laya.Vector3();
		this.movePosition = new Laya.Vector3();
		let role = this.owner.parent.getChildByName("roleWay");
		this.role = role.getChildByName("role");
		console.log(this.role);
		gameInfo.canLookAt = true;
		if (this.role)
			this.onLookAt();
	}
	onLookAt() {
		this.setCameraPos1();
	}
	setCameraPos1() {
		this.offset.setValue(-6.1, 8, -9);
		this.owner.transform.lookAt(this.role.transform.position, new Laya.Vector3(0, 1, 0), false);
		this.owner.transform.rotationEuler = new Laya.Vector3(-31.47, 34.07 + 180, 0);
	}
	setCameraPos2() {
		this.offset.setValue(-0, 15, -11);
		this.owner.transform.lookAt(this.role.transform.position, new Laya.Vector3(0, 1, 0), false);
		this.owner.transform.rotationEuler = new Laya.Vector3(-31.47, 34.07 + 150, 0);
	}
	setCameraPos3() {
		this.offset.setValue(-1, 25, 20);
		this.owner.transform.lookAt(this.role.transform.position, new Laya.Vector3(0, 1, 0), false);
		this.owner.transform.rotationEuler = new Laya.Vector3(-31.47, -10, 0);
	}
	onUpdate() {
		if (!gameInfo.canLookAt)
			return;
		Laya.Vector3.add(this.offset, this.role.transform.position, this.movePosition);
		Laya.Vector3.lerp(this.owner.transform.position, this.movePosition, gameInfo.creamLerpT, this.movePosition);
		this.owner.transform.localPosition = this.movePosition;
	}
}

class roleScript extends Laya.Script3D {
	constructor() {
		super();
		this.isJump = false;
		this.jumeName = null;
		this.targetLv = null;
		this.jumeLv = 0;
		this.jumeSeep = 0;
		this.isJumeLad = 0;
		this.isHitTestJume = false;
		this.moveSeep = 0;
		this.upMoveSeep = 0;
		this.ledMoveSeep = 0;
		this.isCanJume = true;
		this.jumeUpSeep = 2;
		this.AIflashNum = 7;
		this.isCanCLick = true;
	}
	onAwake() {
		Laya.stage.on("PLAYGAME", this, this.onPlayGame);
		gameInfo.gameView.on(Laya.Event.MOUSE_DOWN, this, this.onDownStage);
		this.parent = this.owner.parent.parent;
		this.teXiao = this.parent.getChildByName("teXiao");
	}
	onEnable() {
		this.isJump = true;
		this.isCanCLick = true;
		this.wayBox = this.parent.getChildByName("roleWay");
		let roleAni = this.owner.getChildByName("Bip001");
		let getGw2_mx = roleAni.getChildByName("gw2_mx");
		this.gw2_mx = getGw2_mx ? getGw2_mx : this.owner.getChildAt(1);
		this.roleAni = this.owner.getComponent(Laya.Animator);
		this.rigibody = this.owner.getComponent(Laya.Rigidbody3D);
		this.rigibody.angularFactor = new Laya.Vector3(0, 0, 0);
		this.rigibody.isKinematic = false;
		this.reSetGravity();
		this.initRoleEffect(roleAni);
		this.playRoleAni("Idel");
	}
	initRoleEffect(roleAni) {
		if (this.owner.getChildByName("yuanDian2"))
			return;
		let buff1 = this.teXiao.getChildByName("FX_TG_Buff_1");
		let buff2 = this.teXiao.getChildByName("FX_TG_Buff_2");
		let buff3 = this.teXiao.getChildByName("FX_TG_Buff_3");
		let jumeCharge = this.teXiao.getChildByName("FX_TG_Charge");
		let jumeTrail = this.teXiao.getChildByName("FX_TG_Jump_Super_Trail");
		let Foot = this.teXiao.getChildByName("FX_TG_Foot");
		let buff1_c = buff1.clone();
		let buff2_c = buff2.clone();
		let buff3_c = buff3.clone();
		this.jumeCharge = jumeCharge.clone();
		this.jumeTrail = jumeTrail.clone();
		this.Foot = Foot.clone();
		buff1_c.name = "yuanDian1";
		buff2_c.name = "yuanDian2";
		buff3_c.name = "yuanDian3";
		buff1_c.transform.localPosition = buff2_c.transform.localPosition = buff3_c.transform.localPosition = new Laya.Vector3(0, 1, 0);
		this.jumeCharge.transform.position = new Laya.Vector3(-0.26, 0.57, -0.35);
		this.jumeTrail.transform.position = new Laya.Vector3(0, 0, -1);
		this.Foot.transform.localPosition = new Laya.Vector3(0, 0.05, 0);
		this.jumeCharge.active = this.jumeTrail.active = buff1_c.active = buff2_c.active = buff3_c.active = false;
		this.owner.addChildren(buff1_c, buff2_c, buff3_c, this.Foot, this.jumeCharge);
		roleAni.addChild(this.jumeTrail);
		console.log("this", this.owner);
	}
	onUpdate() {
		this.isJumeLad = this.owner.transform.position.y - this.jumeSeep;
		this.jumeSeep = this.owner.transform.position.y;
		gameInfo.RolePos = this.owner.transform.position;
		if (gameInfo.roleDie || !gameInfo.isPlayGame)
			return;
		if (gameInfo.roleMode == "fly")
			this.isSpeurJume();
		gameInfo.roleSeepD = this.owner.transform.position.z;
		gameInfo.gameScore = Math.floor(gameInfo.roleSeepD / 1) + gameInfo.jumeScore;
		LayaSample.glEvent.event("update_score", { score: gameInfo.gameScore });
		if (!this.isJump) {
			this.owner.transform.translate(new Laya.Vector3(0, 0, 0.1));
		}
		else {
		}
	}
	onDownStage() {
		if (gameInfo.roleMode == "charge") {
			gameInfo.CLICKNUM++;
			gameInfo.isXuLi._children[4].value += 0.1;
		}
		if (gameInfo.roleDie || gameInfo.gameSate != "run" || gameInfo.roleMode != "run")
			return;
		let jumeMode = this.targetLv || this.jumeLv;
		this.rigibody.clearForces();
		this.isJump = true;
		this.rigibody.gravity = new Laya.Vector3(0, gameInfo.jumeLv[jumeMode].up, 0);
		this.rigibody.linearVelocity = new Laya.Vector3(0, gameInfo.jumeLv[jumeMode].h, gameInfo.jumeLv[jumeMode].z);
		this.playRoleAni("jume");
		this.onPlayEcffetAni("FX_TG_Jump", this.owner.transform.position);
	}
	isSpeurJume() {
		gameInfo.diamondArr.forEach(box => {
			let p2 = box.transform.position;
			let p3 = new Laya.Vector3();
			Laya.Vector3.subtract(p2, this.owner.transform.position, p3);
			if (p3.z <= 0) {
				box.transform.position = this.owner.transform.position;
			}
		});
	}
	onSpeurJuem(jumeLv, type) {
		if (gameInfo.roleMode == "fly")
			return;
		this.playRoleAni("fly");
		var jumeLv = jumeLv || window['jume'][gameInfo.CLICKNUM >= 13 ? 13 : gameInfo.CLICKNUM];
		gameInfo.isXuLi.visible = false;
		this.isHitTestJume = true;
		this.jumeCharge.active = false;
		this.jumeTrail.active = true;
		this.isJump = true;
		console.log("roleFly", jumeLv);
		gameInfo.boxDownPoint.sort((a, b) => { return a.z - b.z; });
		let p2 = gameInfo.boxDownPoint[jumeLv];
		let p3 = new Laya.Vector3();
		p2 = p2 ? p2 : gameInfo.boxDownPoint[3];
		if (!p2) {
			console.error("角色就行跳跃", p2, this.owner.transform.position, p3, gameInfo.boxDownPoint, jumeLv);
			return;
		}
		Laya.Vector3.subtract(p2, this.owner.transform.position, p3);
		let posA = this.owner.transform.position;
		let posB = new Laya.Vector3(p3.x / 2, posA.y + 9 + jumeLv, p2.z);
		let posC = new Laya.Vector3(posA.x, p2.y, p2.z);
		let time = p3.z * 25;
		this.onPlayEcffetAni("FX_TG_Jump_Super", this.owner.transform.position);
		if (type) {
			this.playTextAni("fly", gameInfo.CLICKNUM);
			gameInfo.jumeNum = 0;
			gameInfo.CLICKNUM = 0;
			Laya.Tween.to(gameInfo.ui_jumeBar._children[1], { height: 0 }, time * 2);
		}
		this.rigibody.isKinematic = true;
		console.log("角色就行跳跃", posB, posC, time);
		if (this.jumeUpAni)
			this.jumeUpAni.clear();
		if (this.jumeMoveAni)
			this.jumeMoveAni.clear();
		gameInfo.gameView.ani10.play(0, false);
		Laya.Tween.to(this.owner.transform, { localPositionZ: posB.z }, time * 2, null, Laya.Handler.create(this, this.onFlyCompelet));
		this.jumeMoveAni = Laya.Tween.to(this.owner.transform, { localPositionY: posB.y }, time, Laya.Ease.sineOut, Laya.Handler.create(this, this.onHeigthCompelet));
		this.jumeMoveAniEnd = Laya.Tween.to(this.owner.transform, { localPositionY: posC.y }, time - 1, Laya.Ease.sineIn, null, time + 1);
		if (gameInfo.AIAniMode == "run")
			return;
		Laya.timer.once(time * 2 + 2, this, this.onFlyCompelet);
	}
	onHeigthCompelet() {
	}
	onFlyCompelet() {
		this.rigibody.isKinematic = false;
		this.isJump = false;
		this.Foot.particleSystem.play();
		this.jumeCharge.active = false;
		this.jumeTrail.active = false;
		this.playRoleAni("run");
		gameInfo.gameView.ani11.play(0, false);
		console.log("角色就行跳跃", "跳跃到最高点");
	}
	isStarSuperJume(jumeLV, timer, name, isCurr) {
		var time = timer || window['jume'].time;
		console.log("roleFly", time, jumeLV);
		if (gameInfo.roleMode == "charge") {
			gameInfo.isXuLi._children[4].value = 0;
			if (!name)
				gameInfo.isXuLi.visible = true;
			this.jumeCharge.active = true;
			this.isJump = true;
			this.playRoleAni(gameInfo.roleMode);
			Laya.timer.once(time, this, this.onSpeurJuem, [jumeLV, isCurr]);
			return true;
		}
		return false;
	}
	onCollisionEnter(e) {
		let A = e._colliderA.owner.name;
		let B = e._colliderB.owner.name;
		let isName = (A == "way" ? true : B == "way" ? true : false);
		let isShui = (A == "shui" ? true : B == "shui" ? true : false);
		let isKenDao = (A == "kenDao" ? true : B == "kenDao" ? true : false);
		let isDanBan = (A == "danBan" ? true : B == "danBan" ? true : false);
		this.rigibody.clearForces();
		this.reSetGravity();
		console.log("碰撞2", A, B, gameInfo.roleMode);
		if (gameInfo.roleMode == "jume" && isName || gameInfo.roleMode == "jume" && isDanBan || gameInfo.roleMode == "fly" && isName || gameInfo.roleMode == "fly" && isDanBan) {
			LayaSample.soundMgr.play("down");
			gameInfo.gameSate = "run";
			this.playRoleAni("run");
			this.jumeTrail.active = false;
			if (gameInfo.jumeNum >= window["jume"].jumeNum) {
				gameInfo.roleMode = "charge";
				this.isStarSuperJume(null, null, null, true);
			}
			gameInfo.jumeNum++;
			this.jumeBarValue = gameInfo.jumeNum;
		}
		if (isShui || isKenDao) {
			if (gameInfo.roleMode != "fly")
				this.roleDie();
		}
		else {
			console.log("角色蓄力情况", A, B, "gameInfo.jumeNum", gameInfo.jumeNum);
		}
		if (gameInfo.roleMode != "charge")
			this.isJump = false;
	}
	onTriggerEnter(e) {
		let name = e.owner.name;
		console.log("碰撞1", e.owner.name, e);
		if (name.indexOf("hitTest") != -1 || name.indexOf("shui") != -1 || name.indexOf("kenDao") != -1) {
			if (gameInfo.roleMode != "fly") {
				this.roleDie(name);
				if (gameInfo.jumeNum-- <= 0)
					gameInfo.jumeNum = 0;
			}
		}
		else {
		}
		if (name == "zhuanShi") {
			gameInfo.playSound("item");
			gameInfo.jumeScore += 10;
			this.eatDiamond(e.owner);
		}
		else if (name.indexOf("yuanDian") != -1) {
			gameInfo.playSound("item");
			if (gameInfo.roleMode != "fly") {
				this.playTextAni("up");
			}
			this.eatYuanDian(e.owner);
		}
		else if (name == "ResetZone") {
			gameInfo.playSound("item");
			this.isResetZone(e.owner);
		}
		else {
		}
		if (name == "jumeBox") {
			gameInfo.roleMode = "charge";
			this.isStarSuperJume(window['jume'].jumeBoxNum - 1, 10, name);
		}
		this.eatJumeLv(name);
	}
	eatJumeLv(name) {
		if (name == "gquan1") {
			this.targetLv = 1;
		}
		else if (name == "gquan2") {
			this.targetLv = 2;
		}
		else if (name == "gquan3") {
			this.targetLv = 3;
		}
		else {
			this.targetLv = null;
		}
		Laya.timer.once(300, this, function () { this.targetLv = null; });
		this.jumeName = name;
	}
	eatYuanDian(obj) {
		this.onPlayEcffetAni("FX_TG_Ball", obj.transform.position);
		obj.removeSelf();
		if (this.oldJumeAni)
			this.oldJumeAni.active = false;
		this.oldJumeAni = this.owner.getChildByName(obj.name);
		this.oldJumeAni.active = true;
		if (obj.name == "yuanDian1") {
			this.jumeLv = 1;
		}
		else if (obj.name == "yuanDian2") {
			this.jumeLv = 2;
		}
		else if (obj.name == "yuanDian3") {
			this.jumeLv = 3;
		}
	}
	eatDiamond(obj) {
		this.onPlayEcffetAni("FX_TG_Diamond", obj.transform.position);
		obj.removeSelf();
	}
	isResetZone(obj) {
		if (!this.oldJumeAni)
			return;
		this.oldJumeAni.active = false;
		this.jumeLv = 0;
	}
	onPlayEcffetAni(name, pos) {
		let s = this;
		let Diamond = this.teXiao.getChildByName(name);
		let c_Diamond = Diamond.clone();
		c_Diamond.transform.position = pos;
		c_Diamond.particleSystem.play();
		this.wayBox.addChild(c_Diamond);
		Laya.timer.frameOnce(c_Diamond.particleSystem.duration * 50, c_Diamond, function () {
			this.removeSelf();
		});
	}
	roleFly() {
	}
	playTextAni(url, num) {
		if (url == "up") {
			gameInfo.gameView.textAni.skin = "ui/font-power-cn.png";
		}
		else {
			if (num <= 3) {
				gameInfo.gameView.textAni.skin = "ui/font-new_cn.png";
			}
			else if (num <= 7) {
				gameInfo.gameView.textAni.skin = "ui/font-gread-cn.png";
			}
			else if (num <= 11) {
				gameInfo.gameView.textAni.skin = "ui/font-perfect-cn.png";
			}
			if (num >= 12) {
				gameInfo.gameView.textAni.skin = "ui/font-wow-cn.png";
			}
			console.log("点击次数", num);
		}
		gameInfo.gameView.ani12.play(0, false);
	}
	playRoleAni(name) {
		gameInfo.roleMode = name;
		console.log("gameInfo.roleMode", gameInfo.roleMode);
		this.roleAni.crossFade(gameInfo.roleMode, 0.2, 0);
		if (name == "run") {
			gameInfo.playRunSound();
			this.Foot.particleSystem.play();
		}
		else {
			this.Foot.particleSystem.stop();
			gameInfo.playSound(name);
		}
	}
	onPlayGame() {
		gameInfo.gameScore = 0;
		gameInfo.scoreMi.value = gameInfo.gameScore + "";
		gameInfo.CLICKNUM = 0;
		gameInfo.gameSate = "run";
		gameInfo.roleMode = "run";
		gameInfo.roleDie = false;
		gameInfo.isPlayGame = true;
		gameInfo.creamLerpT = 1;
		this.playRoleAni("run");
	}
	roleDie(name) {
		gameInfo.roleDie = true;
		gameInfo.gameSate = "stop";
		gameInfo.roleMode = "die";
		console.log("游戏结束");
		this.playRoleAni(gameInfo.roleMode);
		this.rigibody.linearVelocity = new Laya.Vector3(0, 0, 0);
		this.owner.transform.localPositionZ -= 0.5;
		this.rigibody.clearForces();
		this.rigibody.isKinematic = false;
		Laya.timer.clearAll(this);
		if (!name)
			gameInfo.playSound("water");
		if (name && name.indexOf("hitTest") != -1)
			gameInfo.playSound("impact");
		gameInfo.isXuLi.visible = false;
		this.jumeCharge.active = false;
		if (LayaSample.commonData.isDie) {
			LayaSample.commonData.isDie = false;
			LayaSample.glEvent.event("over_game_event");
			LayaSample.wxMgr.playVibrateLong();
		}
		setTimeout(() => {
			gameInfo.playSound("lose");
		}, 0);
	}
	reRoleRevive() {
		this.isCanCLick = false;
		Laya.timer.clearAll(this);
		if (this.jumeUpAni)
			this.jumeUpAni.clear();
		if (this.jumeMoveAni)
			this.jumeMoveAni.clear();
		this.toAIFlash();
	}
	checkBarriar(pos) {
		var arr = [];
		let i = 1000000;
		let jumeLv = 0;
		let minObj = null;
		if (gameInfo.AIMode == "stop" && gameInfo.AIAniMode != "jume")
			return;
		gameInfo.boxAllArr.forEach(barriar => {
			let p2 = barriar.transform.position.clone();
			let p3 = new Laya.Vector3();
			Laya.Vector3.subtract(pos, p2, p3);
			let dist = Laya.Vector3.scalarLength(p3);
			arr.push(dist);
			if (i >= dist) {
				i = dist;
				minObj = barriar;
			}
			else {
				i = i;
			}
		});
		if (!minObj)
			return;
		let scaleZ = Math.ceil(minObj.transform.localScale.z * 10) / 10;
		let scaleY = Math.ceil(minObj.transform.localScale.y * 10) / 10;
		if (minObj.name == "danBan") {
			if (scaleZ <= 1.2) {
				if (i <= 1.8)
					this.onJumeUP(0);
			}
			else if (scaleZ <= 2.6) {
				if (i <= 2.4)
					this.onJumeUP(1);
			}
			else if (scaleZ <= 3.3) {
				if (i <= 2.4)
					this.onJumeUP(2);
			}
			else if (scaleZ <= 4.2) {
				if (i <= 3.7)
					this.onJumeUP(3);
			}
		}
		else if (minObj.name == "kenDao" || minObj.name == "shui") {
			if (scaleY <= 4) {
				if (minObj.name == "shui" && i <= 2)
					this.onJumeUP(4);
				if (minObj.name == "kenDao" && i <= 1.4)
					this.onJumeUP(4);
			}
			else if (scaleY <= 7) {
				if (i <= 1.6)
					this.onJumeUP(7);
			}
		}
		minObj = null;
	}
	onJumeUP(number) {
	}
	toAIFlash() {
		console.log("gameInfo.lastPos", gameInfo.lastPos);
		this.owner.transform.position = gameInfo.lastPos || new Laya.Vector3(-1.5, 0, 8);
		this.owner.transform.localPositionX = -1.5;
		this.isCanCLick = true;
		this.playRoleAni("Idel");
	}
	set jumeBarValue(num) {
		let addHeight = num * (300 / window['jume'].jumeNum);
		let obj = gameInfo.ui_jumeBar._children[1];
		if (num == 1) {
			obj.height = 1;
		}
		Laya.Tween.to(obj, { height: addHeight }, 200);
	}
	reSetGravity() {
		this.rigibody.clearForces();
		this.rigibody.isKinematic = false;
		this.rigibody.gravity = new Laya.Vector3(0, -80, 0);
	}
	onDisable() {
		Laya.timer.clearAll(this);
		if (this.jumeUpAni)
			this.jumeUpAni.clear();
		if (this.jumeMoveAni)
			this.jumeMoveAni.clear();
		Laya.stage.off("PLAYGAME", this, this.onPlayGame);
		gameInfo.gameView.off(Laya.Event.MOUSE_DOWN, this, this.onDownStage);
		console.log("移除");
	}
}

class addScnen extends Laya.Script3D {
	constructor() {
		super();
		this.runTimeCuntBox = 0;
		this.scenePrefab = {};
		this.sceneAllCont = [];
		this.initStartScenes = [];
	}
	onAwake() {
		let wayArr = [];
		gameInfo.boxAllArr = [];
		gameInfo.boxDownPoint = [];
		gameInfo.diamondArr = [];
		this.getSceneArray();
		this.roleLayer = new Laya.Sprite3D();
		this.roleLayer.transform.position = new Laya.Vector3(0, 0, 0);
		this.roleLayer.name = "roleWay";
		this.owner.addChild(this.roleLayer);
		this.scenePrefab = {
			"way": this.owner.getChildByName("")
		};
		this.loadCompele();
	}
	getSceneArray() {
		this.sceneAllCont = [];
		let resArr = window['res'];
		for (var k in resArr) {
			if (k != "start" && k != "easy") {
				this.sceneAllCont = this.sceneAllCont.concat(resArr[k]);
			}
		}
		console.log("window['res'][k]", this.sceneAllCont);
	}
	reAddScene() {
		gameInfo.boxAllArr = [];
		gameInfo.boxDownPoint = [];
		gameInfo.diamondArr = [];
		this.initStartScenes = this.RoamdName;
		for (let k = 0; k < this.roleLayer.numChildren; k++) {
			let role = this.roleLayer.removeChildAt(k);
			k--;
		}
		console.log("this.roleLayer", this.roleLayer);
		gameInfo.wayDistance = 0;
		gameInfo.isReGame = 0;
		console.log("this.initStartScenes", this.initStartScenes);
		this.addBox();
	}
	get RoamdName() {
		let data = [];
		data = data.concat(this.getroa(window['res']['easy'], 5));
		data = data.concat(this.getroa(window['res']['normal'], 4));
		return data;
	}
	loadCompele() {
		let way = this.owner.getChildByName("sd2_mx");
		this.initStartScenes = this.RoamdName;
		console.log("this.initStartScenes", this.initStartScenes);
		this.addBox("加载完材质图片");
	}
	getNewData(name) {
		let dataName = name || "scene-easy-8";
		return gameInfo.ResData[dataName];
	}
	addBox(name) {
		let _data = this.getPrefabName;
		let data = this.getNewData(_data.name);
		this.nowWayData = gameInfo.conleData(data);
		console.log("开始游戏事件 名字：", _data, name, "增加关卡数据：", this.nowWayData);
		for (var k in this.nowWayData.data) {
			let pos = this.nowWayData.data[k];
			if (pos.name.indexOf("yuanDian") != -1 || pos.name.indexOf("gquan") != -1 || pos.name == ("zhuanShi") || pos.name == ("jumeBox")) {
				let posAI = this.nowWayData.data[k];
				this.roleLayer.addChild(this.getBox(posAI, "AI"));
			}
			this.roleLayer.addChild(this.getBox(pos, "role"));
		}
		gameInfo.wayDistance += this.nowWayData.distance - 1.5;
	}
	getBox(pos, type) {
		let ResName = pos.name == "noJume" ? "noJume" : pos.name;
		let obj = this.owner.getChildByName(ResName);
		let x = pos.x || 0;
		let y = pos.y || 0;
		let z = pos.z || 0;
		let R = pos.R;
		if (!obj)
			return null;
		let _box = obj.clone();
		let X = (type == "AI" ? 1.5 : x);
		_box.name = ResName || "";
		_box.hitName = this.setHitNameArr(_box);
		_box.active = true;
		_box.transform.position = new Laya.Vector3(X, y, (gameInfo.wayDistance) + z);
		_box.transform.setWorldLossyScale(new Laya.Vector3(pos.sx, pos.sy, pos.sz));
		_box.isShowEffects = true;
		if (ResName == "danBan" || ResName == "kenDao" || ResName == "shui" || ResName == "laserBox")
			gameInfo.boxAllArr.push(_box);
		if (ResName == "louDian") {
			gameInfo.boxDownPoint.push(_box.transform.position);
			gameInfo.AIDownPoint.push(_box.transform.position);
			return null;
		}
		if (ResName.indexOf("yuanDian") != -1 && type == "role")
			gameInfo.diamondArr.push(_box);
		if (R) {
			_box.transform.rotation = new Laya.Quaternion(R[0], R[1], R[2], R[3]);
		}
		return _box;
	}
	setHitNameArr(obj) {
		let hitNum = null;
		if (obj.name == "shui" || obj.name == "kenDao") {
			hitNum = "hitTest";
		}
		return hitNum;
	}
	get getPrefabName() {
		let arr = gameInfo.ResName;
		let mapName = "";
		console.log("getPrefabName", arr);
		let index = null;
		if (gameInfo.isReGame == 0) {
			let startSenes = window['res'].start;
			index = Math.floor(Math.random() * startSenes.length);
			mapName = startSenes[index];
		}
		else if (gameInfo.isReGame <= 8 && gameInfo.isReGame > 0) {
			index = gameInfo.isReGame;
			mapName = this.initStartScenes[gameInfo.isReGame];
		}
		else {
			index = Math.floor(Math.random() * this.sceneAllCont.length);
			mapName = this.sceneAllCont[index];
		}
		gameInfo.isReGame++;
		return { name: mapName, index: index };
	}
	onUpdate() {
		if (gameInfo.gameSate != "run")
			return;
		let alDistance = Math.abs(gameInfo.wayDistance);
		if (alDistance - gameInfo.roleSeepD < 120 && this.isAddWay) {
			console.log("增加onUpdate关卡");
			this.isAddWay = false;
			this.addBox("onUpDate");
		}
		else {
			this.isAddWay = true;
		}
		if (this.runTimeCuntBox-- == 0) {
			this.findBoxReMove();
		}
	}
	findBoxReMove() {
		for (let k = 0; k < this.roleLayer.numChildren; k++) {
			let boxObj = this.roleLayer.getChildAt(k);
			let removeObj = null;
			let removeObj1 = null;
			let scale = boxObj.transform.getWorldLossyScale();
			if (boxObj.name == "way" && boxObj.name != "AI" && boxObj.transform.position.z + scale.z - gameInfo.roleSeepD < -120) {
				boxObj.isShowEffects = false;
				boxObj.type = "remove";
				removeObj = this.roleLayer.removeChildAt(k);
				k--;
			}
			if (boxObj.name != "way" && boxObj.name != "AI" && (boxObj.transform.position.z + boxObj.transform.localScaleY) - gameInfo.roleSeepD < -40) {
				boxObj.isShowEffects = false;
				boxObj.type = "remove";
				removeObj1 = this.roleLayer.removeChildAt(k);
				k--;
			}
			for (var i in gameInfo.boxAllArr) {
				let key = Number(i);
				if (gameInfo.boxAllArr[i].type == "remove") {
					gameInfo.boxAllArr.splice(key, 1);
				}
				key--;
			}
		}
		for (var o in gameInfo.boxDownPoint) {
			let key = Number(o);
			if (gameInfo.roleSeepD >= gameInfo.boxDownPoint[o].z) {
				gameInfo.lastPos = gameInfo.boxDownPoint[key];
				gameInfo.boxDownPoint.splice(key, 1);
			}
			key--;
		}
		for (var o in gameInfo.diamondArr) {
			let key = Number(o);
			if (gameInfo.roleSeepD >= gameInfo.diamondArr[o].transform.position.z + 5) {
				gameInfo.diamondArr.splice(key, 1);
			}
			key--;
		}
		this.runTimeCuntBox = 10;
	}
	getroa(arr, count) {
		var temp = new Array();
		var newArr = new Array();
		var count = count ? count : newArr.length;
		for (var k in arr)
			newArr[k] = arr[k];
		for (var i = 0; i < count; i++) {
			var num = Math.floor(Math.random() * newArr.length);
			temp.push(newArr[num]);
			newArr.splice(num, 1);
		}
		return temp;
	}
}

class AIScript extends Laya.Script3D {
	constructor() {
		super();
		this.isJump = false;
		this.jumeName = null;
		this.targetLv = null;
		this.jumeLv = 0;
		this.jumeSeep = 0;
		this.isJumeLad = 0;
		this.isHitTestJume = false;
		this.moveSeep = 0;
		this.upMoveSeep = 0;
		this.ledMoveSeep = 0;
		this.AIflashNum = 0;
		this.AIJumeNum = 0;
		this.AIOutTimer = 20;
		this.AImoveSeep = 0.105;
	}
	onAwake() {
		this.parent = this.owner.parent.parent;
		Laya.stage.on("PLAYGAME", this, this.onPlayGame);
		this.teXiao = this.parent.getChildByName("teXiao");
	}
	onEnable() {
		this.roleObj = gameInfo.RoleObj;
		this.owner.transform.position = new Laya.Vector3(1, 0, 3.5);
		this.wayBox = this.parent.getChildByName("roleWay");
		let roleAni = this.owner.getChildByName("Bip001");
		let getGw2_mx = roleAni.getChildByName("gw2_mx");
		this.gw2_mx = getGw2_mx ? getGw2_mx : this.owner.getChildAt(1);
		this.roleAni = this.owner.getComponent(Laya.Animator);
		this.rigibody = this.owner.getComponent(Laya.Rigidbody3D);
		this.rigibody.angularFactor = new Laya.Vector3(0, 0, 0);
		this.rigibody.isKinematic = false;
		this.initRoleEffect(roleAni);
		this.playRoleAni("Idel");
	}
	initRoleEffect(roleAni) {
		let buff1 = this.teXiao.getChildByName("FX_TG_Buff_1");
		let buff2 = this.teXiao.getChildByName("FX_TG_Buff_2");
		let buff3 = this.teXiao.getChildByName("FX_TG_Buff_3");
		let jumeCharge = this.teXiao.getChildByName("FX_TG_Charge");
		let jumeTrail = this.teXiao.getChildByName("FX_TG_Jump_Super_Trail");
		let Foot = this.teXiao.getChildByName("FX_TG_Foot");
		let buff1_c = buff1.clone();
		let buff2_c = buff2.clone();
		let buff3_c = buff3.clone();
		this.jumeCharge = jumeCharge.clone();
		this.jumeTrail = jumeTrail.clone();
		this.Foot = Foot.clone();
		buff1_c.name = "yuanDian1";
		buff2_c.name = "yuanDian2";
		buff3_c.name = "yuanDian3";
		buff1_c.transform.localPosition = buff2_c.transform.localPosition = buff3_c.transform.localPosition = new Laya.Vector3(0, 1, 0);
		this.jumeCharge.transform.position = new Laya.Vector3(0, 0, 0);
		this.jumeTrail.transform.position = new Laya.Vector3(0, 0, -1);
		this.Foot.transform.localPosition = new Laya.Vector3(0, 0.05, 0);
		this.jumeCharge.active = this.jumeTrail.active = buff1_c.active = buff2_c.active = buff3_c.active = false;
		this.owner.addChildren(buff1_c, buff2_c, buff3_c, this.Foot, this.jumeCharge);
		roleAni.addChild(this.jumeTrail);
		buff1 = buff2 = buff3 = jumeCharge = jumeTrail = Foot = null;
		console.log("this", this.owner);
	}
	onCollisionEnter(e) {
		this.isJump = false;
		let A = e._colliderA.owner.name;
		let B = e._colliderB.owner.name;
		let C = e._colliderA.owner.hitName;
		let D = e._colliderA.owner.hitName;
		let isName = (A == "way" ? true : B == "way" ? true : false);
		let isDanBan = (A == "danBan" ? true : B == "danBan" ? true : false);
		let CName = (C == "hitTest" ? true : D == "hitTest" ? true : false);
		console.log("AI碰撞", A, B, CName);
		if (gameInfo.AIAniMode == "jume" && isName || gameInfo.AIAniMode == "jume" && isDanBan || gameInfo.AIAniMode == "fly" && isName || gameInfo.AIAniMode == "fly" && isDanBan) {
			gameInfo.AIMode = "run";
			this.reSetGravity();
			this.playRoleAni("run");
			this.jumeTrail.active = false;
		}
		if (this.AIJumeNum >= 10 && isName || this.AIJumeNum >= 10 && isDanBan) {
			this.AIJumeNum = 0;
			if (Math.ceil(Math.random() * 100000) / 100000 > 0.8 && gameInfo.AIMode == "run") {
				this.AISpeurJume(4);
			}
		}
		if (CName && gameInfo.AIAniMode != "fly") {
			this.roleDie();
		}
	}
	onTriggerEnter(e) {
		let name = e.owner.name;
		console.log("AI碰撞onTriggerEnter", e.owner.name, e.owner.hitName);
		if (name.indexOf("hitTest") != -1 || e.owner.hitName == "hitTest") {
			if (gameInfo.AIAniMode != "fly")
				this.roleDie();
		}
		if (name == "gquan3") {
			this.onJumeUP(3);
		}
		else if (name == "gquan2") {
			this.onJumeUP(2);
		}
		else if (name == "gquan1") {
			this.onJumeUP(1);
		}
		else if (name.indexOf("yuanDian") != -1) {
			this.eatYuanDian(e.owner);
		}
		else if (name.indexOf("zhuanShi") != -1) {
			this.eatDiamond(e.owner);
		}
		else if (name == "ResetZone") {
			this.isResetZone(e.owner);
		}
		else if (name != "zhuanShi") {
			this.rigibody.clearForces();
		}
		if (name == "jumeBox") {
			this.isJump = true;
			this.playRoleAni("charge");
			this.jumeCharge.active = true;
			Laya.timer.once(10, this, this.AISpeurJume, ['speurJume', window['jume'].jumeBoxNum - 1]);
		}
	}
	eatYuanDian(obj) {
		this.onPlayEcffetAni("FX_TG_Ball", obj.transform.position);
		obj.removeSelf();
		if (this.oldJumeAni)
			this.oldJumeAni.active = false;
		this.oldJumeAni = this.owner.getChildByName(obj.name);
		this.oldJumeAni.active = true;
		console.log("远点名字", obj.name, this.jumeName);
		if (obj.name == "yuanDian1") {
			this.jumeLv = 1;
		}
		else if (obj.name == "yuanDian2") {
			this.jumeLv = 2;
		}
		else if (obj.name == "yuanDian3") {
			this.jumeLv = 3;
		}
	}
	eatDiamond(obj) {
		this.onPlayEcffetAni("FX_TG_Diamond", obj.transform.position);
		obj.removeSelf();
	}
	isResetZone(obj) {
		if (!this.oldJumeAni)
			return;
		this.oldJumeAni.active = false;
		this.jumeLv = 0;
	}
	onUpdate() {
		this.AIRunRque();
		if (gameInfo.AIMode != "run" || gameInfo.AIAniMode != "run")
			return;
		if (!this.isJump) {
			this.owner.transform.translate(new Laya.Vector3(0, 0, this.AImoveSeep));
		}
		this.checkBarriar(this.owner.transform.position);
	}
	AIRunRque() {
		let selfZ = this.owner.transform.position.z;
		let selfY = this.owner.transform.position.y;
		let roleZ = gameInfo.RolePos ? gameInfo.RolePos.z : 8;
		let dis = selfZ - roleZ;
		if (gameInfo.AIAniMode != "fly") {
			if (selfZ - roleZ >= 35) {
				this.AImoveSeep = 0;
			}
			else if (selfZ - roleZ >= 17) {
				this.AImoveSeep = 0.09;
			}
			if (dis <= 0 && dis > -4) {
				this.AImoveSeep = 0.105;
			}
			if (dis <= -4) {
				this.AImoveSeep = 0.15;
			}
			if (dis <= -10) {
				this.AISpeurJume(2);
				console.log("AI已已经落后15米了快想办法");
			}
			else if (dis <= -20) {
				this.AISpeurJume(3);
				console.log("AI已已经落后20米了快想办法");
			}
		}
		if (selfY <= -5) {
			this.rigibody.isKinematic = true;
			this.owner.transform.position.y = 0;
			console.log("AI已已经掉下去了");
			this.AISpeurJume(1);
		}
		if (gameInfo.AIMode == "run") {
			for (var o in gameInfo.AIDownPoint) {
				let key = Number(o);
				if (this.owner.transform.position.z >= gameInfo.AIDownPoint[o].z) {
					gameInfo.AIlastPos = gameInfo.AIDownPoint[key];
					gameInfo.AIDownPoint.splice(key, 1);
				}
				key--;
			}
		}
	}
	AISpeurJume(type, jumeNum) {
		console.log("AI超级跳跃类型", type);
		if (gameInfo.AIAniMode == "fly")
			return;
		gameInfo.isXuLi.visible = false;
		this.isHitTestJume = true;
		this.playRoleAni("fly");
		this.jumeCharge.active = false;
		this.jumeTrail.active = true;
		gameInfo.AIDownPoint.sort(function (a, b) {
			return a.z - b.z;
		});
		let p1 = this.owner.transform.position;
		this.owner.transform.position = new Laya.Vector3(p1.x, p1.y < 0 ? 0 : p1.y, p1.z);
		let p2 = this.getJumePoint(jumeNum);
		console.log("AI已已经开始超级跳跃", p2, this.roleObj.transform.position.z);
		let p3 = new Laya.Vector3();
		Laya.Vector3.subtract(p2, this.owner.transform.position, p3);
		let posA = this.owner.transform.position;
		let h = p2.y > p2.y ? p2.y + 5 : posA.y + 12;
		let posB = new Laya.Vector3(p3.x / 2, h, p2.z);
		let posC = new Laya.Vector3(posA.x, p2.y, p2.z);
		this.onToUpjume(posB, posC, p3.z * 25);
		this.onPlayEcffetAni("FX_TG_Jump_Super", this.owner.transform.position);
	}
	getJumePoint(jumeNum) {
		var jumeNum = jumeNum ? jumeNum : (3 + Math.ceil(Math.random() * 2));
		console.log("AI跳跃点", jumeNum, "AI到达的点", gameInfo.AIDownPoint[jumeNum], "角色的点", gameInfo.roleSeepD);
		if (gameInfo.AIDownPoint[jumeNum]) {
			return gameInfo.AIDownPoint[jumeNum];
		}
		else {
			return gameInfo.AIDownPoint[3];
		}
	}
	onToUpjume(posB, posC, time) {
		this.rigibody.isKinematic = true;
		Laya.Tween.to(this.owner.transform, { localPositionZ: posB.z }, time * 2, null, Laya.Handler.create(this, this.onFlyCompelet));
		Laya.Tween.to(this.owner.transform, { localPositionY: posB.y }, time, Laya.Ease.sineOut);
		Laya.Tween.to(this.owner.transform, { localPositionY: posC.y }, time - 1, Laya.Ease.sineIn, null, time + 1);
		if (gameInfo.AIAniMode == "run")
			return;
		Laya.timer.once(time * 2 + 2, this, this.onFlyCompelet);
	}
	onFlyCompelet() {
		this.rigibody.isKinematic = false;
		this.jumeTrail.active = false;
		this.playRoleAni("run");
	}
	checkBarriar(pos) {
		var arr = [];
		let i = 1000000;
		let jumeLv = 0;
		let minObj = null;
		if (gameInfo.AIMode == "stop" && gameInfo.AIAniMode != "jume")
			return;
		gameInfo.boxAllArr.forEach(barriar => {
			let p2 = barriar.transform.position.clone();
			let p3 = new Laya.Vector3();
			Laya.Vector3.subtract(pos, p2, p3);
			let dist = Laya.Vector3.scalarLength(p3);
			arr.push(dist);
			if (i >= dist) {
				i = dist;
				minObj = barriar;
			}
			else {
				i = i;
			}
		});
		if (!minObj)
			return;
		let scaleZ = Math.ceil(minObj.transform.localScale.z * 10) / 10;
		let scaleY = Math.ceil(minObj.transform.localScale.y * 10) / 10;
		if (minObj.name == "danBan") {
			if (scaleZ <= 1.2) {
				if (i <= 1.8)
					this.onJumeUP(0);
			}
			else if (scaleZ <= 2.6) {
				if (i <= 2.3)
					this.onJumeUP(1);
			}
			else if (scaleZ <= 3.3) {
				if (i <= 2.4)
					this.onJumeUP(2);
			}
			else if (scaleZ <= 4.2) {
				if (i <= 3.7)
					this.onJumeUP(3);
			}
		}
		else if (minObj.name == "kenDao" || minObj.name == "shui") {
			let shuiZ = minObj.transform.position.z - this.owner.transform.position.z;
			if (scaleY <= 4.5) {
				if (minObj.name == "shui") {
					if (i <= 2.5 || shuiZ <= 0.5) {
						this.onJumeUP(10, "kenDao");
					}
				}
				if (minObj.name == "kenDao" && i <= 1.6)
					this.onJumeUP(4, "kenDao");
			}
			else if (scaleY <= 7) {
				if (minObj.name == "shui") {
					if (i <= 2.5 || shuiZ <= 0.5) {
						this.onJumeUP(7, "kenDao");
					}
				}
				if (minObj.name == "kenDao" && i <= 1.6)
					this.onJumeUP(7, "kenDao");
			}
			else if (scaleY <= 15) {
				if (minObj.name == "shui") {
					if (i <= 2.5 || shuiZ <= 0.5) {
						this.onJumeUP(8, "kenDao");
					}
				}
				if (minObj.name == "kenDao" && i <= 1.6)
					this.onJumeUP(8, "kenDao");
			}
		}
		else if (minObj.name == "laserBox") {
			if (i <= 3)
				this.onJumeUP(3);
		}
		minObj = null;
	}
	onJumeUP(jumeLv, name) {
		this.onAIJume(jumeLv, "danBan");
	}
	onAIJume(jumeMode, type) {
		this.AIJumeNum++;
		let a = type == "kenDao" ? 0 : 1;
		this.isJump = true;
		this.rigibody.clearForces();
		this.rigibody.gravity = new Laya.Vector3(0, gameInfo.AIjumeLv[jumeMode].up, 0);
		this.rigibody.linearVelocity = new Laya.Vector3(0, gameInfo.AIjumeLv[jumeMode].h, gameInfo.AIjumeLv[jumeMode].z - a);
		this.playRoleAni("jume");
		this.onPlayEcffetAni("FX_TG_Jump", this.owner.transform.position);
		console.log("跳--", this.jumeName, "jumeMode", jumeMode, "targetLv", this.targetLv, "jumeLv", this.jumeLv);
	}
	vsFun(jumeMode) {
		this.rigibody.isKinematic = false;
		this.rigibody.gravity = new Laya.Vector3(0, gameInfo.AIjumeLv[jumeMode].up, 0);
		this.rigibody.linearVelocity = new Laya.Vector3(0, 0, gameInfo.AIjumeLv[jumeMode].z);
	}
	reSetGravity() {
		this.rigibody.clearForces();
		this.rigibody.isKinematic = false;
		this.rigibody.gravity = new Laya.Vector3(0, -100, 0);
	}
	playRoleAni(name) {
		gameInfo.AIAniMode = name;
		this.roleAni.crossFade(gameInfo.AIAniMode, 0.2, 0);
		if (name == "run") {
			this.Foot.particleSystem.play();
		}
		else {
			this.Foot.particleSystem.stop();
		}
	}
	onPlayEcffetAni(name, pos) {
		let s = this;
		let Diamond = this.teXiao.getChildByName(name);
		let c_Diamond = Diamond.clone();
		c_Diamond.transform.position = pos;
		c_Diamond.particleSystem.play();
		this.wayBox.addChild(c_Diamond);
		Laya.timer.frameOnce(c_Diamond.particleSystem.duration * 50, c_Diamond, function () {
			this.removeSelf();
		});
	}
	roleDie() {
		gameInfo.AIMode = "die";
		console.log("AI死亡");
		this.playRoleAni("die");
		this.rigibody.linearVelocity = new Laya.Vector3(0, 0, 0);
		this.owner.transform.localPositionZ -= 0.5;
		Laya.timer.once(1000, this, this.AIRePlayGame);
	}
	AIRePlayGame() {
		let pos = this.owner.transform.position.z;
		Laya.timer.clearAll(this);
		this.playRoleAni("Idel");
		this.toAIFlash();
		if (this.jumeUpAni)
			this.jumeUpAni.clear();
		if (this.jumeMoveAni)
			this.jumeMoveAni.clear();
	}
	toAIFlash() {
		this.AIflashNum = 7;
		let timer = 150 * this.AIflashNum + 700;
		this.AIflash();
		Laya.timer.once(timer, this, this.onPlayGame);
	}
	AIflash() {
		if (this.gw2_mx.active) {
			this.gw2_mx.active = false;
		}
		else if (!this.gw2_mx.active) {
			this.gw2_mx.active = true;
		}
		Laya.timer.once(150, this, function () {
			if (this.AIflashNum-- >= 1) {
				this.AIflash();
			}
			if (this.AIflashNum == 0) {
				this.gw2_mx.active = false;
				Laya.timer.once(200, this, function () {
					this.gw2_mx.active = true;
					this.owner.transform.localPositionZ -= 3;
				});
			}
		});
	}
	onPlayGame() {
		this.AIJumeNum = 0;
		gameInfo.AIMode = "run";
		this.playRoleAni("run");
		this.checkBarriar(this.owner.transform.position);
	}
	onDisable() {
		Laya.stage.off("PLAYGAME", this, this.onPlayGame);
		if (gameInfo.AIAniMode != "fly") {
			if (this.jumeUpAni)
				this.jumeUpAni.clear();
			if (this.jumeMoveAni)
				this.jumeMoveAni.clear();
		}
		this.rigibody.clearForces();
		this.rigibody.isKinematic = false;
		Laya.timer.clearAll(this);
	}
}

class GameUI extends ui.views.mainGameUI {
	constructor() {
		super();
		this.tabPos = 0;
		this.nowSkinID = 0;
	}
	onAwake() {
		console.log("================");
		this.downPos = { x: 0, y: 0 };
		this.creamOldPos = { pos: { x: 0, y: 0, z: 0 }, ro: { x: 0, y: 0, z: 0 } };
	}
	onEnable() {
		this.tabPos = 0;
		gameInfo.gameView = this;
		this.caiDaiBg.width = Laya.stage.width;
		this.caiDaiBg.height = Laya.stage.height;
		LayaSample.glEvent.on("change_skin_event", this, this.onReSetSKIN);
		LayaSample.glEvent.on("play_game_event", this, this.onPlayGame);
		LayaSample.glEvent.on("goon_game_event", this, this.onRePlayGame);
		LayaSample.glEvent.on("restgame", this, this.onReSetGame);
		LayaSample.glEvent.on("over_game_event", this, this.overGameEvent);
		LayaSample.glEvent.on("update_score", this, this.upScore);
		this.tabCream.on(Laya.Event.CLICK, this, this.onTabCamera);
		this.tabCream.visible = false;
		this.jumebarBox.visible = false;
		gameInfo.ui_jumeBar = this.jumebarBox;
		this.mainScene = Laya.loader.getRes("res/scene/main.ls");
		this.hideSceneObj();
		this.gameBox.addChild(this.mainScene);
		this.ScnenScprit = this.mainScene.addComponent(addScnen);
		this.cream = this.mainScene.getChildByName("mainCamera");
		gameInfo.isXuLi = this.isXuLi;
		gameInfo.scoreMi = this.scoreMi;
		this.cameraScript = this.cream.addComponent(camera);
		this.initScene();
		console.log(this.caiDaiBg, "this.caiDaiBg");
	}
	onTabCamera() {
		gameInfo.creamLerpT = 0.1;
		if (this.tabPos == 0)
			this.cameraScript.setCameraPos1();
		if (this.tabPos == 1)
			this.cameraScript.setCameraPos2();
		if (this.tabPos == 2)
			this.cameraScript.setCameraPos3();
		if (this.tabPos++ >= 2)
			this.tabPos = 0;
	}
	hideSceneObj() {
		for (var k in this.mainScene._children) {
			let isCamera = this.mainScene._children[k].name.indexOf("mainCamera") != -1;
			let isLight = this.mainScene._children[k].name.indexOf("Directional Light") != -1;
			let isCroleWay = this.mainScene._children[k].name.indexOf("roleWay") != -1;
			this.mainScene._children[k].active = false;
			if (isCamera || isLight || isCroleWay) {
				this.mainScene._children[k].active = true;
				console.log("this.mainScene._children[k]", this.mainScene._children[k].name);
			}
		}
	}
	upScore(evt) {
		this.scoreMi.value = String(evt.score);
	}
	initScene() {
		this.scoreMi.visible = false;
		this.jumebarBox._children[1].height = 0;
		this.jumebarBox.visible = false;
		this.roleWay = this.mainScene.getChildByName("roleWay");
		this.addRole(this.nowSkinID || 0);
		this.addAI();
		this.cameraScript.setInitData();
	}
	addRole(skinID) {
		if (this.roles)
			this.roles.removeSelf();
		this.roles = this.getRoleMode(skinID, "role");
		this.roleScript = this.roles.addComponent(roleScript);
		this.roles.transform.position = new Laya.Vector3(-1.5, 0, 8);
		gameInfo.RoleObj = this.roles;
		this.roles.active = true;
		this.roleWay.addChild(this.roles);
		this.cameraScript.setInitData();
	}
	addAI() {
		let R = Math.floor(Math.random() * 9 - 1);
		let skinID = (1 + R) === 0 ? 1 : (1 + R);
		console.log("AI角色", R);
		this.AI = this.getRoleMode(skinID, "AI");
		this.AI.addComponent(AIScript);
		this.roleWay.addChild(this.AI);
		this.AI.active = true;
		this.AI.transform.localPosition = new Laya.Vector3(1.5, 0, 8);
	}
	onReSetSKIN(data) {
		let skinID = data.index;
		console.log("skinID", skinID);
		if (this.nowSkinID == skinID)
			return;
		this.nowSkinID = skinID;
		if (skinID == 0)
			return;
		this.addRole(skinID);
	}
	getRoleMode(skinNume, name) {
		let skin = skinNume;
		let role = this.mainScene.getChildByName("role" + skin);
		let conleRole = role.clone();
		conleRole.name = name || "cloneRole";
		return conleRole;
	}
	onPlayGame() {
		gameInfo.isPlayGame = true;
		gameInfo.roleDie = false;
		Laya.stage.event("PLAYGAME");
		this.jumebarBox.visible = true;
		this.scoreMi.visible = true;
	}
	onRePlayGame() {
		this.jumebarBox.visible = true;
		this.roleScript.reRoleRevive();
		this.onPlayGame();
	}
	onReSetGame() {
		this.scoreMi.visible = false;
		gameInfo.setGameSate();
		this.ScnenScprit.reAddScene();
		this.initScene();
		console.log("onReSetGame");
	}
	onReSetGameCom() {
	}
	overGameEvent() {
		if (LayaSample.commonData.goonCount > 0) {
			LayaSample.commonData.goonCount = 0;
			Laya.Scene.open("qq_views/qq_Reward.scene", false);
			LayaSample.commonData.newScore = Number(this.scoreMi.value);
		}
		else {
			Laya.Scene.open("qq_views/qq_ResurrectView.scene", false);
			LayaSample.commonData.newScore = Number(this.scoreMi.value);
		}
	}
}

class GameConfig {
	constructor() { }
	static init() {
		var reg = Laya.ClassUtils.regClass;
		reg("scripts/views/qq_SkinView.ts", QQ_SkinView);
		reg("scripts/views/newGuide.ts", newGuide);
		reg("scripts/views/qq_goldView.ts", qq_goleView);
		reg("scripts/views/qq_HomeView.ts", qq_HomeView);
		reg("scripts/views/qq_ResurrectView.ts", DY_OverView);
		reg("scripts/uiComp/AppLite.ts", AppLite);
		reg("scripts/uiComp/AppNative.ts", AppNative);
		reg("scripts/views/qq_RewardView.ts", QQ_RewardView);
		reg("scripts/views/qq_SiginInView.ts", DY_SigninView);
		reg("scripts/views/qq_TrySkinView.ts", DY_TypeSkinView);
		reg("scripts/views/ClearingView.ts", ClearingView);
		reg("scripts/views/LoginView.ts", LoginView);
		reg("scripts/views/GameView.ts", GameUI);
	}
}
GameConfig.width = 1334;
GameConfig.height = 750;
GameConfig.scaleMode = "fixedheight";
GameConfig.screenMode = "horizontal";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "views/login.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;
GameConfig.init();

class Main {
	constructor() {
		if (window["Laya3D"])
			Laya3D.init(GameConfig.width, GameConfig.height);
		else
			Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
			Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
			Laya["PhysicsDebugDraw"].enable();
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}
	onVersionLoaded() {
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}
	onConfigLoaded() {
		Laya.loader.load("res/mapJson/data.json", Laya.Handler.create(this, this.onLoadRes));
	}
	onLoadRes(data) {
		console.log("main onLoadRes");
		gameInfo.ResData = data;
		Laya.Scene.open("views/login.scene");
	}
}
new Main();
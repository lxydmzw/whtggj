/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameUI from "./script/GameUI"
import GameControl from "./../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/GameControl"
import Bullet from "./../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/Bullet"
import DropBox from "./../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/DropBox"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/GameUI.js",GameUI);
		reg("../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/GameControl.js",GameControl);
		reg("../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/Bullet.js",Bullet);
		reg("../../../../../../Applications/LayaAirIDE.app/Contents/Resources/app/out/vs/layaEditor/src/script/DropBox.js",DropBox);
    }
}
GameConfig.width = 1334;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedheight";
GameConfig.screenMode = "none";
GameConfig.alignV = "middle";
GameConfig.alignH = "center";
GameConfig.startScene = "test/TestScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = true;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();

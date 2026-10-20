import { _decorator, Button, Component, director, Node } from 'cc';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('Quit')
export class Quit extends Component {
    onLoad() {
        this.node.on(Button.EventType.CLICK, this.onClick, this);
    }
    onDestroy() {
        this.node.off(Button.EventType.CLICK, this.onClick, this);
    }
    private onClick() {
        // 直接切回大厅场景，引擎会自动销毁当前战斗场景的所有节点
        director.loadScene(GameConstants.GAME_SCENE.HALL); 
    }
}



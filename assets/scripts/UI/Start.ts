import { _decorator, Button, Component, director, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
     onLoad() {
        this.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    onDestroy() {
        this.node.off(Button.EventType.CLICK, this.onClick, this);
    }

    private onClick() {
        director.loadScene(GameConstants.GAME_SCENE.BATTLE);
    }
}



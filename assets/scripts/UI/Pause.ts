import { _decorator, Button, Component, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('Pause')
export class Pause extends Component {
    onLoad() {
        this.node.on(Button.EventType.CLICK, this.onClick, this);
    }
    
    onDestroy() {
        this.node.off(Button.EventType.CLICK, this.onClick, this);
    }
    
    private onClick() {
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_PAUSE);
    }
}



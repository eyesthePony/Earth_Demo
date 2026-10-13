import { _decorator, Component, Node, director } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('PausePanel')
export class PausePanel extends Component {

    onLoad() {

        this.node.active = false;  
        EventBus.on(GameConstants.EVENT_TYPE.GAME_PAUSE, this.show, this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESUME, this.hide, this);
    }

    onDestroy() {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_PAUSE, this.show, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESUME, this.hide, this);
    }

    private show() {
        this.node.active = true;
    }

    private hide() {
        this.node.active = false;
    }

   
}
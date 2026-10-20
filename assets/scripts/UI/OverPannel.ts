import { _decorator, Component, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('OverPannel')
export class OverPannel extends Component {
    protected onLoad(): void {
        this.node.active = false;  
        EventBus.on(GameConstants.EVENT_TYPE.GAME_OVER,this.show,this);
         EventBus.on(GameConstants.EVENT_TYPE.GAME_RESTART, this.hide, this);
    }

     private show() {
        this.node.active = true;
    }

    private hide() {
        this.node.active = false;
    }


    protected onDestroy(): void {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_OVER,this.show,this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESTART, this.hide, this);
    }
}



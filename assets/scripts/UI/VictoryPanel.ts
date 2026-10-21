import { _decorator, Component, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('VictoryPanel')
export class VictoryPanel extends Component {
    protected onLoad(): void {
        this.node.active = false;  
        EventBus.on(GameConstants.EVENT_TYPE.GAME_VICTORY,this.show,this);

    }

     private show() {
        this.node.active = true;
    }




    protected onDestroy(): void {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_VICTORY,this.show,this);

    }
}



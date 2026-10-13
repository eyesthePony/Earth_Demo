import { _decorator, Component, director, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // 游戏状态
    private _state: 'ready' | 'playing' | 'over' = 'ready';

    onLoad() {
        EventBus.on(GameConstants.EVENT_TYPE.GAME_OVER, this.onGameOver, this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_START, this.onGameRestart, this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESUME,this.onGameResume,this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_PAUSE,this.onGamePause,this);
    }

    onDestroy() {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_OVER, this.onGameOver, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_START, this.onGameRestart, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESUME,this.onGameResume,this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_PAUSE,this.onGamePause,this);
    }

    // 游戏结束
    private onGameOver() {
        if (this._state === 'over') return;
        this._state = 'over';
        console.log('[GameManager] 游戏结束');

    }

    // 重开
    private onGameRestart() {
        this._state = 'playing';
        console.log('[GameManager] 重新开始');


    }

    // 游戏开始（由外部调用，比如开始按钮）
    public startGame() {
        this._state = 'playing';
    }

    onGamePause(){
        director.pause();
    }

    onGameResume(){
        director.resume();
    }

}
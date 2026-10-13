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
    }

    onDestroy() {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_OVER, this.onGameOver, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESTART, this.onGameRestart, this);
    }

    // 游戏结束
    private onGameOver() {
        if (this._state === 'over') return;
        this._state = 'over';
        console.log('[GameManager] 游戏结束');

        // 广播给所有系统：游戏结束
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_OVER);
    }

    // 重开
    private onGameRestart() {
        this._state = 'playing';
        console.log('[GameManager] 重新开始');

        // 广播给所有系统：重置
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_RESTART);
    }

    // 游戏开始（由外部调用，比如开始按钮）
    public startGame() {
        this._state = 'playing';
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_START);
    }

    onGamePause(){
        director.pause();
    }

    onGameResume(){
        director.resume();
    }

}
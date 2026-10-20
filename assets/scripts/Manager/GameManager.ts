import { _decorator, Component, director, Node } from 'cc';
import { EventBus } from '../Core/EventBus';
import { GameConstants } from '../Core/GameConstants';
import { AudioManager } from '../Core/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    static instance:GameManager = null;
    // 游戏状态
    private _state:string = GameConstants.GAME_STATE.READY;

    onLoad() {
        GameManager.instance = this;
        EventBus.on(GameConstants.EVENT_TYPE.GAME_OVER, this.onGameOver, this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESTART, this.onGameRestart, this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_RESUME,this.onGameResume,this);
        EventBus.on(GameConstants.EVENT_TYPE.GAME_PAUSE,this.onGamePause,this);
    }

    start(){
        this.onGameStart();
    }

    onDestroy() {
        EventBus.off(GameConstants.EVENT_TYPE.GAME_OVER, this.onGameOver, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESTART, this.onGameRestart, this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_RESUME,this.onGameResume,this);
        EventBus.off(GameConstants.EVENT_TYPE.GAME_PAUSE,this.onGamePause,this);
    }

   

    private onGameStart(){
        this._state = GameConstants.GAME_STATE.PLAYING;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this._state);
        AudioManager.instance.play(GameConstants.AUDIO_TYPE.BGM,1);
    }

    // 游戏结束
    private onGameOver() {
        if (this._state === GameConstants.GAME_STATE.OVER) return;
        this._state = GameConstants.GAME_STATE.OVER;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this._state);
        console.log('[GameManager] 游戏结束');

    }

    // 重开
    private onGameRestart() {
        this._state = GameConstants.GAME_STATE.PLAYING;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this._state);
        console.log('[GameManager] 重新开始');
    }

    onGamePause(){
        this._state = GameConstants.GAME_STATE.PAUSE;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this._state);
    }

    onGameResume(){
        this._state = GameConstants.GAME_STATE.PLAYING;
        EventBus.dispatchEvent(GameConstants.EVENT_TYPE.GAME_STATE_CHANGED,this._state);
    }

}
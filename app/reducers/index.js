/**
 * Created by liujinhe on 16/8/5.
 */
import { combineReducers } from 'redux'
import {characters} from './footer.js'  /*这个名字一定要跟 对应的container绑定的 属性名字 一模一样*/
import addCharacterProps from './addCharacter.js'  /*这个名字一定要跟 对应的container绑定的 属性名字 一模一样*/
import homeCharacters from './home.js'  /*这个名字一定要跟 对应的container绑定的 属性名字 一模一样*/
import navbar from './navbar.js'
import characterProps from './character.js'
import characterListProps from './characterList.js'
import statsProps from './stats.js'


//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    characters,
    navbar,
    addCharacterProps,
    homeCharacters,
    characterProps,
    characterListProps,
    statsProps
})

export default rootReducer
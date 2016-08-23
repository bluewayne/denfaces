/**
 * Created by liujinhe on 16/8/2.
 */
import React from 'react';
import {first, without, findWhere} from 'underscore';
import {Link} from 'react-router';

class Home extends React.Component {

    constructor(props) {
        super(props);
        //this.state = HomeStore.getState();
        //this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        //HomeStore.listen(this.onChange);
        //HomeActions.getTwoCharacters();
       let  {getTwoCharacters}=this.props;

        getTwoCharacters();

    }

    componentWillUnmount() {
        //HomeStore.unlisten(this.onChange);

    }

    onChange(state) {
        //this.setState(state);
    }

    handleClick(character) {
        //var winner = character.characterId;
        //var loser = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
        //HomeActions.vote(winner, loser);

        var winner = character.characterId;
        var loser = first(without(this.props.homeCharacters, findWhere(this.props.homeCharacters, { characterId: winner }))).characterId;

        let  {vote}=this.props;
        vote(winner, loser);


    }

    render() {
        let  {homeCharacters}=this.props;


        var characterNodes = homeCharacters.map((character, index) => {
            return (
                <div key={character.characterId} className={index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5'}>
                    <div className='thumbnail fadeInUp animated'>
                        <img onClick={this.handleClick.bind(this, character)} src={'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg'}/>
                        <div className='caption text-center'>
                            <ul className='list-inline'>
                                <li><strong>Race:</strong> {character.race}</li>
                                <li><strong>Bloodline:</strong> {character.bloodline}</li>
                            </ul>
                            <h4>
                                <Link to={'/characters/' + character.characterId}><strong>{character.name}</strong></Link>
                            </h4>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className='container'>
                <h3 className='text-center'>Click on the portrait. Select your favorite.</h3>
                <div className='row'>
                    {characterNodes}
                </div>
            </div>
        );
    }
}

export default Home;
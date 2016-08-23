/**
 * Created by liujinhe on 16/8/11.
 */
import React from 'react';
import {Link} from 'react-router';
//import $ from 'jquery';
//import imagePoP from 'magnific-popup';


class Character extends React.Component {
    constructor(props) {
        super(props);
        //this.state = CharacterStore.getState();
        //this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {

        //CharacterStore.listen(this.onChange);
        //CharacterActions.getCharacter(this.props.params.id);

        let {getCharacter}=this.props;

        getCharacter(this.props.params.id);

        $('.magnific-popup').magnificPopup({
            type: 'image',
            mainClass: 'mfp-zoom-in',
            closeOnContentClick: true,
            midClick: true,
            zoom: {
                enabled: true,
                duration: 300
            }
        });
    }
    componentWillMount(){


        //CharacterStore.unlisten(this.onChange);

        //$(document.body).removeClass();

    }



    componentWillUnmount() {
        //CharacterStore.unlisten(this.onChange);
        let {getCharacter}=this.props;

        getCharacter(this.props.params.id);

        $(document.body).removeClass();
    }

    componentDidUpdate(prevProps) {
        // Fetch new charachter data when URL path changes

        console.log("%c this.props.params.id    :"+this.props.params.id, "color:blue");

        if (prevProps.params.id !== this.props.params.id) {
            let {getCharacter}=this.props;
            //CharacterActions.getCharacter(this.props.params.id);
            getCharacter(this.props.params.id);

        }
    }

    onChange(state) {
        //this.setState(state);
    }

    handleReportClick(){

        let {characterProps}=this.props;

        this.props.report(characterProps.characterId)
    }

    render() {
        let {characterProps}=this.props;

        console.log('render    ------:'+characterProps.characterId+''+characterProps.gender+''+characterProps.random+''+characterProps.bloodline);


        return (
            <div className='container'>
                <div className='profile-img'>
                    <a className='magnific-popup' href={'https://image.eveonline.com/Character/' + characterProps.characterId + '_1024.jpg'}>
                        <img src={'https://image.eveonline.com/Character/' + characterProps.characterId + '_256.jpg'} />
                    </a>
                </div>
                <div className='profile-info clearfix'>
                    <h2><strong>{characterProps.name}</strong></h2>
                    <h4 className='lead'>Race: <strong>{characterProps.race}</strong></h4>
                    <h4 className='lead'>Bloodline: <strong>{characterProps.bloodline}</strong></h4>
                    <h4 className='lead'>Gender: <strong>{characterProps.gender}</strong></h4>
                    <button className='btn btn-transparent'
                            onClick={this.handleReportClick}
                            disabled={characterProps.isReported}>
                        {characterProps.isReported ? 'Reported' : 'Report Character'}
                    </button>
                </div>
                <div className='profile-stats clearfix'>
                    <ul>
                        <li><span className='stats-number'>{characterProps.winLossRatio}</span>Winning Percentage</li>
                        <li><span className='stats-number'>{characterProps.wins}</span> Wins</li>
                        <li><span className='stats-number'>{characterProps.losses}</span> Losses</li>
                    </ul>
                </div>
            </div>
        );
    }
}

//Character.contextTypes = {
//    router: React.PropTypes.func.isRequired
//};

export default Character;
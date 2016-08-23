/**
 * Created by liujinhe on 16/8/10.
 */
import React from 'react';
//import AddCharacterStore from '../stores/AddCharacterStore';
//import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacter extends React.Component {
    constructor(props) {
        super(props);
        //this.state = AddCharacterStore.getState();
        //this.onChange = this.onChange.bind(this);

        this.state = {
            name: 'dd',
            gender: ''
        };
    }

    componentDidMount() {
        //AddCharacterStore.listen(this.onChange);
    }

    componentWillUnmount() {
        //AddCharacterStore.unlisten(this.onChange);
    }

    onChange(state) {
        //this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        let {addCharacterProps,invalidName,invalidGender,addCharacter}=this.props;

        var name = addCharacterProps.name.trim();
        var gender = addCharacterProps.gender;

        console.log('handleSubmit name       ----'+name);
        console.log('handleSubmit gender       ----'+gender);

        if (!name) {
            invalidName();
            this.refs.nameTextField.getDOMNode().focus();
        }

        if (!gender) {
            invalidGender();
        }

        if (name && gender) {
            addCharacter(name, gender);
        }
    }

    render() {

        let {addCharacterProps,invalidGender,addCharacter}=this.props;

        console.log('addCharacterProps  ----------------------:'+addCharacterProps);
        console.log('invalidGender  ----------------------:'+invalidGender);
        console.log('addCharacter  ----------------------:'+addCharacter);


        return (
            <div className='container'>
                <div className='row flipInX animated'>
                    <div className='col-sm-8'>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>Add Character</div>
                            <div className='panel-body'>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className={'form-group ' + addCharacterProps.nameValidationState}>
                                        <label className='control-label'>Character Name</label>
                                        <input type='text' className='form-control' ref='nameTextField' value={addCharacterProps.name}
                                               onChange={this.props.updateName} autoFocus/>
                                        <span className='help-block'>{addCharacterProps.helpBlock}</span>
                                    </div>
                                    <div className={'form-group ' + addCharacterProps.genderValidationState}>
                                        <div className='radio radio-inline'>
                                            <input type='radio' name='gender' id='female' value='Female' checked={addCharacterProps.gender === 'Female'}
                                                   onChange={this.props.updateGender}/>
                                            <label htmlFor='female'>Female</label>
                                        </div>
                                        <div className='radio radio-inline'>
                                            <input type='radio' name='gender' id='male' value='Male' checked={addCharacterProps.gender === 'Male'}
                                                   onChange={this.props.updateGender}/>
                                            <label htmlFor='male'>Male</label>
                                        </div>
                                    </div>
                                    <button type='submit' className='btn btn-primary'>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddCharacter;
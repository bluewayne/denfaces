/**
 * Created by liujinhe on 16/8/15.
 */
    import React from 'react'

class Stats extends React.Component {
    constructor(props) {
        super(props);
        //this.state = StatsStore.getState();
        //this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        //StatsStore.listen(this.onChange);
        //StatsActions.getStats();
        this.props.getStats();


        console.log('Stats---------------------',"color:green");
    }

    componentWillUnmount() {
        //StatsStore.unlisten(this.onChange);
    }

    onChange(state) {
        //this.setState(state);
    }

    render() {
        return (
            <div className='container'>
                <div className='panel panel-default'>
                    <table className='table table-striped'>
                        <thead>
                        <tr>
                            <th colSpan='2'>Stats</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Leading race in Top 100</td>
                            <td>{this.props.statsProps.leadingRace.race} with {this.props.statsProps.leadingRace.count} characters</td>
                        </tr>
                        <tr>
                            <td>Leading bloodline in Top 100</td>
                            <td>{this.props.statsProps.leadingBloodline.bloodline} with {this.props.statsProps.leadingBloodline.count} characters
                            </td>
                        </tr>
                        <tr>
                            <td>Amarr Characters</td>
                            <td>{this.props.statsProps.amarrCount}</td>
                        </tr>
                        <tr>
                            <td>Caldari Characters</td>
                            <td>{this.props.statsProps.caldariCount}</td>
                        </tr>
                        <tr>
                            <td>Gallente Characters</td>
                            <td>{this.props.statsProps.gallenteCount}</td>
                        </tr>
                        <tr>
                            <td>Minmatar Characters</td>
                            <td>{this.props.statsProps.minmatarCount}</td>
                        </tr>
                        <tr>
                            <td>Total votes cast</td>
                            <td>{this.props.statsProps.totalVotes}</td>
                        </tr>
                        <tr>
                            <td>Female characters</td>
                            <td>{this.props.statsProps.femaleCount}</td>
                        </tr>
                        <tr>
                            <td>Male characters</td>
                            <td>{this.props.statsProps.maleCount}</td>
                        </tr>
                        <tr>
                            <td>Total number of characters</td>
                            <td>{this.props.statsProps.totalCount}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Stats;
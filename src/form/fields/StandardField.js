import React, { Component } from 'react';


class StandardField extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: ''
        }
    }

    onChange(event) {
        console.log("StandardField", event.target.value);
        this.props.onChange(event.target.value);
        this.setState({
            value: event.target.value
        });
    }

    componentWillMount() {
        this.setState({
            value: this.props.newFormData
        })
    }

    render() {
        return (
            <div>
                <input type="string" onChange={this.onChange} value={this.state.value} />
            </div>
        )
    }

    // componentDidMount() {
    //     this.onChange({ target: { value: this.props.newFormData } });
    // }
}

export default StandardField;
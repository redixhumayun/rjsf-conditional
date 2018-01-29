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
        this.props.onChange(event.target.value);
        this.setState({
            value: event.target.value
        });
    }

    render() {
        return (
            <div>
                <input type="string" onChange={this.onChange} value={this.state.value} />
            </div>
        )
    }
}

export default StandardField;
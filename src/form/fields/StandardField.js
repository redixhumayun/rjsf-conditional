import React, { Component } from 'react';


class StandardField extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: '', 
            autofocus: false
        }
    }

    onChange(event) {
        this.props.onChange(event.target.value);
        this.setState({
            value: event.target.value
        });
    }

    render() {
        console.log("Render");
        return (
            <div>
                <input type="string" onChange={this.onChange} value={this.state.value} autoFocus={this.state.autofocus} />
            </div>
        )
    }

    componentWillMount() {
        console.log(this.props);
        if(this.props.formData) {
            this.setState({
                value: this.props.formData
            })
        }
    }

    componentDidMount() {
        console.log(this.props.name, this.props.autoF);
        this.setState({
            autofocus: this.props.autoF
        })
    }
}

export default StandardField;
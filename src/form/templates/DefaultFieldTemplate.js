import React, { Component } from 'react';

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUpdate() {
        console.log("DefaultFieldTemplate updating");
    }

    render() {
        const { id, label, help, required, description, errors, children, hidden, validationSchema } = this.props;
        let ownHidden = 'block';
        for(const [field, valObj] of Object.entries(validationSchema)) {
            valObj.dependents.filter(d => d === id)
                             .map(e => valObj.result ? ownHidden = 'block' : ownHidden = 'none');
        }

        return (
            <div style={{ display: ownHidden }}>
                <label htmlFor={id}>{label}</label>
                {description}
                {children}
                {errors}
                {help}
                {hidden}
            </div>
        );
    }
}

export default DefaultFieldTemplate;
import React, { Component } from 'react';

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, label, description, errors, children, conditionalSchema, newFormData } = this.props;
        let ownHidden = 'block';
        let autoFocus = false;
        for(const [field, valObj] of Object.entries(conditionalSchema)) {
            valObj.dependents.filter(d => d === id)
                             .map(e => valObj.result ? ownHidden = 'block' : ownHidden = 'none');
        }

        if(id === 'root_fireFighter') {
            autoFocus = true;
        }
        const childCopy = React.cloneElement(children, { autoF: autoFocus });

        return (
            <div style={{ display: ownHidden }}>
                <label htmlFor={id}>{label}</label>
                {description}
                {childCopy}
                {errors}
            </div>
        );
    }
}

export default DefaultFieldTemplate;
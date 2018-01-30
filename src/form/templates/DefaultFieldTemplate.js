import React, { Component } from 'react';

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, label, description, errors, children, validationSchema, newFormData } = this.props;
        let ownHidden = 'block';
        for(const [field, valObj] of Object.entries(validationSchema)) {
            valObj.dependents.filter(d => d === id)
                             .map(e => valObj.result ? ownHidden = 'block' : ownHidden = 'none');
        }
        // let tempID;
        // let childClone = React.cloneElement(children);
        // if(id !== 'root') {
        //     tempID = id.replace('root_', '');
        //     if(newFormData && newFormData[tempID]) {
        //         childClone = React.cloneElement(children, { newFormData: newFormData[tempID] });
        //     }
        // }
        console.log(id, ownHidden);

        return (
            <div style={{ display: ownHidden }}>
                <label htmlFor={id}>{label}</label>
                {description}
                {children}
                {errors}
            </div>
        );
    }
}

export default DefaultFieldTemplate;
import React, { Component } from 'react';

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, label, description, errors, children, hidden } = this.props;
        console.log(id, hidden);

        return (
            <div>
                <label htmlFor={id}>{label}</label>
                {description}
                {children}
                {errors}
            </div>
        );
    }
}

export default DefaultFieldTemplate;
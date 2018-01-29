import React, { Component } from 'react';
import Form from 'react-jsonschema-form';

const schema = {
    title: "My Form",
    description: "A Random Form", 
    type: "object", 
    properties: {
        firstName: {
            type: "string", 
            title: "What is your first name"
        }, 
        lastName: {
            type: "string", 
            title: "What is your last name"
        }
    }
}

class TempForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit({formData}) {
        console.log(formData);
    }
    
    render() {
        return <Form schema={schema}
                onSubmit={this.onSubmit} />
    }
}

export default TempForm;
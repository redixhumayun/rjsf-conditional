import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import StandardField from './fields/StandardField';
import DefaultFieldTemplate from './templates/DefaultFieldTemplate';
import * as evaluate from 'static-eval';
import { parse } from 'esprima';

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
        }, 
        fireFighter: {
            type: "string", 
            title: "Are you a firefighter?"
        },
        fireFighterID: {
            type: "string", 
            title: "What is your firefighter ID?"
        }, 
        fireFighterRank: {
            type: "string", 
            title: "What is your fire fighter rank?"
        }
    }
}

const uiSchema = {
    firstName: {
        "ui:field": "StandardField"
    }, 
    lastName: {
        "ui:field": "StandardField"
    }, 
    fireFighter: {
        "ui:field": "StandardField"
    }, 
    fireFighterID: {
        "ui:widget": "hidden",
        "ui:field": "StandardField"
    }, 
    fireFighterRank: {
        "ui:widget": "hidden",
        "ui:field": "StandardField"
    }
}

const validationSchema = {
    "root_fireFighter": {
        expression: "root_fireFighter === 'Yes'", 
        dependents: [
            "root_fireFighterID", 
            "root_fireFighterRank"
        ], 
        result: false
    }
}   

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            validationSchema: validationSchema, 
            uiSchema: uiSchema
        }
        this.fields = {
            StandardField: StandardField
        };
    }

    validate(formData, errors) {
        const { validationSchema } = this.state;
        const { uiSchema } = this.state;
        let payload = {};
        for(const [field, valObj] of Object.entries(validationSchema)) {
            let temp = field.replace("root_", "");
            let expression = parse(valObj.expression).body[0].expression;
            let lookup = 'formData.' + temp;
            let payload = {};
            payload[field] = eval(lookup);
            valObj.result = evaluate(expression, payload);
            if(valObj.result) {
                valObj.dependents.map(d => {
                    let d_temp = d.replace("root_", "");
                    uiSchema[d_temp]["ui:widget"] = uiSchema[d_temp]["actualWidget"];
                    formData[d_temp] = "Anything";
                })
            }
        }
        this.setState({
            validationSchema,
            uiSchema
        });
        return errors;
    }

    onSubmit({formData}) {
        this.setState({
            formdata: formData
        })
    }

    render() {
        console.log(this.state.uiSchema);
        return (
            <Form schema={schema}
                    uiSchema={this.state.uiSchema}
                    fields={this.fields}
                    FieldTemplate={DefaultFieldTemplate}
                    liveValidate={false}
                    validate={this.validate}
                    onSubmit={this.onSubmit} />
        )
    }
}

export default FormContainer;
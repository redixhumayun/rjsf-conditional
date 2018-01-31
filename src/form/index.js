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
        "ui:field": "StandardField"
    }, 
    fireFighterRank: {
        "ui:field": "StandardField"
    }
}

const conditionalSchema = {
    "root_fireFighter": {
        expression: "root_fireFighter === 'Yes'", 
        dependents: [
            "root_fireFighterID", 
            "root_fireFighterRank"
        ], 
        result: false
    }
}   

const Wrapper = (Comp) => (conditionalSchema, formData) => {
    return class extends Component {
        render() {
            return <Comp {...this.props} conditionalSchema={conditionalSchema} newFormData={formData} />
        }
    }
}

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.conditionalValidation = this.conditionalValidation.bind(this);
        this.formdata = {};
        // this.template = Wrapper(DefaultFieldTemplate)(conditionalSchema)
        
        this.state = {
            conditionalSchema: conditionalSchema,
        }
        this.fields = {
            StandardField: StandardField
        };
    }

    conditionalValidation(formData) {
        const { conditionalSchema } = this.state;
        let payload = {};
        for(const [field, valObj] of Object.entries(conditionalSchema)) {
            let temp = field.replace("root_", "");
            let expression = parse(valObj.expression).body[0].expression;
            let lookup = 'formData.' + temp;
            let payload = {};
            payload[field] = eval(lookup);
            valObj.result = evaluate(expression, payload);
        }
        return conditionalSchema;
    }

    validate(formData, errors) {
        const { conditionalSchema } = this.state;
        let payload = {};
        for(const [field, valObj] of Object.entries(conditionalSchema)) {
            let temp = field.replace("root_", "");
            let expression = parse(valObj.expression).body[0].expression;
            let lookup = 'formData.' + temp;
            let payload = {};
            payload[field] = eval(lookup);
            valObj.result = evaluate(expression, payload);
        }
        this.setState({
            conditionalSchema: conditionalSchema, 
        });
        // this.template = Wrapper(DefaultFieldTemplate)(conditionalSchema);
        return errors;
    }

    onChange({formData}) {
        let conditionalSchema = this.conditionalValidation(formData);
        Object.keys(formData).map(key => {
            this.formdata[key] = formData[key];
        })
        this.formdata['random'] = new Date().getTime();
        this.setState({
            conditionalSchema
        });
        // this.template = Wrapper(DefaultFieldTemplate)(conditionalSchema);
        console.log(this.formdata);
    }

    onSubmit({formData}) {
        console.log("onSubmit", formData);
    }

    render() {
        console.log("Rendering again");
        return (
            <Form schema={schema}
                    uiSchema={uiSchema}
                    liveValidate={false}
                    /* validate={this.validate} */
                    FieldTemplate={Wrapper(DefaultFieldTemplate)(this.state.conditionalSchema)}
                    onChange={this.onChange}
                    formData={this.formdata}
                    onSubmit={this.onSubmit} />
        )
    }
}

export default FormContainer;
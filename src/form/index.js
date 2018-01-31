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

const validationSchema = {
    "root_fireFighter": {
        expression: "root_fireFighter === 'Yes'", 
        dependents: [
            "root_fireFighterID", 
            "root_fireFighterRank"
        ], 
        result: false
    }, 
    "root_policeMan": {
        expression: "root_policeMan === 'Yes'",
        dependents: [
            "root_policeManID", 
            "root_policeManRank"
        ], 
        result: false
    }
}   

const Wrapper = (Comp) => (validationSchema, formData) => {
    return class extends Component {
        render() {
            return <Comp {...this.props} validationSchema={validationSchema} newFormData={formData} />
        }
    }
}

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.formdata = {
            firstName: 'Zaid', 
            lastName: '', 
            fireFighter: '', 
            fireFighterID: '', 
            fireFighterRank: '', 
            random: ''
        };
        this.state = {
            validationSchema: validationSchema,
            template: Wrapper(DefaultFieldTemplate)(validationSchema)
        }
        this.fields = {
            StandardField: StandardField
        };
    }

    validate(formData, errors) {
        const { validationSchema } = this.state;
        let payload = {};
        for(const [field, valObj] of Object.entries(validationSchema)) {
            let temp = field.replace("root_", "");
            let expression = parse(valObj.expression).body[0].expression;
            let lookup = 'formData.' + temp;
            let payload = {};
            payload[field] = eval(lookup);
            valObj.result = evaluate(expression, payload);
        }
        this.setState({
            validationSchema: validationSchema, 
            template: Wrapper(DefaultFieldTemplate)(validationSchema)
        });
        return errors;
    }

    onChange(form) {
        console.log("onChange", form.formData);
        // this.formdata = form.formData;
    }

    onSubmit({formData}) {
        console.log("onSubmit", formData);
        // this.formdata['fireFighter'] = formData['fireFighter'];
        Object.keys(this.formdata).map(key => {
            if(formData[key] != "") {
                let value = formData[key];
                let newValue = new String(value);
                console.log(newValue);
                this.formdata[key] = newValue.toString();
            }
        });
        this.formdata['random'] = new Date().getTime();
        // this.formdata = {...formData};
        console.log(this.formdata);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.group("SCU");
        console.log("this.state", this.state);
        console.log("nextState", nextState);
        console.groupEnd();
        return true;
    }

    render() {
        console.log("Rendering again");
        return (
            <Form schema={schema}
                    uiSchema={uiSchema}
                    liveValidate={false}
                    validate={this.validate}
                    FieldTemplate={this.state.template}
                    /* onChange={this.onChange} */
                    formData={this.formdata}
                    onSubmit={this.onSubmit} />
        )
    }
}

export default FormContainer;
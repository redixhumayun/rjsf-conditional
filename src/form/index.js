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
        }, 
        policeMan: {
            type: "string", 
            title: "Are you a policeman?"
        }, 
        policeManRank: {
            type: "string", 
            title: "What is your police man rank? "
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
    }, 
    policeMan: {
        "ui:field": "StandardField"
    }, 
    policeManRank: {
        "ui:field": "StandardField"
    }
}

const conditionalSchema = {
    "fireFighter": {
        expression: "fireFighter === 'Yes'", 
        dependents: [
            "fireFighterID", 
            "fireFighterRank"
        ]
    }, 
    "policeMan": {
        expression: "policeMan === 'Yes'",
        dependents: [
            "policeManRank", 
        ]
    }
}   

const Wrapper = (Comp) => (args) => (fun) => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                fd: props.formData
            }
        }

        render() {
            return <Comp {...this.props} {...args} 
                    callFun={(arg) => fun()} />
        }
    }
}

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.formdata = {};
        this.conditionalSchema = conditionalSchema;
        this.handleCallback = this.handleCallback.bind(this);
        this.fields = {
            StandardField: StandardField
        };
        this.state = {
            formdata: null, 
            conditionalSchema: null
        }
    }

    handleCallback(e) {
        this.forceUpdate();
    }

    conditionalValidation(formData) {
        let payload = {};
        for(const [field, valObj] of Object.entries(this.conditionalSchema)) {
            let temp = field.replace("root_", "");
            let expression = parse(valObj.expression).body[0].expression;
            let lookup = 'formData.' + temp;
            let payload = {};
            payload[field] = eval(lookup);
        }
    }

    onChange({formData}) {
        let conditionalSchema = this.conditionalValidation(formData);
        Object.keys(formData).map(key => {
            this.formdata[key] = formData[key];
        })
        this.formdata['random'] = new Date().getTime();
        console.log(this.formdata);
    }

    onSubmit({formData}) {
        console.log("onSubmit", formData);
    }

    render() {
        return (
            <Form schema={schema}
                    uiSchema={uiSchema}
                    liveValidate={false}
                    FieldTemplate={Wrapper(DefaultFieldTemplate)({conditionalSchema: this.conditionalSchema, 
                                                                    formData: this.formdata})(this.handleCallback)}
                    formData={this.formdata}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit} />
        )
    }
}

export default FormContainer;
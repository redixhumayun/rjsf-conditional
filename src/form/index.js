import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import * as evaluate from 'static-eval';
import { parse } from 'esprima';

import StandardField from './fields/StandardField';
import DefaultFieldTemplate from './templates/DefaultFieldTemplate';
import traverse from './traverse';

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
            type: "boolean", 
            title: "Are you a policeman?"
        }, 
        policeManRank: {
            type: "string", 
            title: "What is your police man rank? "
        }, 
        nestedObject: {
            type: "object", 
            title: "This is a nested object", 
            properties: {
                nestedObject1: {
                    type: "boolean", 
                    title: "Check this to see the next option"
                }, 
                nestedObject2: {
                    type: "string", 
                    title: "This is the next option"
                }
            }
        }
    }
}

const uiSchema = {
    firstName: {
        "ui:field": "StandardField", 
    }, 
    lastName: {
        "ui:field": "StandardField", 
    }, 
    fireFighter: {
        "ui:field": "StandardField", 
    }, 
    fireFighterID: {
        "ui:field": "StandardField", 
    }, 
    fireFighterRank: {
        "ui:field": "StandardField", 
    }, 
    policeMan: {
        "ui:field": "StandardField", 
    }, 
    policeManRank: {
        "ui:field": "StandardField", 
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
        expression: "policeMan === true",
        dependents: [
            "policeManRank", 
        ]
    }, 
    "nestedObject_nestedObject1": {
        expression: "nestedObject_nestedObject1 === true", 
        dependents: [
            "nestedObject_nestedObject2"
        ]
    }
}   

const Wrapper = (Comp) => (args) => (fun) => {
    return class extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return <Comp {...this.props} {...args} 
                    callFun={() => fun()} />
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
        this.conditionalValidation(formData);
        Object.keys(formData).map(key => {
            this.formdata[key] = formData[key];
        })
        this.formdata['random'] = new Date().getTime();
        console.log(this.formdata);
    }

    onSubmit({formData}) {
        traverse(formData).reduce(function(acc) {
            console.log(this);
        }) 
        console.log("onSubmit", formData);
    }

    render() {
        return (
            <Form schema={schema}
                    liveValidate={false}
                    uiSchema={uiSchema}
                    FieldTemplate={Wrapper(DefaultFieldTemplate)({conditionalSchema: this.conditionalSchema, 
                                                                    formData: this.formdata})(this.handleCallback)}
                    formData={this.formdata}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit} />
        )
    }
}

export default FormContainer;
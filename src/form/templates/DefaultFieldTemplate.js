import React, { Component } from 'react';
import * as evaluate from 'static-eval';
import { parse } from 'esprima';

import TextField from '../widgets/TextField';

let hiddenElements = [];
let firstRender = true; //to make sure it doesn't re-render the very first time

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        const { id, label, description, errors, children, conditionalSchema, schema } = this.props;
        let ownHidden = 'block';
        console.log("hiddenElements", hiddenElements);
        if(hiddenElements.length > 0) {
            hiddenElements.map(h => {
                let temp_id = id.replace('root_', '');
                if(h === temp_id) {
                    ownHidden = 'none';
                }
            })
        }
        if(id === 'root') {
            let prevLength = hiddenElements.length;
            console.log("prevLength", prevLength);
            hiddenElements = [];            
            for(const [field, conObj] of Object.entries(conditionalSchema)) {
                let expression = parse(conObj.expression).body[0].expression;
                let lookup = 'this.props.children.props.formData.' + field;
                let payload = {};
                payload[field] = eval(lookup);
                if(!evaluate(expression, payload)) {
                    conObj.dependents.map(c => hiddenElements.push(c));
                }
            }
            if(hiddenElements.length !== prevLength) {
                if(firstRender) {
                    firstRender = false;
                } else {
                    console.log("Re-rendering");
                    console.log(hiddenElements.length, prevLength)
                    setTimeout(() => {
                        this.props.callFun("Re-render");
                    }, 1);
                }
            }
        }

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
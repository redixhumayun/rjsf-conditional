import React, { Component } from 'react';
import * as evaluate from 'static-eval';
import { parse } from 'esprima';

import traverse from '../traverse';

let hiddenElements = [];
let firstRender = true; //to make sure it doesn't re-render the very first time

class DefaultFieldTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, label, description, errors, children, conditionalSchema, schema } = this.props;
        console.log("hiddenElements", hiddenElements);
        console.log("id", id);
        let ownHidden = 'block';
        if(hiddenElements.length > 0) {
            hiddenElements.map(h => {
                let temp_id = id.replace('root_', '');
                if(h === temp_id) {
                    ownHidden = 'none';
                }
            })
        }
        let prevLength = hiddenElements.length;
        if(id === 'root') {
            hiddenElements = [];
            const { formData } = this.props.children.props;
            console.log(formData);
            traverse(formData).reduce(function(acc) {
                if(this.isLeaf) {
                    let field = this.path.join('_');
                    console.log("field", field);
                    let expression = conditionalSchema[field] ? conditionalSchema[field].expression : null
                    if(expression) {
                        let ast = parse(expression).body[0].expression;
                        let lookup = 'formData.' + field.replace(/_/g, '.');
                        let payload = {};
                        payload[field] = eval(lookup);
                        console.log("lookup", lookup);
                        console.log("payload", payload);
                        console.log("result", evaluate(ast, payload));
                        if(!evaluate(ast, payload)) {
                            conditionalSchema[field].dependents.map(d => hiddenElements.push(d));
                        }
                    }
                }
            })
        }
        if(prevLength !== hiddenElements.length) {
            if(firstRender) {
                firstRender = false;
            } else [
                setTimeout(() => {
                    this.props.callFun();
                }, 1)
            ]
        }
        // if(id === 'root') {
        //     let prevLength = hiddenElements.length;
        //     hiddenElements = [];            
        //     for(const [field, conObj] of Object.entries(conditionalSchema)) {
        //         let expression = parse(conObj.expression).body[0].expression;
        //         let lookup = 'this.props.children.props.formData.' + field;
        //         let payload = {};
        //         payload[field] = eval(lookup);
        //         if(!evaluate(expression, payload)) {
        //             conObj.dependents.map(c => hiddenElements.push(c));
        //         }
        //     }
        //     console.log("Hidden elements", hiddenElements);
        //     if(hiddenElements.length !== prevLength) {
        //         if(firstRender) {
        //             firstRender = false;
        //         } else {
        //             setTimeout(() => {
        //                 this.props.callFun();
        //             }, 1);
        //         }
        //     }
        // }

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